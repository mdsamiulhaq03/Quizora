export type QuestionType = "mcq" | "truefalse" | "fillintheblank";
export type Difficulty = "easy" | "medium" | "hard";
export type ProcessingStatus = "pending" | "processing" | "done" | "failed";
export type Confidence = "low" | "medium" | "high";

export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  topic: string;
  options?: QuestionOptions;
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  confidence: Confidence;
  timeSpentSeconds: number;
  flagged: boolean;
}

export interface RateLimitResult {
  success: boolean;
  error?: string;
  resetsAt?: Date;
  remaining?: number;
}

export interface UploadFormData {
  difficulty: Difficulty;
  questionCount: number;
  questionTypes: QuestionType[];
  generateByTopic: boolean;
}

export interface ProgressStats {
  totalQuizzes: number;
  averageScore: number;
  weakQuestionsDue: number;
  streak: number;
  bestScore: number;
  scoreHistory: { date: string; score: number }[];
  topicWeakness: { topic: string; wrongCount: number }[];
  recentQuizzes: {
    id: string;
    title: string;
    score: number;
    total: number;
    completedAt: Date;
  }[];
}

export interface SRSInterval {
  days: number;
  label: string;
}

export const SRS_INTERVALS: number[] = [1, 3, 7, 14, 30];
