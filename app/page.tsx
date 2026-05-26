import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import AnimatedHero from "@/components/home/AnimatedHero";
import AnimatedFeatures from "@/components/home/AnimatedFeatures";
import AnimatedTable from "@/components/home/AnimatedTable";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const features = [
    { id: "01", code: "INGEST",   title: "UPLOAD ANY PDF",       desc: "Textbooks, notes, research papers — content is extracted, chunked, and indexed for generation." },
    { id: "02", code: "GENERATE", title: "AI QUESTIONS",         desc: "Groq's Llama 3.3 70B produces MCQ, true/false, and fill-in-the-blank questions from your material." },
    { id: "03", code: "REVIEW",   title: "SPACED REPETITION",    desc: "SM-2 scheduling surfaces weak questions at optimal intervals. Nothing falls through." },
    { id: "04", code: "TRACK",    title: "PROGRESS TELEMETRY",   desc: "Streaks, topic weakness maps, score history, and activity heatmaps in a single dashboard." },
  ];

  const rows = [
    ["GENERATE QUIZZES",   "✓",      "✓"],
    ["VIEW RESULTS",       "✓",      "✓"],
    ["PROGRESS DASHBOARD", "—",      "✓"],
    ["SPACED REPETITION",  "—",      "✓"],
    ["QUIZ HISTORY",       "—",      "✓"],
    ["PAUSE AND RESUME",   "—",      "✓"],
    ["EXPORT PROGRESS",    "—",      "✓"],
  ];

  return (
    <div className="min-h-[100dvh] bg-paper text-ink ind-surface">
      <Navbar />

      {/* HERO */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedHero />
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto">
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
          <AnimatedTable rows={rows} />
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-3 border-b border-rule">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              [ SYSTEM CAPABILITIES ]
            </span>
          </div>
          <AnimatedFeatures features={features} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          MADE BY SAMIUL · © 2026 QUIZORA
        </span>
        <div className="flex gap-6">
          <Link href="/terms" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">TERMS</Link>
          <Link href="/privacy" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">PRIVACY</Link>
        </div>
      </footer>
    </div>
  );
}
