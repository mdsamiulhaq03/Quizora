"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import { inngest } from "@/inngest/client";
import {
  checkGuestUploadLimit,
  setGuestUploadUsed,
  uploadRatelimit,
  groqRatelimit,
} from "@/lib/ratelimit";
import { truncateToWords, countWords } from "@/lib/truncate";
import { headers } from "next/headers";
import type { Difficulty, QuestionType } from "@/lib/types";

interface UploadResult {
  success: boolean;
  pdfId?: string;
  quizId?: string;
  error?: string;
  resetsAt?: Date;
}

export async function uploadPdf(formData: FormData): Promise<UploadResult> {
  const session = await auth();
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

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

  // Rate limit checks
  if (isGuest) {
    const alreadyUsed = await checkGuestUploadLimit(ip);
    if (alreadyUsed) {
      return {
        success: false,
        error:
          "You've already used your free upload. Sign up for 3 uploads per day, progress tracking, spaced repetition, and more.",
      };
    }
  } else {
    const userId = session!.user.id!;

    const uploadLimit = await uploadRatelimit.limit(userId);
    if (!uploadLimit.success) {
      const resetsAt = new Date(uploadLimit.reset);
      return {
        success: false,
        error: `You've reached your 3 upload limit for today. Resets in ${formatCountdown(resetsAt)}.`,
        resetsAt,
      };
    }

    const groqLimit = await groqRatelimit.limit(userId);
    if (!groqLimit.success) {
      return {
        success: false,
        error: "Daily AI usage limit reached. Try again tomorrow.",
      };
    }
  }

  // Extract PDF text
  const buffer = Buffer.from(await file.arrayBuffer());

  let rawText = "";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    rawText = data.text || "";
  } catch {
    return { success: false, error: "Failed to extract text from PDF" };
  }

  if (!rawText.trim()) {
    return { success: false, error: "No text found in PDF" };
  }

  const wordCount = countWords(rawText);
  const truncatedText = truncateToWords(rawText, 2000);
  const wasTruncated = wordCount > 2000;

  await dbConnect();

  const pdf = await PDF.create({
    userId: isGuest ? null : session!.user.id,
    guestIp: isGuest ? ip : null,
    filename: file.name,
    fileSize: file.size,
    rawText,
    truncatedText,
    wordCount,
    wasTruncated,
    processingStatus: "pending",
  });

  if (isGuest) {
    await setGuestUploadUsed(ip);
  }

  await inngest.send({
    name: "pdf/process",
    data: {
      pdfId: pdf._id.toString(),
      userId: isGuest ? null : session!.user.id,
      guestIp: isGuest ? ip : null,
      userEmail: isGuest ? null : session!.user.email,
      difficulty,
      questionCount,
      questionTypes,
    },
  });

  return { success: true, pdfId: pdf._id.toString() };
}

function formatCountdown(resetsAt: Date): string {
  const ms = resetsAt.getTime() - Date.now();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}
