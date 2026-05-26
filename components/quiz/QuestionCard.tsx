"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  selectedAnswer: string | null;
  submitted: boolean;
  onSelect: (answer: string) => void;
  questionNumber: number;
  total: number;
  direction?: number;
}

const optionLabels = ["A", "B", "C", "D"];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};

const optionVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function QuestionCard({
  question,
  selectedAnswer,
  submitted,
  onSelect,
  questionNumber,
  total,
  direction = 1,
}: Props) {
  const isCorrect = submitted && selectedAnswer === question.correctAnswer;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        initial={{ opacity: 0, x: direction * 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -24 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="bg-plate border border-rule ind-surface overflow-hidden"
      >
        {/* Header bar */}
        <div className="border-b border-rule px-5 py-2 flex items-center justify-between bg-plate">
          <motion.span
            key={question.topic}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard"
          >
            [ {question.topic} ]
          </motion.span>
          <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted tabular-nums">
            <AnimatePresence mode="wait">
              <motion.span
                key={questionNumber}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="inline-block"
              >
                {String(questionNumber).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            {" / "}{String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Question text */}
        <motion.div
          className="px-5 py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06, duration: 0.22 }}
        >
          <p className="font-terminal text-base text-ink leading-relaxed tracking-wide uppercase">
            {question.question}
          </p>
        </motion.div>

        <div className="ind-rule" />

        {/* Options â€” MCQ */}
        {question.type === "mcq" && question.options && (
          <motion.div
            className="divide-y divide-rule-faint"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {optionLabels.map((label) => {
              const text = question.options![label as keyof typeof question.options];
              if (!text) return null;
              const isSelected = selectedAnswer === label;
              const showCorrect = submitted && label === question.correctAnswer;
              const showWrong = submitted && isSelected && label !== question.correctAnswer;

              return (
                <motion.button
                  key={label}
                  variants={optionVariants}
                  onClick={() => !submitted && onSelect(label)}
                  disabled={submitted}
                  whileTap={!submitted ? { scale: 0.985, x: 2 } : {}}
                  whileHover={!submitted ? { x: 4 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`w-full text-left px-5 py-3.5 font-terminal text-sm uppercase tracking-wide transition-colors ${
                    showCorrect
                      ? "bg-green-950 text-green-400 border-l-2 border-green-500"
                      : showWrong
                      ? "bg-red-950 text-hazard border-l-2 border-hazard"
                      : isSelected
                      ? "bg-hazard/10 text-hazard border-l-2 border-hazard"
                      : submitted
                      ? "bg-plate text-ink-muted cursor-default"
                      : "bg-plate text-ink hover:bg-plate-alt cursor-pointer"
                  }`}
                >
                  <span className="font-display mr-3 text-[0.7rem]">{label}.</span>
                  {text}
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Options â€” True/False */}
        {question.type === "truefalse" && (
          <motion.div
            className="grid grid-cols-2 divide-x divide-rule-faint"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {["True", "False"].map((opt) => {
              const isSelected = selectedAnswer === opt;
              const showCorrect = submitted && opt === question.correctAnswer;
              const showWrong = submitted && isSelected && opt !== question.correctAnswer;
              return (
                <motion.button
                  key={opt}
                  variants={optionVariants}
                  onClick={() => !submitted && onSelect(opt)}
                  disabled={submitted}
                  whileTap={!submitted ? { scale: 0.97 } : {}}
                  className={`py-4 font-terminal text-sm uppercase tracking-widest transition-colors ${
                    showCorrect
                      ? "bg-green-950 text-green-400"
                      : showWrong
                      ? "bg-red-950 text-hazard"
                      : isSelected
                      ? "bg-hazard/10 text-hazard"
                      : submitted
                      ? "bg-plate text-ink-muted cursor-default"
                      : "bg-plate text-ink hover:bg-plate-alt cursor-pointer"
                  }`}
                >
                  {opt === "True" ? "[ TRUE ]" : "[ FALSE ]"}
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Fill in blank */}
        {question.type === "fillintheblank" && (
          <motion.div
            className="px-5 py-4"
            variants={optionVariants}
            initial="hidden"
            animate="show"
          >
            <input
              type="text"
              disabled={submitted}
              value={selectedAnswer || ""}
              onChange={(e) => !submitted && onSelect(e.target.value)}
              placeholder="TYPE ANSWER HERE..."
              className="w-full"
            />
          </motion.div>
        )}

        {/* Result feedback */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className={`border-t border-rule overflow-hidden ${
                isCorrect ? "bg-green-950" : "bg-red-950/40"
              }`}
            >
              <div className="px-5 py-4">
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.18 }}
                  className={`font-terminal text-sm uppercase tracking-widest font-bold mb-2 ${
                    isCorrect ? "text-green-300" : "text-red-400"
                  }`}
                >
                  {isCorrect
                    ? "[ CORRECT ]"
                    : `[ INCORRECT â€” ANSWER: ${question.correctAnswer} ]`}
                </motion.p>
                {question.explanation && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.14, duration: 0.2 }}
                    className={`font-terminal text-xs leading-relaxed tracking-wide uppercase ${isCorrect ? "text-green-200" : "text-red-200"}`}
                  >
                    {question.explanation}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

