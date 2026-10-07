"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { customerAuthClient } from "@/app/lib/customer-auth-client";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";

export default function SignupPage() {
  const { lang } = useParams<{ lang: string }>();
  const dict = useDictionary();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "code">("form");
  const [error, setError] = useState("");

  async function signupWithLine() {
    await customerAuthClient.signIn.social({
      provider: "line",
      callbackURL: customerPath(lang, "/order/order-type"),
      errorCallbackURL: customerPath(lang, "/login"),
      newUserCallbackURL: customerPath(lang, "/order/order-type"),
    });
  }

  async function signupWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirm) {
      setError(dict.signup.mismatch);
      return;
    }
    const { error: signUpError } = await customerAuthClient.signUp.email({
      email,
      password,
      name: email,
    });
    if (signUpError) {
      setError(dict.signup.error);
      return;
    }
    setStep("code");
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error: verifyError } = await customerAuthClient.emailOtp.checkVerificationOtp({
      email,
      type: "email-verification",
      otp,
    });
    if (verifyError) {
      setError(dict.signup.error);
      return;
    }
    router.push(customerPath(lang, "/order/order-type"));
  }

  if (lang === "en") {
    return (
      <main className="relative flex min-h-screen flex-col bg-white px-6">
        <Link href="/" className="absolute left-4 top-4 text-[#E2584B]">
          &lt; {dict.common.back}
        </Link>
        <div className="mx-auto flex w-full max-w-xs flex-1 flex-col items-center justify-center">
          {step === "form" ? (
            <form onSubmit={signupWithEmail} className="w-full">
              <h1 className="text-center text-2xl font-bold">{dict.signup.emailTitle}</h1>
              <p className="mt-4 text-center text-sm text-zinc-500">
                {dict.signup.emailDescription}
              </p>
              <label className="mt-8 block text-sm font-bold">
                {dict.signup.email}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
                />
              </label>
              <label className="mt-5 block text-sm font-bold">
                {dict.signup.password}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
                />
              </label>
              <label className="mt-5 block text-sm font-bold">
                {dict.signup.passwordConfirm}
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  minLength={8}
                  className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
                />
              </label>
              {error ? <p className="mt-3 text-sm text-[#E2584B]">{error}</p> : null}
              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-[#E2584B] py-4 text-lg font-bold text-white"
              >
                {dict.signup.submit}
              </button>
              <Link
                href={customerPath(lang, "/login")}
                className="mt-6 block text-center text-sm text-[#E2584B]"
              >
                {dict.signup.toLogin}
              </Link>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="w-full">
              <h1 className="text-center text-2xl font-bold">{dict.signup.verifyTitle}</h1>
              <p className="mt-4 text-center text-sm text-zinc-500">{dict.signup.verifyHelp}</p>
              <label className="mt-8 block text-sm font-bold">
                {dict.signup.code}
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  inputMode="numeric"
                  className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
                />
              </label>
              {error ? <p className="mt-3 text-sm text-[#E2584B]">{error}</p> : null}
              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-[#E2584B] py-4 text-lg font-bold text-white"
              >
                {dict.signup.confirm}
              </button>
            </form>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-white px-6">
      <Link href="/" className="absolute left-4 top-4 text-[#E2584B]">
        &lt; {dict.common.back}
      </Link>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-center text-2xl font-bold">{dict.signup.title}</h1>
        <p className="mt-4 max-w-xs text-center text-sm text-zinc-500">
          {dict.signup.description}
        </p>
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
          onClick={signupWithLine}
          className="mt-10 w-full rounded-full bg-[#06C755] py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {dict.signup.line}
        </button>
      </div>
    </main>
  );
}
