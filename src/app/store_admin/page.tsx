"use client";

import { authClient } from "../lib/auth-client";
import { useState } from "react";

export default function StoreAdminPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function onSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError("");
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/store_admin/home",
      });
      if (error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      }
    }

    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-lg rounded-3xl bg-white px-10 py-12 shadow-sm"
        >
           <label className="mt-8 block text-sm font-bold text-zinc-900">
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
            />
          </label>
          <label className="mt-5 block text-sm font-bold text-zinc-900">
            パスワード
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-2 w-full rounded-xl bg-[#F4F1EA] px-4 py-3 outline-none"
            />
          </label>
          {error ? <p className="mt-3 text-sm text-[#E2584B]">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-8 w-full rounded-xl bg-[#E2584B] py-4 text-lg font-bold text-white disabled:opacity-60"
          >
            ログイン
          </button>
          <button
            type="button"
            className="mt-6 block w-full text-center text-sm text-[#E2584B]"
          >
            パスワードの再発行
          </button>
        </form>
      </div>
    );
  }