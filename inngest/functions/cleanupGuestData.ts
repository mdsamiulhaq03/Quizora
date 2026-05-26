import { inngest } from "../client";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Quiz from "@/lib/models/Quiz";
import Attempt from "@/lib/models/Attempt";

export const cleanupGuestData = inngest.createFunction(
  { id: "cleanup-guest-data", triggers: [{ cron: "0 2 * * *" }] },
  async ({ step }: { step: { run: <T>(name: string, fn: () => Promise<T>) => Promise<T> } }) => {
    await step.run("delete-old-guest-records", async () => {
      await dbConnect();
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const oldPdfs = await PDF.find({
        guestIp: { $ne: null },
        uploadedAt: { $lt: cutoff },
      }).select("_id");

      const oldPdfIds = oldPdfs.map((p) => p._id);

      await Quiz.deleteMany({ pdfId: { $in: oldPdfIds } });
      await Attempt.deleteMany({ guestIp: { $ne: null }, createdAt: { $lt: cutoff } });
      await PDF.deleteMany({ _id: { $in: oldPdfIds } });

      return { deleted: oldPdfIds.length };
    });
  }
);
