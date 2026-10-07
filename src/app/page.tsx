import Link from "next/link";
import { CustomerShell } from "@/components/customer/shell";

export default function LanguageSelectPage() {
  return (
    <CustomerShell>
    <main className="relative flex min-h-screen flex-col bg-white px-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-zinc-900">言語選択</h1>
        <p className="mt-3 text-sm text-zinc-400">You can choose a language</p>
        <div className="mt-16 flex w-full flex-col gap-6">
          <Link
            href="/ja/login"
            className="rounded-full border border-zinc-300 bg-white py-4 text-center text-lg text-zinc-800"
          >
            日本語
          </Link>
          <Link
            href="/en/login"
            className="rounded-full border border-zinc-300 bg-white py-4 text-center text-lg text-zinc-800"
          >
            English
          </Link>
        </div>
      </div>
    </main>
    </CustomerShell>
  );
}
