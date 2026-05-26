"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import QuestionCard from "@/components/quiz/QuestionCard";
import ConfidencePrompt from "@/components/quiz/ConfidencePrompt";
import TimerBar from "@/components/quiz/TimerBar";
import FlagButton from "@/components/quiz/FlagButton";
import ProgressBar from "@/components/shared/ProgressBar";
import { submitAttempt } from "@/app/actions/submitAttempt";
import { pauseQuiz } from "@/app/actions/pauseQuiz";
import type { Question, AnswerRecord, Confidence } from "@/lib/types";

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  difficulty: string;
}

type Phase = "answering" | "confidence" | "finished";

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState<Phase>("answering");
  const [confidences, setConfidences] = useState<Record<string, Confidence>>({});
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showTimer, setShowTimer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/quiz/${quizId}`)
      .then((r) => r.json())
      .then((data) => {
        setQuiz(data);
        setLoading(false);
      });
  }, [quizId]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  const currentQuestion = quiz?.questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    setSubmitted(true);
  };

  const handleConfidence = (confidence: Confidence) => {
    if (!currentQuestion) return;
    const elapsed = Math.round((Date.now() - questionStartTime) / 1000);
    setTimings((prev) => ({ ...prev, [currentQuestion.id]: elapsed }));
    setConfidences((prev) => ({ ...prev, [currentQuestion.id]: confidence }));
    setPhase("answering");
    setSubmitted(false);
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase("finished");
    }
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    setPhase("confidence");
  };

  const handlePause = async () => {
    if (!session?.user || !quiz) return;
    await pauseQuiz(quizId, currentIndex, answers);
    router.push("/dashboard");
  };

  const handleFinish = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    const answerRecords: AnswerRecord[] = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] || "",
      isCorrect: answers[q.id] === q.correctAnswer,
      confidence: confidences[q.id] || "medium",
      timeSpentSeconds: timings[q.id] || 0,
      flagged: flags[q.id] || false,
    }));
    const result = await submitAttempt(quizId, answerRecords);
    if (result.success && result.attemptId) {
      router.push(`/results/${result.attemptId}`);
    }
  }, [quiz, submitting, answers, confidences, timings, flags, quizId, router]);

  useEffect(() => {
    if (phase === "finished") handleFinish();
  }, [phase, handleFinish]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center ind-surface">
        <div className="border border-rule bg-plate px-8 py-6">
          <p className="font-terminal text-xs uppercase tracking-widest text-hazard animate-pulse mb-2">
            ● LOADING QUIZ...
          </p>
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            FETCHING QUESTIONS FROM DATABASE
          </p>
        </div>
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center ind-surface">
        <div className="border border-rule bg-plate px-8 py-6 text-center">
          <p className="font-terminal text-xs uppercase tracking-widest text-hazard mb-2">
            ✗ QUIZ NOT FOUND
          </p>
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            INVALID QUIZ ID OR RECORD DELETED
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      {/* Top bar */}
      <div className="border-b border-rule bg-plate sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="min-w-0">
            <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              QUIZ IN PROGRESS
            </p>
            <p className="font-terminal text-xs uppercase tracking-wide text-ink truncate">
              {quiz.title}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {session?.user && (
              <button
                onClick={() => setShowTimer(!showTimer)}
                className="font-terminal text-[0.6rem] uppercase tracking-widest border border-rule text-ink-muted px-3 py-1.5 hover:border-hazard hover:text-hazard transition-colors"
              >
                {showTimer ? "HIDE TIMER" : "TIMER"}
              </button>
            )}
            {session?.user && (
              <button
                onClick={handlePause}
                className="font-terminal text-[0.6rem] uppercase tracking-widest border border-rule text-ink-muted px-3 py-1.5 hover:border-hazard hover:text-hazard transition-colors"
              >
                PAUSE
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        <ProgressBar value={currentIndex} max={quiz.questions.length} className="mb-5" />

        {showTimer && session?.user && (
          <div className="mb-4">
            <TimerBar durationSeconds={60} paused={phase === "confidence"} />
          </div>
        )}

        <div className="flex justify-end mb-3">
          {session?.user && (
            <FlagButton
              flagged={flags[currentQuestion.id] || false}
              onToggle={() =>
                setFlags((prev) => ({
                  ...prev,
                  [currentQuestion.id]: !prev[currentQuestion.id],
                }))
              }
            />
          )}
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id] || null}
          submitted={submitted}
          onSelect={handleAnswer}
          questionNumber={currentIndex + 1}
          total={quiz.questions.length}
        />

        {submitted && phase === "answering" && (
          <div className="mt-3">
            <button
              onClick={handleNext}
              className="w-full font-terminal text-[0.75rem] uppercase tracking-widest bg-hazard text-white py-4 border-2 border-hazard hover:bg-paper hover:text-hazard transition-colors"
            >
              {currentIndex < quiz.questions.length - 1
                ? "[ NEXT QUESTION → ]"
                : "[ FINISH QUIZ → ]"}
            </button>
          </div>
        )}

        {phase === "confidence" && (
          <div className="mt-3">
            <ConfidencePrompt onSelect={handleConfidence} />
          </div>
        )}

        {phase === "finished" && (
          <div className="mt-3 border border-rule bg-plate px-5 py-4 text-center">
            <p className="font-terminal text-xs uppercase tracking-widest text-hazard animate-pulse">
              [ SUBMITTING RESULTS... ]
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
