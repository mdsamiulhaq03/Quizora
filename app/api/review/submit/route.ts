export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import WeakQuestion from "@/lib/models/WeakQuestion";
import { getNextReviewDate, resetSRS } from "@/lib/srs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questionId, isCorrect, confidence } = await req.json();

  await dbConnect();
  const wq = await WeakQuestion.findById(questionId);
  if (!wq || wq.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (isCorrect) {
    const { nextReviewAt, srsInterval } = getNextReviewDate(wq.srsInterval);
    await WeakQuestion.findByIdAndUpdate(questionId, {
      $push: { confidenceHistory: confidence },
      nextReviewAt,
      srsInterval,
      lastAttemptedAt: new Date(),
    });
  } else {
    const { nextReviewAt, srsInterval } = resetSRS();
    await WeakQuestion.findByIdAndUpdate(questionId, {
      $inc: { timesWrong: 1 },
      $push: { confidenceHistory: confidence },
      nextReviewAt,
      srsInterval,
      lastAttemptedAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
