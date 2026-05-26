import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const features = [
    {
      id: "01",
      code: "INGEST",
      title: "UPLOAD ANY PDF",
      desc: "Textbooks, notes, research papers — content is extracted, chunked, and indexed for generation.",
    },
    {
      id: "02",
      code: "GENERATE",
      title: "AI QUESTIONS",
      desc: "Groq's Llama 3.3 70B produces MCQ, true/false, and fill-in-the-blank questions from your material.",
    },
    {
      id: "03",
      code: "REVIEW",
      title: "SPACED REPETITION",
      desc: "SM-2 scheduling surfaces weak questions at optimal intervals. Nothing falls through.",
    },
    {
      id: "04",
      code: "TRACK",
      title: "PROGRESS TELEMETRY",
      desc: "Streaks, topic weakness maps, score history, and activity heatmaps in a single dashboard.",
    },
  ];

  const rows = [
    ["PDF UPLOADS",         "1 EVER",   "3 / DAY"],
    ["GENERATE QUIZZES",    "✓",        "✓"],
    ["VIEW RESULTS",        "✓",        "✓"],
    ["PROGRESS DASHBOARD",  "—",        "✓"],
    ["SPACED REPETITION",   "—",        "✓"],
    ["QUIZ HISTORY",        "—",        "✓"],
    ["PAUSE AND RESUME",    "—",        "✓"],
    ["EXPORT PROGRESS",     "—",        "✓"],
  ];

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-6">


          <div className="py-16 lg:py-24">
            {/* Macro heading */}
            <h1
              className="font-display uppercase leading-none tracking-tight text-ink mb-0"
              style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)", letterSpacing: "-0.03em" }}
            >
              TURN ANY PDF
            </h1>
            <h1
              className="font-display uppercase leading-none tracking-tight text-hazard hazard-glow mb-6"
              style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)", letterSpacing: "-0.03em" }}
            >
              INTO QUIZZES.
            </h1>

            {/* Accent rule */}
            <div className="ind-rule-accent mb-8 max-w-2xl" />

            <p className="font-terminal text-sm text-ink-muted max-w-xl mb-10 leading-relaxed tracking-wide uppercase">
              Upload a document. Get AI-generated questions in seconds.
              Track performance with spaced repetition and actually
              remember what you study.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-0 flex-wrap">
              <Link
                href="/upload"
                className="font-terminal text-sm uppercase tracking-widest bg-hazard text-white px-8 py-4 border-2 border-hazard hover:bg-paper hover:text-hazard font-bold transition-colors"
              >
                [ TRY FREE — NO SIGN UP ]
              </Link>
              <Link
                href="/login"
                className="font-terminal text-sm uppercase tracking-widest bg-paper text-ink px-8 py-4 border-2 border-rule hover:border-hazard hover:text-hazard transition-colors"
              >
                [ SIGN IN ]
              </Link>
            </div>

            <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-4">
              NO CREDIT CARD REQUIRED · FREE FOREVER FOR BASIC USE
            </p>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="grid grid-cols-3 border-b border-rule">
            <div className="px-6 py-3 border-r border-rule">
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">FEATURE</span>
            </div>
            <div className="px-6 py-3 text-center border-r border-rule">
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">GUEST</span>
            </div>
            <div className="px-6 py-3 text-center bg-plate">
              <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">SIGNED IN</span>
            </div>
          </div>

          {rows.map(([feat, guest, auth], i) => (
            <div
              key={feat}
              className={`grid grid-cols-3 border-b border-rule-faint ${
                i === rows.length - 1 ? "" : ""
              }`}
            >
              <div className="px-6 py-3 border-r border-rule-faint">
                <span className="font-terminal text-xs uppercase tracking-wide text-ink">{feat}</span>
              </div>
              <div className="px-6 py-3 text-center border-r border-rule-faint">
                <span className="font-terminal text-xs text-ink-muted">{guest}</span>
              </div>
              <div className="px-6 py-3 text-center bg-plate">
                <span className={`font-terminal text-xs font-bold ${auth === "—" ? "text-ink-muted" : "text-hazard"}`}>
                  {auth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────── */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <div className="px-6 py-3 border-b border-rule">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              [ SYSTEM CAPABILITIES ]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.id}
                className={`p-6 bg-plate ind-surface border-r border-rule-faint ${
                  i === features.length - 1 ? "border-r-0" : ""
                }`}
              >
                <div className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-4">
                  {f.id} / {f.code}
                </div>
                <div className="ind-rule-accent mb-4" />
                <h3
                  className="font-display uppercase text-ink leading-tight mb-3"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", letterSpacing: "-0.02em" }}
                >
                  {f.title}
                </h3>
                <p className="font-terminal text-xs text-ink-muted leading-relaxed tracking-wide uppercase">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-t border-rule-faint">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          MADE BY SAMIUL · © 2026 QUIZORA
        </span>
        <div className="flex gap-6">
          <Link href="/terms" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">
            TERMS
          </Link>
          <Link href="/privacy" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">
            PRIVACY
          </Link>
        </div>
      </footer>
    </div>
  );
}
