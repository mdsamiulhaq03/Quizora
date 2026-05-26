"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import WeakQuestion from "@/lib/models/WeakQuestion";
import redis, { CACHE_KEYS } from "@/lib/redis";

export async function clearWeakQuestions(): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await dbConnect();
  await WeakQuestion.deleteMany({ userId: session.user.id });
  await redis.del(CACHE_KEYS.weakQuestions(session.user.id));
  await redis.del(CACHE_KEYS.progress(session.user.id));

  return { success: true };
}
