"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function signUpWithEmail(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!name || !email || !password) return "All fields are required.";
  if (password.length < 8) return "Password must be at least 8 characters.";

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) return "An account with this email already exists.";

  const hashed = await bcrypt.hash(password, 12);
  await User.create({
    name,
    email,
    password: hashed,
    isGuest: false,
    onboardingComplete: false,
    streak: 0,
    streakFreezeUsed: false,
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/onboarding" });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Account created. Please sign in.";
    }
    throw error;
  }
  return null;
}
