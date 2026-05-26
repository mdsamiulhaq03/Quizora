import { inngest } from "../client";
import dbConnect from "@/lib/db";
import WeakQuestion from "@/lib/models/WeakQuestion";
import User from "@/lib/models/User";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

export const sendReviewReminder = inngest.createFunction(
  { id: "send-review-reminder", triggers: [{ cron: "0 8 * * *" }] },
  async ({ step }: { step: { run: <T>(name: string, fn: () => Promise<T>) => Promise<T> } }) => {
    await step.run("send-reminders", async () => {
      await dbConnect();
      const now = new Date();

      const dueByUser = await WeakQuestion.aggregate([
        { $match: { nextReviewAt: { $lte: now } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]);

      for (const { _id: userId, count } of dueByUser) {
        const user = await User.findById(userId);
        if (!user?.email) continue;

        await getResend().emails.send({
          from: "noreply@yourdomain.com",
          to: user.email,
          subject: `${count} questions due for review today`,
          html: `<p>You have <strong>${count}</strong> weak questions due for spaced repetition review. <a href="${process.env.NEXTAUTH_URL}/review">Review now</a></p>`,
        });
      }
    });
  }
);
