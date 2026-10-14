"use client";

import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

export function MenuSubmitButton({ idleLabel }: { idleLabel: string }) {
  return (
    <PendingSubmitButton
      idleLabel={idleLabel}
      pendingLabel="登録中..."
      className="flex flex-1 items-center justify-center rounded-full bg-[#E2584B] px-4 py-2 text-sm text-white disabled:opacity-50"
    />
  );
}
