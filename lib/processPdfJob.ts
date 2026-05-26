import dbConnect from "./db";
import PDF from "./models/PDF";
import Quiz from "./models/Quiz";
import { generateQuestionsForPdf } from "@/app/actions/generateMcq";
import { deduplicateQuestions } from "./dedup";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

export async function processPdfJob(params: {
  pdfId: string;
  userId: string | null;
  guestIp: string | null;
  userEmail: string | null;
  difficulty: string;
  questionCount: number;
  questionTypes: string[];
}): Promise<string> {
  const { pdfId, userId, guestIp, userEmail, difficulty, questionCount, questionTypes } = params;

  await dbConnect();
  await PDF.findByIdAndUpdate(pdfId, { processingStatus: "processing" });

  const pdf = await PDF.findById(pdfId);
  if (!pdf) throw new Error("PDF not found");

  const rawQuestions = await generateQuestionsForPdf({
    truncatedText: pdf.truncatedText,
    difficulty: difficulty as "easy" | "medium" | "hard",
    questionCount,
    questionTypes: questionTypes as ("mcq" | "truefalse" | "fillintheblank")[],
  });

  const deduped = deduplicateQuestions(rawQuestions);
  const topics = [...new Set(deduped.map((q) => q.topic).filter(Boolean))];
  await PDF.findByIdAndUpdate(pdfId, { topics });

  const slug = `${pdf.filename.replace(/\s+/g, "-").toLowerCase().replace(/\.pdf$/i, "")}-${Date.now()}`;

  const quiz = await Quiz.create({
    userId: userId || null,
    guestIp: guestIp || null,
    pdfId,
    title: pdf.filename.replace(/\.pdf$/i, ""),
    difficulty: difficulty as "easy" | "medium" | "hard",
    questionCount: deduped.length,
    questionTypes: questionTypes as ("mcq" | "truefalse" | "fillintheblank")[],
    questions: deduped,
    publicSlug: slug,
  });

  await PDF.findByIdAndUpdate(pdfId, { processingStatus: "done" });

  if (userId && userEmail) {
    const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    await getResend().emails.send({
      from,
      to: userEmail,
      subject: "Your quiz is ready!",
      html: `<p>Your quiz "<strong>${quiz.title}</strong>" is ready. <a href="${appUrl}/quiz/${quiz._id}">Take it now</a></p>`,
    });
  }

  return quiz._id.toString();
}
