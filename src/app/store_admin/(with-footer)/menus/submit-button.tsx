"use client";

import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

export function MenuSubmitButton({ idleLabel }: { idleLabel: string }) {
  return (
    <PendingSubmitButton
      idleLabel={idleLabel}
      pendingLabel="登録中..."
      className="flex flex-1 items-center justify-center rounded-full bg-[#E2584B] py-4 text-white disabled:opacity-50"
    />
  );
}
