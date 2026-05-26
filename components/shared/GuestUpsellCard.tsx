import Link from "next/link";

interface Props {
  wrongCount: number;
}

const features = [
  "3 UPLOADS PER DAY",
  "PROGRESS DASHBOARD",
  "SPACED REPETITION",
  "QUIZ HISTORY",
  "EXPORT REPORTS",
  "PAUSE AND RESUME",
];

export default function GuestUpsellCard({ wrongCount }: Props) {
  return (
    <div className="border border-hazard bg-plate ind-surface">
      {/* Header */}
      <div className="border-b border-hazard px-5 py-2 bg-hazard flex items-center justify-between">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-white">
          UPGRADE / REGISTER FREE
        </span>
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-white/70">
          SYS/UPSELL
        </span>
      </div>

      <div className="px-5 py-5">
        <h3
          className="font-display uppercase text-ink leading-none mb-1"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", letterSpacing: "-0.02em" }}
        >
          {wrongCount > 0
            ? `${wrongCount} WRONG. DON'T LET THEM SLIP.`
            : "GREAT SCORE. KEEP THE MOMENTUM."}
        </h3>
        <p className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink-muted mb-5 leading-relaxed">
          SIGN UP TO TRACK WEAK QUESTIONS, SCHEDULE SPACED REPETITION,
          MONITOR PROGRESS OVER TIME.
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <span className="text-hazard font-terminal text-xs">✓</span>
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">{f}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Link
            href="/register"
            className="flex-1 font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white py-3 text-center border border-hazard hover:bg-paper hover:text-hazard transition-colors"
          >
            [ REGISTER FREE ]
          </Link>
          <Link
            href="/login"
            className="flex-1 font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink py-3 text-center hover:border-hazard hover:text-hazard transition-colors"
          >
            [ SIGN IN ]
          </Link>
        </div>
      </div>
    </div>
  );
}
