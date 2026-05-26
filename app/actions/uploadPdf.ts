"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Quiz from "@/lib/models/Quiz";
import { processPdfJob } from "@/lib/processPdfJob";
import { truncateToWords, countWords } from "@/lib/truncate";
import { uploadRatelimit } from "@/lib/ratelimit";
import { WORD_LIMIT } from "@/lib/config";
import type { Difficulty, QuestionType } from "@/lib/types";

interface UploadResult {
  success: boolean;
  quizId?: string;
  duplicate?: boolean;
  duplicateDate?: string;
  error?: string;
}

export async function uploadPdf(formData: FormData): Promise<UploadResult> {
  const session = await auth();

  const file = formData.get("file") as File;
  const difficulty = (formData.get("difficulty") as Difficulty) || "medium";
  const questionCount = parseInt(formData.get("questionCount") as string) || 10;
  const questionTypesRaw = formData.getAll("questionTypes") as QuestionType[];
  const questionTypes =
    questionTypesRaw.length > 0 ? questionTypesRaw : ["mcq" as QuestionType];

  if (!file) return { success: false, error: "No file provided" };
  if (!file.name.endsWith(".pdf"))
    return { success: false, error: "Only PDF files are allowed" };
  if (file.size > 10 * 1024 * 1024)
    return { success: false, error: "File too large (max 10MB)" };

  const isGuest = !session?.user;

  // Rate limiting: 3 uploads per 24h per user/IP
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = isGuest ? `guest:${ip}` : `user:${session!.user.id}`;
  const { success: rateOk } = await uploadRatelimit.limit(rateLimitKey);
  if (!rateOk) {
    return {
      success: false,
      error: isGuest
        ? "Upload limit reached. Sign in for more uploads."
        : "Upload limit reached (3 per 24 hours). Try again later.",
    };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentHash = createHash("sha256").update(buffer).digest("hex");

  await dbConnect();

  const forceNew = formData.get("forceNew") === "true";

  // Check for duplicate — only for logged-in users (guests are ephemeral)
  if (!isGuest && !forceNew) {
    const existing = await PDF.findOne({
      userId: session!.user.id,
      contentHash,
      processingStatus: "done",
    });

    if (existing) {
      // Find the most recent quiz generated from this PDF
      const existingQuiz = await Quiz.findOne({ pdfId: existing._id })
        .sort({ createdAt: -1 })
        .select("_id createdAt");

      if (existingQuiz) {
        return {
          success: true,
          quizId: existingQuiz._id.toString(),
          duplicate: true,
          duplicateDate: (existingQuiz as { createdAt?: Date }).createdAt?.toLocaleDateString() ?? "",
        };
      }
      // PDF exists but no quiz yet — fall through and regenerate
    }
  }

  // Extract text
  let rawText = "";
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    rawText = result.text || "";
  } catch {
    return { success: false, error: "Failed to extract text from PDF" };
  }

  if (!rawText.trim()) {
    return { success: false, error: "No text found in PDF" };
  }

  const wordCount = countWords(rawText);
  const truncatedText = truncateToWords(rawText, WORD_LIMIT);
  const wasTruncated = wordCount > WORD_LIMIT;

  const pdf = await PDF.create({
    userId: isGuest ? null : session!.user.id,
    guestIp: null,
    filename: file.name,
    fileSize: file.size,
    contentHash,
    rawText,
    truncatedText,
    wordCount,
    wasTruncated,
    processingStatus: "pending",
  });

  try {
    const quizId = await processPdfJob({
      pdfId: pdf._id.toString(),
      userId: isGuest ? null : (session!.user.id ?? null),
      guestIp: null,
      userEmail: isGuest ? null : session!.user.email ?? null,
      difficulty,
      questionCount,
      questionTypes,
    });
    return { success: true, quizId };
  } catch {
    await PDF.findByIdAndUpdate(pdf._id, { processingStatus: "failed" });
    return { success: false, error: "Failed to generate quiz. Please try again." };
  }
}
