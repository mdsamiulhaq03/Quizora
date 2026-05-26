import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import WeakQuestion from "@/lib/models/WeakQuestion";
import User from "@/lib/models/User";
import { Resend } from "resend";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const now = new Date();

  const dueByUser = await WeakQuestion.aggregate([
    { $match: { nextReviewAt: { $lte: now } } },
    { $group: { _id: "$userId", count: { $sum: 1 } } },
  ]);

  const resend = new Resend(process.env.RESEND_API_KEY);
  for (const { _id: userId, count } of dueByUser) {
    const user = await User.findById(userId);
    if (!user?.email) continue;

    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: user.email,
      subject: `${count} questions due for review today`,
      html: `<p>You have <strong>${count}</strong> weak questions due for spaced repetition review. <a href="${process.env.NEXTAUTH_URL}/review">Review now</a></p>`,
    });
  }

  return NextResponse.json({ notified: dueByUser.length });
}
