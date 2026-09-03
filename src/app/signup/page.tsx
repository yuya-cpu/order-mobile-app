"use client";

import { useState } from "react";
import Link from "next/link";
import { customerAuthClient } from "@/app/lib/customer-auth-client";

export default function mailSignup() {
  const [step, setStep] = useState<"form" | "code" | "thanks">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    await customerAuthClient.signUp.email({
      name: email,
      email,
      password,
    });
    setStep("code");
  }
  
  async function confirmCode(e: React.FormEvent) {
    e.preventDefault();
    await customerAuthClient.emailOtp.checkVerificationOtp({
      email,
      type: "email-verification",
      otp,
    });
    setStep("thanks");
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-white px-6">
      {step !== "thanks" ? (
        <Link href="/" className="absolute left-4 top-4 text-[#E2584B]">
          &lt; Back
        </Link>
      ) : null}

      <div className="mx-auto flex w-full max-w-xs flex-1 flex-col justify-center">
        {step === "form" && (
          <form onSubmit={sendCode}>
            <h1 className="text-center text-2xl font-bold">E-mail adress</h1>
            <label className="mt-10 block text-sm font-bold">
              E-mail adress
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
              />
            </label>
            <label className="mt-5 block text-sm font-bold">
              password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
              />
            </label>
            <button
              type="submit"
              className="mt-10 w-full rounded-xl bg-[#E2584B] py-4 text-sm font-bold text-white"
            >
              send the verification code
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={confirmCode}>
            <h1 className="text-center text-2xl font-bold">
              enter the verification code
            </h1>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              inputMode="numeric"
              className="mt-10 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
            />
            <button
              type="submit"
              className="mt-10 w-full rounded-xl bg-[#E2584B] py-4 text-sm font-bold text-white"
            >
              confirm
            </button>
          </form>
        )}

        {step === "thanks" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold">会員登録完了</h1>
            <Link
              href="/en/login"
              className="mt-10 block w-full rounded-xl bg-[#E2584B] py-4 text-sm font-bold text-white"
            >
              ログイン画面に戻る
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}