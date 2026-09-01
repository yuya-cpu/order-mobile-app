"use client";

import { useState } from "react";
import { updateOrderStatus } from "./action";


const StatusChange = [
    { value: "done", label: "完了" },
    { value: "cancel", label: "キャンセル" },
    { value: "processing", label: "調理中" },
] as const;

export function StatusModal({ orderId, status, }:
    { orderId: string;
      status: string;
    }) {
const [open, setOpen] = useState(false);

return (
    <>
    <button
  type="button"
  onClick={() => setOpen(true)}
  className="inline-block rounded-full border border-[#E2584B] px-4 py-1.5 text-sm text-[#E2584B]"
>
  ステータスの変更
</button>

    {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
                <h2 className="mb-4 text-lg font-bold">ステータスの変更</h2>
                <form
              action={async (formData) => {
                await updateOrderStatus(formData);
                setOpen(false);
              }}
              className="flex flex-col gap-3"
            >
             <input type="hidden" name="id" value={orderId} />
              {StatusChange.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    defaultChecked={status === opt.value}
                  />
                  {opt.label}
                </label>
              ))}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-2xl border py-2"
                >
                    閉じる
                </button>
                <button type="submit" className="flex-1 rounded-2xl bg-[#E2584B] py-2 text-white">
                    変更する
                </button>
                </div>
              </form>
            </div>
          </div>
          )}
        </>
    );
}
