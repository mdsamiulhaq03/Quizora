import { inngest } from "../client";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Quiz from "@/lib/models/Quiz";
import { generateQuestionsForPdf } from "@/app/actions/generateMcq";
import { deduplicateQuestions } from "@/lib/dedup";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

export const processPdf = inngest.createFunction(
  { id: "process-pdf", triggers: [{ event: "pdf/process" }] },
  async ({ event, step }: { event: { data: Record<string, unknown> }; step: { run: <T>(name: string, fn: () => Promise<T>) => Promise<T> } }) => {
    const { pdfId, userId, guestIp, userEmail, difficulty, questionCount, questionTypes } =
      event.data as {
        pdfId: string;
        userId: string | null;
        guestIp: string | null;
        userEmail: string | null;
        difficulty: string;
        questionCount: number;
        questionTypes: string[];
      };

    await step.run("set-processing", async () => {
      await dbConnect();
      await PDF.findByIdAndUpdate(pdfId, { processingStatus: "processing" });
    });

    const quiz = await step.run("generate-questions", async () => {
      await dbConnect();
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

      const newQuiz = await Quiz.create({
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
      return newQuiz;
    });

    if (userId && userEmail) {
      await step.run("send-email", async () => {
        await getResend().emails.send({
          from: "noreply@yourdomain.com",
          to: userEmail,
          subject: "Your quiz is ready!",
          html: `<p>Your quiz "<strong>${quiz.title}</strong>" is ready. <a href="${process.env.NEXTAUTH_URL}/quiz/${quiz._id}">Take it now</a></p>`,
        });
      });
    }

    return { quizId: quiz._id.toString() };
  }
);
