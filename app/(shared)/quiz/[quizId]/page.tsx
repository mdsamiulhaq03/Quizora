"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/quiz/QuestionCard";
import TimerBar from "@/components/quiz/TimerBar";
import FlagButton from "@/components/quiz/FlagButton";
import ProgressBar from "@/components/shared/ProgressBar";
import { submitAttempt } from "@/app/actions/submitAttempt";
import { pauseQuiz } from "@/app/actions/pauseQuiz";
import type { Question, AnswerRecord } from "@/lib/types";

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  difficulty: string;
}

type Phase = "answering" | "finished";

const pageVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

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
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showTimer, setShowTimer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const submittingRef = useRef(false);

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

  const handleNext = () => {
    if (!currentQuestion) return;
    const elapsed = Math.round((Date.now() - questionStartTime) / 1000);
    setTimings((prev) => ({ ...prev, [currentQuestion.id]: elapsed }));
    setDirection(1);
    setSubmitted(false);
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase("finished");
    }
  };

  const handlePause = async () => {
    if (!session?.user || !quiz) return;
    await pauseQuiz(quizId, currentIndex, answers);
    router.push("/dashboard");
  };

  const handleFinish = useCallback(async () => {
    if (!quiz || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    const answerRecords: AnswerRecord[] = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] || "",
      isCorrect: answers[q.id] === q.correctAnswer,
      confidence: "medium" as const,
      timeSpentSeconds: timings[q.id] || 0,
      flagged: flags[q.id] || false,
    }));
    const result = await submitAttempt(quizId, answerRecords);
    if (result.success && result.attemptId) {
      router.push(`/results/${result.attemptId}`);
    }
  }, [quiz, answers, timings, flags, quizId, router]);

  useEffect(() => {
    if (phase === "finished") handleFinish();
  }, [phase, handleFinish]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-paper text-ink flex items-center justify-center ind-surface">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border border-rule bg-plate px-8 py-6 w-80"
        >
          {/* Skeleton title bar */}
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="w-2 h-2 bg-hazard"
            />
            <p className="font-terminal text-xs uppercase tracking-widest text-hazard">
              LOADING QUIZ
            </p>
          </div>
          {/* Skeleton bars */}
          {[100, 75, 88].map((w, i) => (
            <motion.div
              key={i}
              className="h-1.5 bg-plate-alt mb-2 last:mb-0"
              style={{ width: `${w}%` }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="min-h-[100dvh] bg-paper text-ink flex items-center justify-center ind-surface">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-rule bg-plate px-8 py-6 text-center"
        >
          <p className="font-terminal text-xs uppercase tracking-widest text-hazard mb-2">
            QUIZ NOT FOUND
          </p>
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
            INVALID QUIZ ID OR RECORD DELETED
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-paper text-ink ind-surface">
      {/* Sticky top bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="border-b border-rule bg-plate sticky top-0 z-40"
      >
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
              <motion.button
                onClick={() => setShowTimer(!showTimer)}
                whileTap={{ scale: 0.96 }}
                className="font-terminal text-[0.6rem] uppercase tracking-widest border border-rule text-ink-muted px-3 py-1.5 hover:border-hazard hover:text-hazard transition-colors"
              >
                {showTimer ? "HIDE TIMER" : "TIMER"}
              </motion.button>
            )}
            {session?.user && (
              <motion.button
                onClick={handlePause}
                whileTap={{ scale: 0.96 }}
                className="font-terminal text-[0.6rem] uppercase tracking-widest border border-rule text-ink-muted px-3 py-1.5 hover:border-hazard hover:text-hazard transition-colors"
              >
                PAUSE
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          {/* Progress */}
          <motion.div variants={rowVariants}>
            <ProgressBar value={currentIndex} max={quiz.questions.length} />
          </motion.div>

          {/* Timer */}
          <AnimatePresence>
            {showTimer && session?.user && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <TimerBar durationSeconds={60} paused={false} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flag button row */}
          <motion.div variants={rowVariants} className="flex justify-end">
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
          </motion.div>

          {/* Question card */}
          <motion.div variants={rowVariants}>
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] || null}
              submitted={submitted}
              onSelect={handleAnswer}
              questionNumber={currentIndex + 1}
              total={quiz.questions.length}
              direction={direction}
            />
          </motion.div>

          {/* Next / Finish button */}
          <AnimatePresence>
            {submitted && phase === "answering" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.button
                  onClick={handleNext}
                  whileTap={{ scale: 0.985, y: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-full font-terminal text-[0.75rem] uppercase tracking-widest bg-hazard text-white py-4 border-2 border-hazard hover:bg-paper hover:text-hazard transition-colors"
                >
                  {currentIndex < quiz.questions.length - 1
                    ? "[ NEXT QUESTION → ]"
                    : "[ FINISH QUIZ → ]"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submitting state */}
          <AnimatePresence>
            {(phase === "finished" || submitting) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-rule bg-plate px-5 py-4 text-center"
              >
                <motion.p
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="font-terminal text-xs uppercase tracking-widest text-hazard"
                >
                  [ SUBMITTING RESULTS... ]
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
