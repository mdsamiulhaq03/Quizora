"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingOverlay from "@/components/onboarding/OnboardingOverlay";

export default function OnboardingPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleComplete = async () => {
    await fetch("/api/onboarding/complete", { method: "POST" });
    router.push("/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center ind-surface">
        <div className="border border-rule bg-plate px-8 py-6 text-center">
          <p className="font-terminal text-xs uppercase tracking-widest text-hazard animate-pulse">
            ● AUTHENTICATING...
          </p>
        </div>
      </div>
    );
  }

  return <OnboardingOverlay onComplete={handleComplete} />;
}
