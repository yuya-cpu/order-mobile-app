"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await authClient.emailOtp.requestPasswordReset({ email });
    if (error) {
      setError("送信に失敗しました");
      return;
    }
    setStep("code");
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await authClient.emailOtp.checkVerificationOtp({
      email,
      type: "forget-password",
      otp,
    });
    if (error) {
      setError("認証コードが正しくありません");
      return;
    }
    setStep("password");
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });
    if (error) {
      setError("パスワードを更新できませんでした");
      return;
    }
    window.location.href = "/store_admin";
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white px-10 py-12 shadow-sm">
        {step === "email" && (
          <form onSubmit={sendCode}>
            <h1 className="text-3xl font-bold">パスワードの再発行</h1>
            <p className="mt-2 text-sm text-zinc-400">
              登録メールアドレスに認証コードを送ります
            </p>
            <label className="mt-8 block text-sm font-bold">
              メールアドレス
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
              />
            </label>
            {error ? <p className="mt-3 text-sm text-[#E2584B]">{error}</p> : null}
            <button
              type="submit"
              className="mt-8 w-full rounded-xl bg-[#E2584B] py-4 text-lg font-bold text-white"
            >
              認証コードを送る
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={verifyCode}>
            <h1 className="text-3xl font-bold">認証コード</h1>
            <p className="mt-2 text-sm text-zinc-400">
              {email} に送ったコードを入力してください
            </p>
            <label className="mt-8 block text-sm font-bold">
              認証コード
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
              className="mt-8 w-full rounded-xl bg-[#E2584B] py-4 text-lg font-bold text-white"
            >
              確認
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={savePassword}>
            <h1 className="text-3xl font-bold">新しいパスワード</h1>
            <label className="mt-8 block text-sm font-bold">
              パスワード
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
              />
            </label>
            {error ? <p className="mt-3 text-sm text-[#E2584B]">{error}</p> : null}
            <button
              type="submit"
              className="mt-8 w-full rounded-xl bg-[#E2584B] py-4 text-lg font-bold text-white"
            >
              パスワードをリセット
            </button>
          </form>
        )}

        <Link href="/store_admin" className="mt-6 block text-center text-sm text-[#E2584B]">
          ログインに戻る
        </Link>
      </div>
    </div>
  );
}