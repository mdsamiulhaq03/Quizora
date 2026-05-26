import Link from "next/link";

interface Quiz {
  id: string;
  title: string;
  score: number;
  total: number;
  completedAt: Date;
}

interface Props {
  quizzes: Quiz[];
}

export default function RecentQuizzes({ quizzes }: Props) {
  return (
    <div className="bg-plate border border-rule ind-surface">
      {/* Header */}
      <div className="border-b border-rule px-4 py-2">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          RECENT ATTEMPTS
        </span>
      </div>

      {quizzes.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted">
            NO ATTEMPTS RECORDED.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] border-b border-rule-faint px-4 py-1.5">
            {["QUIZ", "SCORE", "DATE", ""].map((col) => (
              <div key={col} className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted pr-4">
                {col}
              </div>
            ))}
          </div>

          {quizzes.map((q, i) => {
            const pct = Math.round((q.score / q.total) * 100);
            const scoreClass =
              pct >= 80 ? "text-green-500" : pct >= 60 ? "text-yellow-500" : "text-hazard";
            return (
              <div
                key={q.id}
                className={`grid grid-cols-[1fr_auto_auto_auto] px-4 py-3 items-center ${
                  i < quizzes.length - 1 ? "border-b border-rule-faint" : ""
                }`}
              >
                <span className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink truncate pr-4">
                  {q.title}
                </span>
                <span className={`font-terminal text-[0.65rem] uppercase tracking-wide font-bold tabular-nums pr-6 ${scoreClass}`}>
                  {q.score}/{q.total} ({pct}%)
                </span>
                <span className="font-terminal text-[0.6rem] uppercase tracking-wide text-ink-muted pr-6 whitespace-nowrap">
                  {new Date(q.completedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }).toUpperCase()}
                </span>
                <Link
                  href={`/results/${q.id}`}
                  className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard hover:underline whitespace-nowrap"
                >
                  VIEW →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
