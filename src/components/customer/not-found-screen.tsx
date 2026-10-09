"use client";

import { useLayoutEffect, useState } from "react";
import { customerPath, isLocale } from "@/i18n/config";
import { dictionaryFor } from "@/i18n/get-dictionary";

function FileSearchIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="size-14 text-[#E2584B]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 12h18l10 10v30a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M36 12v10h10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="34" r="7" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M35 39.5 41 46"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function langFromPath(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : undefined;
}

export function NotFoundScreen() {
  const [lang, setLang] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    // 404 では usePathname が実 URL にならないことがあるので location を使う。
    setLang(langFromPath(window.location.pathname));
  }, []);

  const dict = dictionaryFor(lang);

  function goHome() {
    const nextLang = langFromPath(window.location.pathname);
    window.location.assign(nextLang ? customerPath(nextLang, "/order/order-type") : "/");
  }

  return (
    <main className="flex min-h-full flex-1 flex-col bg-white px-6">
      <h1 className="pt-8 text-center text-lg font-bold text-zinc-900">
        {dict.notFound.pageTitle}
      </h1>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex size-24 items-center justify-center rounded-[1.75rem] bg-[#F4F1EA]">
          <FileSearchIcon />
        </div>
        <p className="mt-8 text-6xl font-bold tracking-tight text-[#E2584B]">
          {dict.notFound.code}
        </p>
        <p className="mt-4 text-xl font-bold text-zinc-900">{dict.notFound.title}</p>
        <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-zinc-400">
          {dict.notFound.description}
        </p>
      </div>
      <button
        type="button"
        onClick={goHome}
        className="mb-8 flex h-14 items-center justify-center rounded-full bg-[#E2584B] text-base font-medium text-white"
      >
        {dict.notFound.home}
      </button>
    </main>
  );
}
