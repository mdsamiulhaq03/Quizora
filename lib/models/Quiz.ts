import mongoose, { Schema, Document, Model } from "mongoose";
import type { Question } from "../types";

export interface IQuiz extends Document {
  userId: string | null;
  guestIp: string | null;
  pdfId: mongoose.Types.ObjectId;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  questionTypes: ("mcq" | "truefalse" | "fillintheblank")[];
  questions: Question[];
  isPublic: boolean;
  publicSlug: string;
  createdAt: Date;
}

const QuestionSchema = new Schema(
  {
    id: String,
    type: { type: String, enum: ["mcq", "truefalse", "fillintheblank"] },
    question: String,
    topic: String,
    options: {
      A: String,
      B: String,
      C: String,
      D: String,
    },
    correctAnswer: String,
    explanation: String,
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  },
  { _id: false }
);

const QuizSchema = new Schema<IQuiz>(
  {
    userId: { type: String, default: null },
    guestIp: { type: String, default: null },
    pdfId: { type: Schema.Types.ObjectId, ref: "PDF", required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    questionCount: Number,
    questionTypes: [String],
    questions: [QuestionSchema],
    isPublic: { type: Boolean, default: false },
    publicSlug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

QuizSchema.index({ userId: 1, createdAt: -1 });

const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
