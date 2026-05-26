"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Attempt from "@/lib/models/Attempt";
import Quiz from "@/lib/models/Quiz";
import WeakQuestion from "@/lib/models/WeakQuestion";
import User from "@/lib/models/User";
import redis, { CACHE_KEYS } from "@/lib/redis";
import { resetSRS, getNextReviewDate } from "@/lib/srs";
import { headers } from "next/headers";
import { STREAK_FREEZE_EARN_INTERVAL } from "@/lib/config";
import type { AnswerRecord } from "@/lib/types";

interface SubmitAttemptResult {
  success: boolean;
  attemptId?: string;
  error?: string;
}

export async function submitAttempt(
  quizId: string,
  answers: AnswerRecord[]
): Promise<SubmitAttemptResult> {
  const session = await auth();
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const isGuest = !session?.user;
  const userId = isGuest ? null : session!.user.id!;

  await dbConnect();

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return { success: false, error: "Quiz not found" };

  const score = answers.filter((a) => a.isCorrect).length;

  const attempt = await Attempt.create({
    userId,
    guestIp: isGuest ? ip : null,
    quizId,
    answers,
    score,
    total: answers.length,
    completedAt: new Date(),
  });

  if (!isGuest && userId) {
    // Upsert weak questions
    const wrongAnswers = answers.filter((a) => !a.isCorrect);

    for (const ans of wrongAnswers) {
      const question = quiz.questions.find((q) => q.id === ans.questionId);
      if (!question) continue;

      const existing = await WeakQuestion.findOne({
        userId,
        quizId,
        questionId: ans.questionId,
      });

      if (existing) {
        const freqUpdate: Record<string, number> = {
          ...existing.wrongAnswerFrequency,
        };
        if (["A", "B", "C", "D"].includes(ans.selectedAnswer)) {
          freqUpdate[ans.selectedAnswer] =
            (freqUpdate[ans.selectedAnswer] || 0) + 1;
        }

        const { nextReviewAt, srsInterval } = resetSRS();

        await WeakQuestion.findByIdAndUpdate(existing._id, {
          $inc: { timesWrong: 1 },
          $push: { confidenceHistory: ans.confidence },
          wrongAnswerFrequency: freqUpdate,
          nextReviewAt,
          srsInterval,
          lastAttemptedAt: new Date(),
          misconceptionFlag: detectMisconception(
            freqUpdate,
            question.correctAnswer
          ),
        });
      } else {
        const { nextReviewAt, srsInterval } = resetSRS();
        const freqMap = { A: 0, B: 0, C: 0, D: 0 };
        if (["A", "B", "C", "D"].includes(ans.selectedAnswer)) {
          freqMap[ans.selectedAnswer as keyof typeof freqMap] = 1;
        }

        await WeakQuestion.create({
          userId,
          quizId,
          questionId: ans.questionId,
          question: question.question,
          type: question.type,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          topic: question.topic,
          timesWrong: 1,
          wrongAnswerFrequency: freqMap,
          misconceptionFlag: "",
          confidenceHistory: [ans.confidence],
          nextReviewAt,
          srsInterval,
          lastAttemptedAt: new Date(),
        });
      }
    }

    // Remove correctly answered questions from WeakQuestion
    const correctAnswers = answers.filter((a) => a.isCorrect);
    for (const ans of correctAnswers) {
      const existing = await WeakQuestion.findOne({
        userId,
        quizId,
        questionId: ans.questionId,
      });
      if (existing) {
        const { nextReviewAt, srsInterval } = getNextReviewDate(
          existing.srsInterval
        );
        await WeakQuestion.findByIdAndUpdate(existing._id, {
          $push: { confidenceHistory: ans.confidence },
          nextReviewAt,
          srsInterval,
          lastAttemptedAt: new Date(),
        });
      }
    }

    // Update streak
    await updateStreak(userId);

    // Invalidate caches
    await redis.del(CACHE_KEYS.progress(userId));
    await redis.del(CACHE_KEYS.weakQuestions(userId));
  }

  return { success: true, attemptId: attempt._id.toString() };
}

function detectMisconception(
  freq: Record<string, number>,
  correctAnswer: string
): string {
  const sorted = Object.entries(freq)
    .filter(([k]) => k !== correctAnswer)
    .sort(([, a], [, b]) => b - a);
  if (sorted.length > 0 && sorted[0][1] >= 2) {
    return `Frequently choosing ${sorted[0][0]}`;
  }
  return "";
}

async function updateStreak(userId: string) {
  const user = await User.findOne({ _id: userId });
  if (!user) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!user.lastStudiedAt) {
    await User.findByIdAndUpdate(userId, {
      streak: 1,
      lastStudiedAt: now,
    });
    return;
  }

  const lastStudied = new Date(user.lastStudiedAt);
  const lastDay = new Date(
    lastStudied.getFullYear(),
    lastStudied.getMonth(),
    lastStudied.getDate()
  );

  const diffDays = Math.floor(
    (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return; // already studied today

  if (diffDays === 1) {
    const newStreak = (user.streak || 0) + 1;
    // Earn a new freeze at every STREAK_FREEZE_EARN_INTERVAL-day milestone
    const earnedFreeze = newStreak % STREAK_FREEZE_EARN_INTERVAL === 0;
    await User.findByIdAndUpdate(userId, {
      streak: newStreak,
      lastStudiedAt: now,
      ...(earnedFreeze ? { streakFreezeUsed: false } : {}),
    });
  } else if (!user.streakFreezeUsed) {
    // Freeze auto-activates: protect the streak, consume the freeze
    const newStreak = (user.streak || 0) + 1;
    await User.findByIdAndUpdate(userId, {
      streak: newStreak,
      lastStudiedAt: now,
      streakFreezeUsed: true,
    });
  } else {
    // No freeze available — streak resets
    await User.findByIdAndUpdate(userId, {
      streak: 1,
      lastStudiedAt: now,
    });
  }
}
