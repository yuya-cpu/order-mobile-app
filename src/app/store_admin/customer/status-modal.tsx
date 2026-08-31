"use client";

import { useState } from "react";
import { updateStatus } from "./action";

export function StatusModal(props: {
  userId: string;
  name: string;
  contact: string;
  isAccepted: boolean;
}) {
  const [open, setOpen] = useState(false);
  const suspending = props.isAccepted;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-block rounded-lg bg-[#F8E8E6] px-4 py-2 text-sm text-[#E2584B]"
      >
        変更
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold">
                {suspending ? "アカウント停止" : "アカウント再開"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <div
              className={
                suspending
                  ? "mb-4 rounded-xl border border-[#E2584B] bg-[#F8E8E6] px-4 py-3 text-sm text-[#E2584B]"
                  : "mb-4 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              }
            >
              {suspending
                ? "このユーザーのアカウントを停止しますか？停止すると、このユーザーは注文ができなくなります。"
                : "このユーザーのアカウントを再開しますか？再開すると、再び注文できるようになります。"}
            </div>

            <div className="mb-4 rounded-xl bg-[#F5F1EA] px-4 py-3 text-sm">
              <div className="flex justify-between gap-4 py-1">
                <span className="text-zinc-500">名前</span>
                <span>{props.name}</span>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <span className="text-zinc-500">顧客ID</span>
                <span>C-{props.userId.slice(0, 4).toUpperCase()}</span>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <span className="text-zinc-500">連絡先</span>
                <span className="text-right">{props.contact}</span>
              </div>
            </div>

            <form
              action={async (formData) => {
                await updateStatus(formData);
                setOpen(false);
              }}
              className="flex flex-col gap-4"
            >
              <input type="hidden" name="id" value={props.userId} />
              <input
                type="hidden"
                name="is_accepted"
                value={suspending ? "false" : "true"}
              />

              {suspending && (
                <label className="flex flex-col gap-2 text-sm text-zinc-600">
                  停止理由
                  <textarea
                    name="suspend_reason"
                    rows={3}
                    placeholder="停止理由を入力してください"
                    className="w-full rounded-xl border border-zinc-300 p-3 text-sm text-zinc-900"
                  />
                </label>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl bg-[#F5F1EA] py-3"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className={
                    suspending
                      ? "flex-1 rounded-xl bg-[#E2584B] py-3 text-white"
                      : "flex-1 rounded-xl bg-emerald-600 py-3 text-white"
                  }
                >
                  {suspending ? "停止する" : "再開する"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
