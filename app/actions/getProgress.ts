"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Attempt from "@/lib/models/Attempt";
import WeakQuestion from "@/lib/models/WeakQuestion";
import User from "@/lib/models/User";
import redis, { CACHE_KEYS, CACHE_TTL } from "@/lib/redis";
import type { ProgressStats } from "@/lib/types";

export async function getProgress(): Promise<ProgressStats | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const cacheKey = CACHE_KEYS.progress(userId);

  const cached = await redis.get<ProgressStats>(cacheKey);
  if (cached) return cached;

  await dbConnect();

  const [attempts, weakDue, user] = await Promise.all([
    Attempt.find({ userId, completedAt: { $exists: true } })
      .populate("quizId", "title")
      .sort({ completedAt: -1 })
      .lean(),
    WeakQuestion.countDocuments({ userId, nextReviewAt: { $lte: new Date() } }),
    User.findOne({ email: session.user.email }).lean(),
  ]);

  const totalQuizzes = attempts.length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          (attempts.reduce((acc, a) => acc + (a.score / a.total) * 100, 0) /
            totalQuizzes) *
            10
        ) / 10
      : 0;

  const bestScore =
    totalQuizzes > 0
      ? Math.round(
          Math.max(...attempts.map((a) => (a.score / a.total) * 100))
        )
      : 0;

  const scoreHistory = attempts
    .slice(0, 30)
    .reverse()
    .map((a) => ({
      date: new Date(a.completedAt!).toLocaleDateString(),
      score: Math.round((a.score / a.total) * 100),
    }));

  const topicMap: Record<string, number> = {};
  for (const attempt of attempts) {
    for (const ans of attempt.answers) {
      if (!ans.isCorrect) {
        // We'd need to join with quiz questions for topic — simplified here
        topicMap["General"] = (topicMap["General"] || 0) + 1;
      }
    }
  }

  const topicWeakness = Object.entries(topicMap)
    .map(([topic, wrongCount]) => ({ topic, wrongCount }))
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 10);

  const recentQuizzes = attempts.slice(0, 10).map((a) => ({
    id: a._id.toString(),
    title: (a.quizId as unknown as { title: string })?.title || "Quiz",
    score: a.score,
    total: a.total,
    completedAt: a.completedAt!,
  }));

  const stats: ProgressStats = {
    totalQuizzes,
    averageScore,
    weakQuestionsDue: weakDue,
    streak: (user as { streak?: number } | null)?.streak || 0,
    bestScore,
    scoreHistory,
    topicWeakness,
    recentQuizzes,
  };

  await redis.setex(cacheKey, CACHE_TTL.progress, stats);

  return stats;
}
