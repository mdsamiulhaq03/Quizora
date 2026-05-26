export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  await User.findOneAndUpdate({ email: session.user.email }, { onboardingComplete: true });

  return NextResponse.json({ success: true });
}
