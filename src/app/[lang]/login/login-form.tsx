"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { customerAuthClient } from "@/app/lib/customer-auth-client";
import { customerPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export function LoginForm({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function loginWithLine() {
    await customerAuthClient.signIn.social({
      provider: "line",
      callbackURL: customerPath(lang, "/order/order-type"),
      errorCallbackURL: customerPath(lang, "/login"),
      newUserCallbackURL: customerPath(lang, "/order/order-type"),
    });
  }

  async function loginWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error: signInError } = await customerAuthClient.signIn.email({
      email,
      password,
      callbackURL: customerPath(lang, "/order/order-type"),
    });
    if (signInError) {
      setError(dict.login.error);
    }
  }

  if (lang === "en") {
    return (
      <main className="relative flex min-h-screen flex-col bg-white px-6">
        <Link href="/" className="absolute left-4 top-4 inline-flex items-center gap-0.5 text-[#E2584B]">
          <ChevronLeft className="size-4" />
          {dict.common.back}
        </Link>
        <form
          onSubmit={loginWithEmail}
          className="mx-auto flex w-full max-w-xs flex-1 flex-col items-center justify-center"
        >
          <h1 className="text-3xl font-bold">{dict.login.title}</h1>
          <label className="mt-8 w-full text-sm font-bold">
            {dict.login.email}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
            />
          </label>
          <label className="mt-5 w-full text-sm font-bold">
            {dict.login.password}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
            />
          </label>
          {error ? <p className="mt-3 w-full text-sm text-[#E2584B]">{error}</p> : null}
          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-[#E2584B] py-4 text-lg font-bold text-white"
          >
            {dict.login.submit}
          </button>
          <Link
            href={customerPath(lang, "/reset-password")}
            className="mt-6 text-sm text-[#E2584B]"
          >
            {dict.login.forgotPassword}
          </Link>
          <Link href={customerPath(lang, "/signup")} className="mt-3 text-sm text-[#E2584B]">
            {dict.login.signup}
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-white px-6">
      <Link href="/" className="absolute left-4 top-4 inline-flex items-center gap-0.5 text-[#E2584B]">
        <ChevronLeft className="size-4" />
        {dict.common.back}
      </Link>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">{dict.login.title}</h1>
        <label className="mt-8 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="size-4 accent-[#E2584B]"
          />
          {dict.login.agree}
        </label>
        <button
          type="button"
          disabled={!agreed}
          onClick={loginWithLine}
          className="mt-10 w-full max-w-xs rounded-xl bg-[#06C755] py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {dict.login.line}
        </button>
        <Link href={customerPath(lang, "/signup")} className="mt-6 text-sm text-[#E2584B]">
          {dict.login.signup}
        </Link>
      </div>
    </main>
  );
}
