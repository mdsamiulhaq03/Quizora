"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import QuizSession from "@/lib/models/QuizSession";

export async function pauseQuiz(
  quizId: string,
  currentIndex: number,
  answers: Record<string, string>
) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await dbConnect();

  await QuizSession.findOneAndUpdate(
    { userId: session.user.id, quizId },
    {
      userId: session.user.id,
      quizId,
      answers,
      currentQuestionIndex: currentIndex,
    },
    { upsert: true, new: true }
  );

  return { success: true };
}

export async function resumeQuiz(quizId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  await dbConnect();

  const sessionData = await QuizSession.findOne({
    userId: session.user.id,
    quizId,
  }).lean();

  return sessionData;
}
