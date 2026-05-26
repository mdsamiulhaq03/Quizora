"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/quiz/QuestionCard";
import ProgressBar from "@/components/shared/ProgressBar";
import type { Question } from "@/lib/types";

interface ReviewQuestion extends Question {
  _id: string;
  timesWrong: number;
  srsInterval: number;
}

export default function ReviewPage() {
  const { status } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login?callbackUrl=/review"); return; }
    if (status === "authenticated") {
      fetch("/api/review/questions")
        .then((r) => r.json())
        .then((data) => { setQuestions(data.questions || []); setLoading(false); });
    }
  }, [status, router]);

  const current = questions[index];

  const handleAnswer = (answer: string) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: answer }));
    setSubmitted(true);
  };

  const handleNext = useCallback(async () => {
    if (!current) return;
    const isCorrect = answers[current.id] === current.correctAnswer;
    await fetch("/api/review/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: current._id, isCorrect, confidence: "medium" }),
    });
    setSubmitted(false);
    setDirection(1);
    if (index < questions.length - 1) setIndex((i) => i + 1);
    else setDone(true);
  }, [current, answers, index, questions.length]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-paper text-ink flex items-center justify-center ind-surface">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-rule bg-plate px-8 py-6 w-72"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="w-2 h-2 bg-hazard"
            />
            <p className="font-terminal text-xs uppercase tracking-widest text-hazard">
              LOADING REVIEW QUEUE
            </p>
          </div>
          {[80, 60, 90].map((w, i) => (
            <motion.div
              key={i}
              className="h-1.5 bg-plate-alt mb-2"
              style={{ width: `${w}%` }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[100dvh] bg-paper text-ink flex items-center justify-center p-6 ind-surface">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="border border-rule bg-plate px-8 py-8 text-center max-w-sm"
        >
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-2 h-2 bg-green-500 mx-auto mb-4"
          />
          <p className="font-display uppercase text-ink mb-2" style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
            ALL CAUGHT UP
          </p>
          <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-6">
            NO QUESTIONS DUE FOR REVIEW TODAY. CHECK BACK TOMORROW.
          </p>
          <motion.button
            onClick={() => router.push("/dashboard")}
            whileTap={{ scale: 0.97 }}
            className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-6 py-2.5 hover:border-hazard hover:text-hazard transition-colors"
          >
            [ BACK TO DASHBOARD ]
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-[100dvh] bg-paper text-ink flex items-center justify-center p-6 ind-surface">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="border border-rule bg-plate px-8 py-8 text-center max-w-sm"
        >
          <motion.p
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
            className="font-terminal text-[0.6rem] uppercase tracking-widest text-green-500 mb-3"
          >
            SESSION COMPLETE
          </motion.p>
          <p className="font-display uppercase text-ink mb-2" style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
            REVIEW DONE
          </p>
          <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-6">
            {questions.length} QUESTIONS REVIEWED THIS SESSION.
          </p>
          <motion.button
            onClick={() => router.push("/dashboard")}
            whileTap={{ scale: 0.97 }}
            className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-6 py-2.5 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
          >
            [ BACK TO DASHBOARD ]
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-paper text-ink ind-surface">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="border-b border-rule bg-plate sticky top-0 z-40"
      >
        <div className="max-w-2xl mx-auto px-6 py-2 flex items-center justify-between">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            SPACED REPETITION REVIEW
          </span>
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted tabular-nums">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="inline-block"
              >
                {index + 1}
              </motion.span>
            </AnimatePresence>
            {" / "}{questions.length}
          </span>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-6 flex flex-col gap-4">
        <ProgressBar value={index} max={questions.length} />

        {current && (
          <QuestionCard
            question={current}
            selectedAnswer={answers[current.id] || null}
            submitted={submitted}
            onSelect={handleAnswer}
            questionNumber={index + 1}
            total={questions.length}
            direction={direction}
          />
        )}

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <motion.button
                onClick={handleNext}
                whileTap={{ scale: 0.985, y: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-full font-terminal text-[0.75rem] uppercase tracking-widest bg-hazard text-white py-4 border-2 border-hazard hover:bg-paper hover:text-hazard transition-colors"
              >
                {index < questions.length - 1 ? "[ CONTINUE â†’ ]" : "[ FINISH REVIEW â†’ ]"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

