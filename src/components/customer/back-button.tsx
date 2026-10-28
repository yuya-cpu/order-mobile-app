"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";

export function CustomerBackButton({ fallback }: { fallback: string }) {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const dict = useDictionary();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(customerPath(lang, fallback));
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="absolute left-4 top-4 inline-flex items-center gap-0.5 text-sm text-[#E2584B]"
    >
      <ChevronLeft className="size-4" />
      {dict.common.back}
    </button>
  );
}
