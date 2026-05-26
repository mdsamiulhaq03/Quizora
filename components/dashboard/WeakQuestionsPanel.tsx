import Link from "next/link";

interface WeakQ {
  _id: string;
  question: string;
  topic: string;
  timesWrong: number;
  nextReviewAt: Date;
}

interface Props {
  questions: WeakQ[];
}

export default function WeakQuestionsPanel({ questions }: Props) {
  const due = questions.filter((q) => new Date(q.nextReviewAt) <= new Date());

  return (
    <div className="bg-plate border border-rule ind-surface">
      {/* Header */}
      <div className="border-b border-rule px-4 py-2 flex items-center justify-between">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          WEAK QUESTIONS
        </span>
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
          {due.length > 0 ? `▲ ${due.length} DUE` : "● CLEAR"}
        </span>
      </div>

      {due.length > 0 && (
        <div className="border-b border-rule-faint px-4 py-2">
          <Link
            href="/review"
            className="font-terminal text-[0.65rem] uppercase tracking-widest text-hazard hover:underline transition-colors"
          >
            [ REVIEW NOW → ]
          </Link>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted">
            NO WEAK QUESTIONS LOGGED.
          </p>
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-1">
            TAKE QUIZZES TO GENERATE DATA.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-rule-faint max-h-64 overflow-y-auto">
          {questions.slice(0, 8).map((q) => {
            const isDue = new Date(q.nextReviewAt) <= new Date();
            return (
              <div key={q._id} className="px-4 py-3 flex items-start gap-3">
                <div
                  className={`w-1.5 h-1.5 mt-1.5 shrink-0 ${
                    isDue ? "bg-hazard" : "bg-rule-faint"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink line-clamp-2 leading-relaxed">
                    {q.question}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">
                      {q.topic}
                    </span>
                    <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-hazard">
                      ✗ {q.timesWrong}×
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
