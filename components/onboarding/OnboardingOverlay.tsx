"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const steps = [
  {
    id: "01",
    code: "INGEST",
    title: "UPLOAD A PDF",
    description:
      "Upload any PDF — textbook, lecture notes, research paper. Content is extracted and indexed automatically.",
    action: "GO TO UPLOAD",
    href: "/upload",
  },
  {
    id: "02",
    code: "GENERATE",
    title: "GENERATE YOUR QUIZ",
    description:
      "Select difficulty, question count, and types. Groq AI creates targeted MCQ, true/false, and fill-in-the-blank questions.",
    action: null,
    href: null,
  },
  {
    id: "03",
    code: "EXECUTE",
    title: "TAKE THE QUIZ",
    description:
      "Answer questions with a timer, flag tricky ones, and rate your confidence after each answer.",
    action: null,
    href: null,
  },
  {
    id: "04",
    code: "TRACK",
    title: "TRACK AND IMPROVE",
    description:
      "Your dashboard shows streaks, weak topics, and schedules spaced repetition reviews to maximize retention.",
    action: "VIEW DASHBOARD",
    href: "/dashboard",
  },
];

interface Props {
  onComplete: () => void;
}

export default function OnboardingOverlay({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  const handleAction = () => {
    if (current.href) {
      onComplete();
      router.push(current.href);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/80 flex items-center justify-center z-50 p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18 }}
          className="bg-paper border border-rule w-full max-w-md ind-surface"
        >
          {/* Header */}
          <div className="border-b border-rule px-5 py-2 flex items-center justify-between bg-plate">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              ONBOARDING / STEP {current.id} OF {steps.length}
            </span>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
              {current.code}
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-0.5 transition-colors ${
                  i <= step ? "bg-hazard" : "bg-rule-faint"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="px-5 py-6">
            <h2
              className="font-display uppercase text-ink leading-none mb-3"
              style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}
            >
              {current.title}
            </h2>
            <p className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink-muted leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-rule px-5 py-3 flex gap-2">
            <button
              onClick={onComplete}
              className="font-terminal text-[0.6rem] uppercase tracking-widest border border-rule text-ink-muted px-4 py-2 hover:border-hazard hover:text-hazard transition-colors"
            >
              SKIP
            </button>
            <div className="flex-1" />
            {current.action && (
              <button
                onClick={handleAction}
                className="font-terminal text-[0.6rem] uppercase tracking-widest border border-hazard text-hazard px-4 py-2 hover:bg-hazard hover:text-white transition-colors"
              >
                {current.action}
              </button>
            )}
            <button
              onClick={handleNext}
              className="font-terminal text-[0.6rem] uppercase tracking-widest bg-hazard text-white px-4 py-2 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
            >
              {step === steps.length - 1 ? "[ START ]" : "NEXT →"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
