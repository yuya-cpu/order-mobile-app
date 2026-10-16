"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { cancelOrder } from "../../../orders/action";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

export function CancelConfirmModal({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-[#F8E8E6] px-4 py-3 text-[#E2584B]"
      >
        注文のキャンセル
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white px-8 py-10 text-center">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full border-2 border-[#E2584B] text-[#E2584B]">
              <TriangleAlert className="size-6" />
            </div>
            <h2 className="text-lg font-bold">注文をキャンセルしますか？</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              この操作は取り消せません。キャンセルするとお客様へ通知が自動送信されます。
            </p>
            <form
              action={cancelOrder.bind(null, orderId)}
              className="mt-8 flex gap-3"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-[#F4F1EA] py-3"
              >
                いいえ
              </button>
              <PendingSubmitButton
                idleLabel="はい"
                pendingLabel="処理中..."
                className="flex-1 rounded-xl bg-[#E2584B] py-3 text-white disabled:opacity-50"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
