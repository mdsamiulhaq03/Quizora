import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import ProfileClient from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).lean();

  const memberSince = user
    ? new Date((user as { createdAt?: Date }).createdAt || Date.now())
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
        .toUpperCase()
    : "—";

  const typedUser = user as { streak?: number; streakFreezeUsed?: boolean } | null;

  return (
    <div className="min-h-[100dvh] bg-paper text-ink ind-surface">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <ProfileClient
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
          image={session.user.image ?? null}
          memberSince={memberSince}
          streak={typedUser?.streak ?? 0}
          freezeAvailable={!(typedUser?.streakFreezeUsed ?? false)}
        >
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-5 py-2.5 hover:border-hazard hover:text-hazard transition-colors"
            >
              [ SIGN OUT ]
            </button>
          </form>
        </ProfileClient>
      </div>
    </div>
  );
}
