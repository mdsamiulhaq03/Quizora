"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function EmailLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setIsPending(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full bg-paper border border-rule px-3 py-2.5 font-terminal text-[0.7rem] text-ink focus:outline-none focus:border-hazard transition-colors"
          placeholder="operator@domain.com"
        />
      </div>

      <div>
        <label className="block font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-paper border border-rule px-3 py-2.5 font-terminal text-[0.7rem] text-ink focus:outline-none focus:border-hazard transition-colors"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-hazard text-white px-4 py-3 border border-hazard font-terminal text-[0.65rem] uppercase tracking-widest hover:bg-ink hover:border-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "[ AUTHENTICATING... ]" : "[ SIGN IN WITH EMAIL ]"}
      </button>
    </form>
  );
}
