"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import { inngest } from "@/inngest/client";
import { groqRatelimit } from "@/lib/ratelimit";
import type { Difficulty, QuestionType } from "@/lib/types";

export async function regenerateQuiz(
  pdfId: string,
  difficulty: Difficulty,
  questionCount: number,
  questionTypes: QuestionType[]
) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const userId = session.user.id;
  const limit = await groqRatelimit.limit(userId);
  if (!limit.success) {
    return {
      success: false,
      error: "Daily AI usage limit reached. Try again tomorrow.",
    };
  }

  await dbConnect();

  const pdf = await PDF.findById(pdfId);
  if (!pdf) return { success: false, error: "PDF not found" };
  if (pdf.userId !== userId) return { success: false, error: "Forbidden" };

  await inngest.send({
    name: "pdf/process",
    data: {
      pdfId,
      userId,
      guestIp: null,
      userEmail: session.user.email,
      difficulty,
      questionCount,
      questionTypes,
    },
  });

  return { success: true };
}
