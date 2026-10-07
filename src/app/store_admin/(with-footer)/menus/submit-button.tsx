"use client";

import { useFormStatus } from "react-dom";

export function MenuSubmitButton({ idleLabel }: { idleLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex flex-1 items-center justify-center rounded-full bg-[#E2584B] px-4 py-2 text-sm text-white disabled:opacity-50"
    >
      {pending ? "登録中..." : idleLabel}
    </button>
  );
}
