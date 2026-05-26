import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizSession extends Document {
  userId: string | null;
  guestIp: string | null;
  quizId: mongoose.Types.ObjectId;
  answers: Record<string, string>;
  currentQuestionIndex: number;
  startedAt: Date;
  updatedAt: Date;
}

const QuizSessionSchema = new Schema<IQuizSession>(
  {
    userId: { type: String, default: null },
    guestIp: { type: String, default: null },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: { type: Schema.Types.Mixed, default: {} },
    currentQuestionIndex: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QuizSessionSchema.index({ userId: 1, quizId: 1 });

const QuizSession: Model<IQuizSession> =
  mongoose.models.QuizSession ||
  mongoose.model<IQuizSession>("QuizSession", QuizSessionSchema);

export default QuizSession;
