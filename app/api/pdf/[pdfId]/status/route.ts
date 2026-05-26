export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Quiz from "@/lib/models/Quiz";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pdfId: string }> }
) {
  const { pdfId } = await params;

  await dbConnect();
  const pdf = await PDF.findById(pdfId).select("processingStatus").lean();
  if (!pdf) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let quizId: string | null = null;
  if (pdf.processingStatus === "done") {
    const quiz = await Quiz.findOne({ pdfId }).select("_id").lean();
    quizId = quiz?._id?.toString() || null;
  }

  return NextResponse.json({ status: pdf.processingStatus, quizId });
}
