export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/lib/models/Quiz";
import redis, { CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params;

  const cacheKey = CACHE_KEYS.quiz(quizId);
  const cached = await redis.get(cacheKey);
  if (cached) return NextResponse.json(cached);

  await dbConnect();
  const quiz = await Quiz.findById(quizId).lean();
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await redis.setex(cacheKey, CACHE_TTL.quiz, quiz);
  return NextResponse.json(quiz);
}
