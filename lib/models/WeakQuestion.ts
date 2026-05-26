import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWeakQuestion extends Document {
  userId: string;
  quizId: mongoose.Types.ObjectId;
  questionId: string;
  question: string;
  type: string;
  options?: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
  explanation: string;
  topic: string;
  timesWrong: number;
  wrongAnswerFrequency: { A: number; B: number; C: number; D: number };
  misconceptionFlag: string;
  confidenceHistory: ("low" | "medium" | "high")[];
  nextReviewAt: Date;
  srsInterval: number;
  lastAttemptedAt: Date;
}

const WeakQuestionSchema = new Schema<IWeakQuestion>(
  {
    userId: { type: String, required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    questionId: { type: String, required: true },
    question: String,
    type: String,
    options: { A: String, B: String, C: String, D: String },
    correctAnswer: String,
    explanation: String,
    topic: String,
    timesWrong: { type: Number, default: 1 },
    wrongAnswerFrequency: {
      A: { type: Number, default: 0 },
      B: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
      D: { type: Number, default: 0 },
    },
    misconceptionFlag: { type: String, default: "" },
    confidenceHistory: [{ type: String, enum: ["low", "medium", "high"] }],
    nextReviewAt: { type: Date, required: true },
    srsInterval: { type: Number, default: 1 },
    lastAttemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WeakQuestionSchema.index({ userId: 1, nextReviewAt: 1 });
WeakQuestionSchema.index({ userId: 1, quizId: 1, questionId: 1 }, { unique: true });

const WeakQuestion: Model<IWeakQuestion> =
  mongoose.models.WeakQuestion ||
  mongoose.model<IWeakQuestion>("WeakQuestion", WeakQuestionSchema);

export default WeakQuestion;
