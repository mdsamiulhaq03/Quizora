export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import WeakQuestion from "@/lib/models/WeakQuestion";
import { getNextReviewDate, resetSRS } from "@/lib/srs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { questionId, isCorrect, confidence } = body as Record<string, unknown>;

  if (typeof questionId !== "string" || !questionId.trim()) {
    return NextResponse.json({ error: "Invalid questionId" }, { status: 400 });
  }
  if (typeof isCorrect !== "boolean") {
    return NextResponse.json({ error: "Invalid isCorrect" }, { status: 400 });
  }
  const safeConfidence =
    confidence === "low" || confidence === "medium" || confidence === "high"
      ? confidence
      : "medium";

  await dbConnect();
  const wq = await WeakQuestion.findById(questionId);
  if (!wq || wq.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (isCorrect) {
    const { nextReviewAt, srsInterval } = getNextReviewDate(wq.srsInterval);
    await WeakQuestion.findByIdAndUpdate(questionId, {
      $push: { confidenceHistory: safeConfidence },
      nextReviewAt,
      srsInterval,
      lastAttemptedAt: new Date(),
    });
  } else {
    const { nextReviewAt, srsInterval } = resetSRS();
    await WeakQuestion.findByIdAndUpdate(questionId, {
      $inc: { timesWrong: 1 },
      $push: { confidenceHistory: safeConfidence },
      nextReviewAt,
      srsInterval,
      lastAttemptedAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
