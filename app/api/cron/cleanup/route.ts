import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Quiz from "@/lib/models/Quiz";
import Attempt from "@/lib/models/Attempt";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json({ deleted: oldPdfIds.length });
}
