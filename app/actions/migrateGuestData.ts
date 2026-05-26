"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Quiz from "@/lib/models/Quiz";
import Attempt from "@/lib/models/Attempt";
import User from "@/lib/models/User";
import { clearGuestUploadLimit } from "@/lib/ratelimit";
import { headers } from "next/headers";

export async function migrateGuestData(_guestQuizId: string | null) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const userId = session.user.id;

  await dbConnect();

  // Migrate all guest records from this IP
  await PDF.updateMany({ guestIp: ip }, { $set: { userId, guestIp: null } });
  await Quiz.updateMany({ guestIp: ip }, { $set: { userId, guestIp: null } });
  await Attempt.updateMany({ guestIp: ip }, { $set: { userId, guestIp: null } });

  // Clear rate limit
  await clearGuestUploadLimit(ip);

  // Set onboarding
  await User.findOneAndUpdate(
    { email: session.user.email },
    { onboardingComplete: false }
  );

  return { success: true };
}
