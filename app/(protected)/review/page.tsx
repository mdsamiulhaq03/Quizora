"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QuestionCard from "@/components/quiz/QuestionCard";
import ConfidencePrompt from "@/components/quiz/ConfidencePrompt";
import ProgressBar from "@/components/shared/ProgressBar";
import type { Question, Confidence } from "@/lib/types";

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
  const [awaitingConfidence, setAwaitingConfidence] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

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

  const handleConfidence = useCallback(
    async (confidence: Confidence) => {
      if (!current) return;
      const isCorrect = answers[current.id] === current.correctAnswer;
      await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: current._id, isCorrect, confidence }),
      });
      setSubmitted(false);
      setAwaitingConfidence(false);
      if (index < questions.length - 1) setIndex((i) => i + 1);
      else setDone(true);
    },
    [current, answers, index, questions.length]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center ind-surface">
        <div className="border border-rule bg-plate px-8 py-6 text-center">
          <p className="font-terminal text-xs uppercase tracking-widest text-hazard animate-pulse">
            ● LOADING REVIEW QUEUE...
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-6 ind-surface">
        <div className="border border-rule bg-plate px-8 py-8 text-center max-w-sm">
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard mb-3">
            ● QUEUE CLEAR
          </p>
          <p className="font-display uppercase text-ink mb-2" style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
            ALL CAUGHT UP
          </p>
          <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted">
            NO QUESTIONS DUE FOR REVIEW TODAY. CHECK BACK TOMORROW.
          </p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-6 ind-surface">
        <div className="border border-rule bg-plate px-8 py-8 text-center max-w-sm">
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-green-500 mb-3">
            ✓ SESSION COMPLETE
          </p>
          <p className="font-display uppercase text-ink mb-2" style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
            REVIEW DONE
          </p>
          <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-5">
            {questions.length} QUESTIONS REVIEWED THIS SESSION.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-6 py-2.5 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
          >
            [ BACK TO DASHBOARD ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      {/* Top bar */}
      <div className="border-b border-rule bg-plate sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-2 flex items-center justify-between">
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            SPACED REPETITION REVIEW
          </span>
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted tabular-nums">
            {index + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        <ProgressBar value={index} max={questions.length} className="mb-5" />

        {current && (
          <QuestionCard
            question={current}
            selectedAnswer={answers[current.id] || null}
            submitted={submitted}
            onSelect={handleAnswer}
            questionNumber={index + 1}
            total={questions.length}
          />
        )}

        {submitted && !awaitingConfidence && (
          <button
            onClick={() => setAwaitingConfidence(true)}
            className="w-full mt-3 font-terminal text-[0.75rem] uppercase tracking-widest bg-hazard text-white py-4 border-2 border-hazard hover:bg-paper hover:text-hazard transition-colors"
          >
            [ CONTINUE → ]
          </button>
        )}

        {awaitingConfidence && (
          <div className="mt-3">
            <ConfidencePrompt onSelect={handleConfidence} />
          </div>
        )}
      </div>
    </div>
  );
}
