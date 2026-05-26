export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Attempt from "@/lib/models/Attempt";
import WeakQuestion from "@/lib/models/WeakQuestion";
import PDF from "@/lib/models/PDF";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const [attempts, weakQuestions, pdfs] = await Promise.all([
    Attempt.find({ userId: session.user.id, completedAt: { $exists: true } })
      .populate("quizId", "title difficulty")
      .sort({ completedAt: -1 })
      .lean(),
    WeakQuestion.find({ userId: session.user.id })
      .select("question topic correctAnswer timesWrong srsInterval nextReviewAt")
      .lean(),
    PDF.find({ userId: session.user.id })
      .select("filename wordCount wasTruncated processingStatus uploadedAt")
      .lean(),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: {
      email: session.user.email,
      name: session.user.name,
    },
    summary: {
      totalAttempts: attempts.length,
      totalWeakQuestions: weakQuestions.length,
      totalPdfs: pdfs.length,
    },
    attempts: attempts.map((a) => ({
      date: a.completedAt,
      quiz: (a.quizId as { title?: string } | null)?.title ?? "Unknown",
      difficulty: (a.quizId as { difficulty?: string } | null)?.difficulty ?? "—",
      score: a.score,
      total: a.total,
      pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    })),
    weakQuestions: weakQuestions.map((w) => ({
      question: w.question,
      topic: w.topic,
      correctAnswer: w.correctAnswer,
      timesWrong: w.timesWrong,
      nextReviewAt: w.nextReviewAt,
      srsInterval: w.srsInterval,
    })),
    uploadedPdfs: pdfs.map((p) => ({
      filename: p.filename,
      wordCount: p.wordCount,
      wasTruncated: p.wasTruncated,
      status: p.processingStatus,
      uploadedAt: p.uploadedAt,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="quizora-export-${Date.now()}.json"`,
    },
  });
}
