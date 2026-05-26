"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import { processPdfJob } from "@/lib/processPdfJob";
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

  await dbConnect();

  const pdf = await PDF.findById(pdfId);
  if (!pdf) return { success: false, error: "PDF not found" };
  if (pdf.userId !== userId) return { success: false, error: "Forbidden" };

  try {
    const quizId = await processPdfJob({
      pdfId,
      userId,
      guestIp: null,
      userEmail: session.user.email ?? null,
      difficulty,
      questionCount,
      questionTypes,
    });
    return { success: true, quizId };
  } catch {
    return { success: false, error: "Failed to generate quiz. Please try again." };
  }
}
