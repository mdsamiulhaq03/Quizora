import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Attempt from "@/lib/models/Attempt";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

export default async function QuizHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await dbConnect();
  const attempts = await Attempt.find({ userId: session.user.id, completedAt: { $exists: true } })
    .populate("quizId", "title difficulty")
    .sort({ completedAt: -1 })
    .limit(50)
    .lean();

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="border-b border-rule pb-4 mb-6">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted block mb-1">
            RECORDS
          </span>
          <h1
            className="font-display uppercase text-ink leading-none"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", letterSpacing: "-0.03em" }}
          >
            QUIZ HISTORY
          </h1>
        </div>

        {attempts.length === 0 ? (
          <div className="border border-rule bg-plate px-6 py-12 text-center">
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-2">
              NO ATTEMPTS RECORDED.
            </p>
            <Link
              href="/upload"
              className="font-terminal text-[0.65rem] uppercase tracking-widest text-hazard hover:underline"
            >
              [ UPLOAD A PDF TO GET STARTED ]
            </Link>
          </div>
        ) : (
          <div className="border border-rule">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] border-b border-rule bg-plate px-4 py-2">
              {["QUIZ", "DIFFICULTY", "SCORE", "DATE", ""].map((col) => (
                <div key={col} className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted pr-4">
                  {col}
                </div>
              ))}
            </div>

            <div className="divide-y divide-rule-faint">
              {attempts.map((a) => {
                const pct = Math.round((a.score / a.total) * 100);
                const quiz = a.quizId as unknown as { title: string; difficulty: string } | null;
                const scoreColor =
                  pct >= 80 ? "text-green-500" : pct >= 60 ? "text-yellow-500" : "text-hazard";

                return (
                  <div
                    key={a._id.toString()}
                    className="grid grid-cols-[1fr_auto_auto_auto_auto] px-4 py-3 items-center hover:bg-plate transition-colors"
                  >
                    <span className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink truncate pr-4">
                      {quiz?.title || "QUIZ"}
                    </span>
                    <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted pr-6">
                      {quiz?.difficulty?.toUpperCase() || "—"}
                    </span>
                    <span className={`font-terminal text-[0.65rem] uppercase tracking-wide font-bold tabular-nums pr-6 ${scoreColor}`}>
                      {a.score}/{a.total} ({pct}%)
                    </span>
                    <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted pr-6 whitespace-nowrap">
                      {a.completedAt
                        ? new Date(a.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()
                        : "—"}
                    </span>
                    <Link
                      href={`/results/${a._id}`}
                      className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard hover:underline whitespace-nowrap"
                    >
                      VIEW →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
