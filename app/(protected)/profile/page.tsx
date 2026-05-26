import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).lean();

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-0">

        {/* Identity panel */}
        <div className="border border-rule">
          <div className="border-b border-rule px-5 py-2 bg-plate flex items-center justify-between">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              OPERATOR PROFILE
            </span>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
              ● AUTHENTICATED
            </span>
          </div>
          <div className="px-5 py-5 flex items-center gap-5">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="avatar"
                width={56}
                height={56}
                className="grayscale border border-rule"
                style={{ borderRadius: "0 !important" }}
              />
            ) : (
              <div className="w-14 h-14 bg-hazard flex items-center justify-center border border-rule shrink-0">
                <span className="font-display text-white text-xl">{session.user.name?.[0]?.toUpperCase() || "U"}</span>
              </div>
            )}
            <div>
              <p
                className="font-display uppercase text-ink leading-none"
                style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}
              >
                {session.user.name?.toUpperCase()}
              </p>
              <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mt-1">
                {session.user.email}
              </p>
              <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-1">
                MEMBER SINCE:{" "}
                {user
                  ? new Date((user as { createdAt?: Date }).createdAt || Date.now())
                      .toLocaleDateString("en-US", { month: "short", year: "numeric" })
                      .toUpperCase()
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Account actions */}
        <div className="border-x border-b border-rule">
          <div className="border-b border-rule px-5 py-2 bg-plate">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              ACCOUNT CONTROLS
            </span>
          </div>
          <div className="px-5 py-4">
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
          </div>
        </div>

        {/* Data panel */}
        <div className="border-x border-b border-rule">
          <div className="border-b border-rule px-5 py-2 bg-plate">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              DATA AND PRIVACY
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-4">
              EXPORT OR DELETE ALL YOUR DATA AT ANY TIME.
            </p>
            <a
              href="/api/export"
              className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink px-5 py-2.5 hover:border-hazard hover:text-hazard transition-colors inline-block"
            >
              [ EXPORT DATA ]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
