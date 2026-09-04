"use client";

import { useState } from "react";
import { customerAuthClient } from "@/app/lib/customer-auth-client";
import Link from "next/link";


export default function ResetPasswordPage() {
    const [step, setStep] = useState<"email" | "code" | "password" | "thanks">("email");
    const [email, setEmail] = useState("");
    const [emailConfirm, setEmailConfirm] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    
    async function sendCode(e: React.FormEvent) {
        e.preventDefault();
        await customerAuthClient.emailOtp.requestPasswordReset({ email });
        setStep("code");
      }
      
      async function verifyCode(e: React.FormEvent) {
        e.preventDefault();
        const { error } = await customerAuthClient.emailOtp.checkVerificationOtp({
          email,
          type: "forget-password",
          otp,
        });
        if (error) return;
        setStep("password");
      }
      
      async function resendCode() {
        await customerAuthClient.emailOtp.requestPasswordReset({ email });
      }
      
      async function savePassword(e: React.FormEvent) {
        e.preventDefault();
        const { error } = await customerAuthClient.emailOtp.resetPassword({
          email,
          otp,
          password,
        });
        if (error) return;
        setStep("thanks");
      }

return (
    <main className="relative flex min-h-screen flex-col bg-[#F5F2EB] px-6">
        <div className="mx-auto flex w-full max-w-xs flex-1 flex-col justify-center">
            {step === "email" && (
                <form onSubmit={sendCode}>
                    <h1 className="text-center text-2xl font-bold">
    パスワードの再設定
</h1>
<label className="mt-10 block text-sm font-bold">
    メールアドレス
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@example.com"
                          required
                          className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none "/>

                    </label>
                    <label className="mt-5 block text-sm font-bold">
                    メールアドレスの確認
              <input
                type="email"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                placeholder="example@mail.com"
                required
                className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
              />
                </label>
                <button 
                  type="submit"
                  className="mt-8 w-full rounded-xl bg-[#E2584B] py-4 text-sm font-bold text-white disabled:opacity-50"
                  disabled={!email || !emailConfirm}
                  >
                    認証コードの送信
                  </button>
            <Link
              href="/en/login"
              className="mt-6 block text-center text-sm text-[#E2584B]"
            >
              ログイン画面に戻る
            </Link>
            <Link
              href="/en/signup"
              className="mt-3 block text-center text-sm text-[#E2584B]"
            >
              会員登録画面に戻る
            </Link>
                </form>
            )}
        {step === "code" && (
            <form onSubmit={verifyCode}>
                <h1 className="text-center text-2xl font-bold">認証コードを入力</h1>
                <p className="mt-3 text-sm text-zinc-500 text-center">
              メールに記載されている6桁の数字を記入し、パスワードリセットを行ってください。
            </p>
            <label className="mt-8 block text-sm font-bold text-zinc-900">
  認証コード
  <input
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    required
    inputMode="numeric"
    placeholder="123456"
    className="mt-2 w-full rounded-xl bg-[#EFEBE3] px-4 py-3 outline-none placeholder:text-zinc-400"
  />
</label>
              <button
      type="submit"
      className="mt-8 w-full rounded-xl bg-[#E2584B] py-4 text-sm font-bold text-white"
    >
      確認
    </button>
    <button
      type="button"
      onClick={resendCode}
      className="mt-6 w-full text-center text-sm text-[#E2584B]"
    >
      認証コードを再送信
    </button>
            </form>
        )}
        {step === "password" && (
            <form onSubmit={savePassword}>
                <h1 className="text-center text-2xl font-bold">パスワードリセット</h1>
                <label className="mt-8 block text-sm font-bold">
              新しいパスワード
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
              />
            </label>
            <label className="mt-5 block text-sm font-bold">
              新しいパスワードの確認
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                placeholder="Confirm your password"
                className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
                minLength={8}
              />
            </label>
            <button 
              type="submit"
              className="mt-8 w-full rounded-xl bg-[#E2584B] py-4 text-sm font-bold text-white disabled:opacity-50"
              disabled={!password || !passwordConfirm}
              >
                パスワードリセット
              </button>
            </form>
        )}
        {step === "thanks" && (
            <div className="text-center">
                <h1 className="text-2xl font-bold">パスワードリセット完了</h1>
                <p className="mt-3 text-sm text-zinc-500">
              パスワードの再設定が完了しました。ログイン画面から再ログインをお願いします。
            </p>
                <Link 
                  href="/en/login"
                  className="mt-6 block text-center text-sm text-[#E2584B]"
                >
                  ログイン画面に戻る
                </Link>
            </div>
        )}
        </div>
    </main>
);
}