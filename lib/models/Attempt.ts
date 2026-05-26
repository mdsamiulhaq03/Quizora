import mongoose, { Schema, Document, Model } from "mongoose";
import type { AnswerRecord } from "../types";

export interface IAttempt extends Document {
  userId: string | null;
  guestIp: string | null;
  quizId: mongoose.Types.ObjectId;
  answers: AnswerRecord[];
  score: number;
  total: number;
  isPaused: boolean;
  pausedAtQuestionIndex: number;
  completedAt?: Date;
}

const AnswerSchema = new Schema(
  {
    questionId: String,
    selectedAnswer: String,
    isCorrect: Boolean,
    confidence: { type: String, enum: ["low", "medium", "high"] },
    timeSpentSeconds: Number,
    flagged: Boolean,
  },
  { _id: false }
);

const AttemptSchema = new Schema<IAttempt>(
  {
    userId: { type: String, default: null },
    guestIp: { type: String, default: null },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [AnswerSchema],
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    isPaused: { type: Boolean, default: false },
    pausedAtQuestionIndex: { type: Number, default: 0 },
    completedAt: Date,
  },
  { timestamps: true }
);

AttemptSchema.index({ userId: 1, completedAt: -1 });
AttemptSchema.index({ quizId: 1 });

const Attempt: Model<IAttempt> =
  mongoose.models.Attempt || mongoose.model<IAttempt>("Attempt", AttemptSchema);

export default Attempt;
