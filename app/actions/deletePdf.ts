"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Quiz from "@/lib/models/Quiz";

export async function deletePdf(pdfId: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await dbConnect();

  const pdf = await PDF.findOne({ _id: pdfId, userId: session.user.id });
  if (!pdf) return { success: false, error: "Not found" };

  await Promise.all([
    PDF.findByIdAndDelete(pdfId),
    Quiz.deleteMany({ pdfId }),
  ]);

  return { success: true };
}
