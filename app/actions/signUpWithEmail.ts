"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
): Promise<{ error: string } | { success: true }> {
  if (!name || !email || !password) return { error: "All fields are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  await dbConnect();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return { error: "An account with this email already exists." };

  const hashed = await bcrypt.hash(password, 12);
  await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashed,
    isGuest: false,
    onboardingComplete: false,
    streak: 0,
    streakFreezeUsed: false,
  });

  return { success: true };
}
