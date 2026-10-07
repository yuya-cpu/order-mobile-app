"use client";

import { useState } from "react";
import { customerAuthClient } from "@/app/lib/customer-auth-client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";


export default function ResetPasswordPage() {
    const { lang } = useParams<{ lang: string }>();
    const dict = useDictionary();
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
    {dict.resetPassword.title}
</h1>
<label className="mt-10 block text-sm font-bold">
    {dict.resetPassword.email}
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@example.com"
                          required
                          className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none "/>

                    </label>
                    <label className="mt-5 block text-sm font-bold">
                    {dict.resetPassword.emailConfirm}
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
                  className="mt-8 w-full rounded-full bg-[#E2584B] py-4 text-sm font-bold text-white disabled:opacity-50"
                  disabled={!email || !emailConfirm}
                  >
                    {dict.resetPassword.sendCode}
                  </button>
            <Link
              href={customerPath(lang, "/login")}
              className="mt-6 block text-center text-sm text-[#E2584B]"
            >
              {dict.resetPassword.backToLogin}
            </Link>
            <Link
              href={customerPath(lang, "/signup")}
              className="mt-3 block text-center text-sm text-[#E2584B]"
            >
              {dict.resetPassword.toSignup}
            </Link>
                </form>
            )}
        {step === "code" && (
            <form onSubmit={verifyCode}>
                <h1 className="text-center text-2xl font-bold">{dict.resetPassword.codeTitle}</h1>
                <p className="mt-3 text-sm text-zinc-500 text-center">
              {dict.resetPassword.codeHelp}
            </p>
            <label className="mt-8 block text-sm font-bold text-zinc-900">
  {dict.resetPassword.code}
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
      className="mt-8 w-full rounded-full bg-[#E2584B] py-4 text-sm font-bold text-white"
    >
      {dict.resetPassword.confirm}
    </button>
    <button
      type="button"
      onClick={resendCode}
      className="mt-6 w-full text-center text-sm text-[#E2584B]"
    >
      {dict.resetPassword.resend}
    </button>
            </form>
        )}
        {step === "password" && (
            <form onSubmit={savePassword}>
                <h1 className="text-center text-2xl font-bold">{dict.resetPassword.newPasswordTitle}</h1>
                <label className="mt-8 block text-sm font-bold">
              {dict.resetPassword.newPassword}
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
              {dict.resetPassword.newPasswordConfirm}
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
              className="mt-8 w-full rounded-full bg-[#E2584B] py-4 text-sm font-bold text-white disabled:opacity-50"
              disabled={!password || !passwordConfirm}
              >
                {dict.resetPassword.save}
              </button>
            </form>
        )}
        {step === "thanks" && (
            <div className="text-center">
                <h1 className="text-2xl font-bold">{dict.resetPassword.doneTitle}</h1>
                <p className="mt-3 text-sm text-zinc-500">
              {dict.resetPassword.doneBody}
            </p>
                <Link 
                  href={customerPath(lang, "/login")}
                  className="mt-6 block text-center text-sm text-[#E2584B]"
                >
                  {dict.resetPassword.backToLogin}
                </Link>
            </div>
        )}
        </div>
    </main>
);
}