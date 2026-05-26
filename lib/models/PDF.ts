import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPDF extends Document {
  userId: string | null;
  guestIp: string | null;
  filename: string;
  fileSize: number;
  contentHash: string;
  rawText: string;
  truncatedText: string;
  wordCount: number;
  wasTruncated: boolean;
  topics: string[];
  uploadedAt: Date;
  processingStatus: "pending" | "processing" | "done" | "failed";
}

const PDFSchema = new Schema<IPDF>({
  userId: { type: String, default: null },
  guestIp: { type: String, default: null },
  filename: { type: String, required: true },
  fileSize: { type: Number, required: true },
  contentHash: { type: String, required: true },
  rawText: { type: String, required: true },
  truncatedText: { type: String, required: true },
  wordCount: { type: Number, required: true },
  wasTruncated: { type: Boolean, default: false },
  topics: [String],
  uploadedAt: { type: Date, default: Date.now },
  processingStatus: {
    type: String,
    enum: ["pending", "processing", "done", "failed"],
    default: "pending",
  },
});

PDFSchema.index({ userId: 1, contentHash: 1 });

const PDF: Model<IPDF> =
  mongoose.models.PDF || mongoose.model<IPDF>("PDF", PDFSchema);

export default PDF;
