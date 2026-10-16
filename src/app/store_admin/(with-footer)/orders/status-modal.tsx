"use client";

import { useState } from "react";
import { updateOrderStatus } from "./action";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

const StatusChange = [
  {
    value: "processing",
    badge: "受付中",
    description: "調理中・提供待ち",
    badgeClass: "bg-[#E2584B] text-white",
  },
  {
    value: "done",
    badge: "完了",
    description: "提供完了・会計完了",
    badgeClass: "bg-emerald-600 text-white",
  },
  {
    value: "cancel",
    badge: "キャンセル",
    description: "注文取り消し",
    badgeClass: "bg-zinc-600 text-white",
  },
] as const;

export function StatusModal({
  orderId,
  status,
  orderNumber,
  items,
  orderedAt,
}: {
  orderId: string;
  status: string;
  orderNumber: string;
  items: string[];
  orderedAt: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(status);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSelected(status);
          setOpen(true);
        }}
        className="inline-block rounded-full border border-[#E2584B] px-4 py-1.5 text-sm text-[#E2584B]"
      >
        ステータスの変更
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8">
            <h2 className="mb-5 text-center text-lg font-bold">ステータス変更</h2>
            <form
              action={async (formData) => {
                await updateOrderStatus(formData);
                setOpen(false);
              }}
              className="flex flex-col gap-5"
            >
              <input type="hidden" name="id" value={orderId} />
              <div className="rounded-2xl bg-[#F7F3EC] px-5 py-4 text-sm text-zinc-800">
                <p>注文番号 #{orderNumber}</p>
                <p className="mt-1">商品 {items.join(", ") || "—"}</p>
                <p className="mt-1">注文時間 {orderedAt}</p>
              </div>
              <div className="flex flex-col gap-3">
                {StatusChange.map((opt) => {
                  const checked = selected === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-full border px-4 py-3 ${
                        checked ? "border-[#E2584B]" : "border-zinc-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={checked}
                        onChange={() => setSelected(opt.value)}
                        className="accent-[#E2584B]"
                      />
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${opt.badgeClass}`}
                      >
                        {opt.badge}
                      </span>
                      <span className="text-sm text-zinc-700">{opt.description}</span>
                    </label>
                  );
                })}
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-[#F4F1EA] py-3"
                >
                  キャンセル
                </button>
                <PendingSubmitButton
                  idleLabel="変更する"
                  pendingLabel="変更中..."
                  className="flex-1 rounded-full bg-[#E2584B] py-3 text-white disabled:opacity-50"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
