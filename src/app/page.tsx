import Link from "next/link";

export default function LanguageSelectPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-white px-6">
      <Link href="#" className="absolute left-4 top-4 text-[#E2584B]">
        &lt; 戻る
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-zinc-900">言語選択</h1>
        <p className="mt-3 text-sm text-zinc-400">you can chose launguage</p>

        <div className="mt-16 flex w-full max-w-xs flex-col gap-6">
          <Link
            href="/login"
            className="rounded-xl border border-zinc-300 bg-white py-4 text-center text-lg text-zinc-800"
          >
            日本語
          </Link>
          <Link
            href="/en/login"
            className="rounded-xl border border-zinc-300 bg-white py-4 text-center text-lg text-zinc-800"
          >
            English
          </Link>
        </div>
      </div>
    </main>
  );
}