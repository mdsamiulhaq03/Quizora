"use client";

import { useActionState } from "react";
import { signUpWithEmail } from "@/app/actions/signUpWithEmail";

export function EmailRegisterForm() {
  const [error, action, isPending] = useActionState(signUpWithEmail, null);

  return (
    <form action={action} className="space-y-3">
      <div>
        <label className="block font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-1">
          Name
        </label>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full bg-paper border border-rule px-3 py-2.5 font-terminal text-[0.7rem] text-ink focus:outline-none focus:border-hazard transition-colors"
          placeholder="Operator name"
        />
      </div>

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
          autoComplete="new-password"
          className="w-full bg-paper border border-rule px-3 py-2.5 font-terminal text-[0.7rem] text-ink focus:outline-none focus:border-hazard transition-colors"
          placeholder="Min. 8 characters"
        />
      </div>

      {error && (
        <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-red-500">
          ⚠ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-hazard text-white px-4 py-3 border border-hazard font-terminal text-[0.65rem] uppercase tracking-widest hover:bg-ink hover:border-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "[ CREATING ACCOUNT... ]" : "[ CREATE ACCOUNT WITH EMAIL ]"}
      </button>
    </form>
  );
}
