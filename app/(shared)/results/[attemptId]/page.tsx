import { notFound } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Attempt from "@/lib/models/Attempt";
import Quiz from "@/lib/models/Quiz";
import { auth } from "@/lib/auth";
import GuestUpsellCard from "@/components/shared/GuestUpsellCard";
import Navbar from "@/components/shared/Navbar";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const session = await auth();

  await dbConnect();
  const attempt = await Attempt.findById(attemptId).lean();
  if (!attempt) notFound();

  const quiz = await Quiz.findById(attempt.quizId).lean();
  if (!quiz) notFound();

  const isGuest = !session?.user;
  const score = attempt.score;
  const total = attempt.total;
  const pct = Math.round((score / total) * 100);

  const grade =
    pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";

  const gradeColor =
    pct >= 80 ? "text-green-500" : pct >= 60 ? "text-yellow-500" : "text-hazard";

  const wrongAnswers = attempt.answers
    .filter((a) => !a.isCorrect)
    .map((a) => {
      const q = quiz.questions.find((q) => q.id === a.questionId);
      return { answer: a, question: q };
    })
    .filter((x) => x.question);

  const topicMap: Record<string, { correct: number; total: number }> = {};
  for (const ans of attempt.answers) {
    const q = quiz.questions.find((q) => q.id === ans.questionId);
    const topic = q?.topic || "GENERAL";
    if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
    topicMap[topic].total++;
    if (ans.isCorrect) topicMap[topic].correct++;
  }

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-0">

        {/* ── SCORE PANEL ──────────────────────────────── */}
        <div className="border border-rule">
          {/* Title bar */}
          <div className="border-b border-rule px-5 py-2 flex items-center justify-between bg-plate">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              ATTEMPT REPORT / {attemptId.slice(-6).toUpperCase()}
            </span>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-[auto_1fr] divide-x divide-rule">
            {/* Score block */}
            <div className="p-8 flex flex-col items-center justify-center min-w-[140px]">
              <p
                className={`font-display leading-none ${gradeColor}`}
                style={{ fontSize: "clamp(4rem, 10vw, 6rem)", letterSpacing: "-0.04em" }}
              >
                {grade}
              </p>
              <p className={`font-display leading-none ${gradeColor}`} style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
                {pct}%
              </p>
            </div>

            {/* Quiz info */}
            <div className="p-5">
              <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-2">
                QUIZ TITLE
              </p>
              <p className="font-display uppercase text-ink mb-4" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", letterSpacing: "-0.01em" }}>
                {quiz.title}
              </p>
              <div className="ind-rule mb-4" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                <div>
                  <p className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">CORRECT</p>
                  <p className="font-terminal text-sm text-green-500 font-bold tabular-nums">{score}</p>
                </div>
                <div>
                  <p className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">TOTAL</p>
                  <p className="font-terminal text-sm text-ink font-bold tabular-nums">{total}</p>
                </div>
                <div>
                  <p className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">WRONG</p>
                  <p className="font-terminal text-sm text-hazard font-bold tabular-nums">{wrongAnswers.length}</p>
                </div>
                <div>
                  <p className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">ACCURACY</p>
                  <p className={`font-terminal text-sm font-bold tabular-nums ${gradeColor}`}>{pct}%</p>
                </div>
              </div>
            </div>
          </div>

          {!isGuest && (
            <div className="border-t border-rule px-5 py-3 flex gap-2 bg-plate">
              <Link
                href={`/quiz/${quiz._id}`}
                className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-4 py-2 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
              >
                [ RETAKE ]
              </Link>
              <Link
                href="/review"
                className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-4 py-2 hover:border-hazard hover:text-hazard transition-colors"
              >
                [ REVIEW WEAK QUESTIONS ]
              </Link>
              <Link
                href="/dashboard"
                className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-4 py-2 hover:border-hazard hover:text-hazard transition-colors"
              >
                [ DASHBOARD ]
              </Link>
            </div>
          )}
        </div>

        {/* ── TOPIC BREAKDOWN ──────────────────────────── */}
        {Object.keys(topicMap).length > 0 && (
          <div className="border-x border-b border-rule">
            <div className="border-b border-rule px-5 py-2 bg-plate">
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
                TOPIC BREAKDOWN
              </span>
            </div>
            <div className="divide-y divide-rule-faint">
              {Object.entries(topicMap).map(([topic, { correct, total: t }]) => {
                const p = Math.round((correct / t) * 100);
                const barColor =
                  p >= 80 ? "bg-green-500" : p >= 60 ? "bg-yellow-500" : "bg-hazard";
                return (
                  <div key={topic} className="px-5 py-3">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink">
                        {topic}
                      </span>
                      <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted tabular-nums">
                        {correct}/{t} · {p}%
                      </span>
                    </div>
                    <div className="w-full bg-plate-alt h-1">
                      <div className={`h-1 ${barColor}`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WRONG ANSWERS ─────────────────────────────── */}
        {wrongAnswers.length > 0 && (
          <div className="border-x border-b border-rule">
            <div className="border-b border-rule px-5 py-2 bg-plate flex items-center justify-between">
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
                QUESTIONS TO REVIEW
              </span>
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
                {wrongAnswers.length} FLAGGED
              </span>
            </div>
            <div className="divide-y divide-rule-faint">
              {wrongAnswers.map(({ answer, question }) => (
                <div key={answer.questionId} className="px-5 py-4">
                  <p className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink mb-3 leading-relaxed">
                    {question!.question}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                    <div>
                      <span className="mono-label">YOUR ANSWER: </span>
                      <span className="font-terminal text-[0.65rem] text-hazard uppercase tracking-wide">
                        {answer.selectedAnswer || "(NONE)"}
                      </span>
                    </div>
                    <div>
                      <span className="mono-label">CORRECT: </span>
                      <span className="font-terminal text-[0.65rem] text-green-500 uppercase tracking-wide">
                        {question!.correctAnswer}
                      </span>
                    </div>
                  </div>
                  {question!.explanation && (
                    <p className="font-terminal text-[0.6rem] uppercase tracking-wide text-ink-muted leading-relaxed">
                      {question!.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isGuest && (
          <div className="border-x border-b border-rule">
            <GuestUpsellCard wrongCount={wrongAnswers.length} />
          </div>
        )}
      </div>
    </div>
  );
}
