"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { generateCouponCode } from "@/app/lib/coupon-code";

export type TargetOption = { id: string; name: string };

export type CouponDefaults = {
  id: string;
  name: string;
  name_en: string | null;
  type: "percent" | "amount";
  number: number;
  code: string | null;
  target_menu_id: string | null;
  target_category_id: string | null;
};

type TargetScope = "all" | "menu" | "category";

function initialScope(coupon?: CouponDefaults): TargetScope {
  if (coupon?.target_menu_id) return "menu";
  if (coupon?.target_category_id) return "category";
  return "all";
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 rounded-full bg-[#E2584B] py-3 text-white disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function CouponForm({
  action,
  menus,
  categories,
  coupon,
}: {
  action: (formData: FormData) => void | Promise<void>;
  menus: TargetOption[];
  categories: TargetOption[];
  coupon?: CouponDefaults;
}) {
  const [type, setType] = useState<"percent" | "amount">(coupon?.type ?? "percent");
  const [scope, setScope] = useState<TargetScope>(() => initialScope(coupon));
  const [code, setCode] = useState(() => coupon?.code ?? generateCouponCode());

  const scopeLabels: { value: TargetScope; label: string }[] = [
    { value: "all", label: "全商品" },
    { value: "menu", label: "特定メニュー" },
    { value: "category", label: "カテゴリ" },
  ];

  return (
    <form
      action={action}
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl bg-white p-5 sm:p-8"
    >
      {coupon && <input type="hidden" name="id" value={coupon.id} />}

      <h1 className="text-center text-2xl font-bold">
        {coupon ? "クーポンの編集" : "新規クーポン情報の入力"}
      </h1>

      <label className="flex flex-col gap-2 font-medium">
        クーポン名
        <input
          name="name"
          required
          placeholder="クーポン名"
          defaultValue={coupon?.name}
          className="rounded-md border border-gray-300 p-3"
        />
      </label>

      <label className="flex flex-col gap-2 font-medium">
        英語名
        <input
          name="name_en"
          placeholder="English name"
          defaultValue={coupon?.name_en ?? ""}
          className="rounded-md border border-gray-300 p-3"
        />
      </label>

      <div>
        <p className="mb-2 font-medium">割引タイプ</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType("percent")}
            className={`w-full rounded-md px-4 py-3 ${type === "percent" ? "bg-[#E2584B] text-white" : "bg-gray-200 text-gray-700"}`}
          >
            %割引
          </button>
          <button
            type="button"
            onClick={() => setType("amount")}
            className={`w-full rounded-md px-4 py-3 ${type === "amount" ? "bg-[#E2584B] text-white" : "bg-gray-200 text-gray-700"}`}
          >
            固定金額 (円)
          </button>
        </div>
        <input type="hidden" name="type" value={type} />
      </div>

      <label className="flex flex-col gap-2 font-medium">
        {type === "percent" ? "割引率" : "割引金額"}
        <div className="flex items-center gap-3">
          <input
            name="number"
            type="number"
            required
            min={1}
            placeholder={type === "percent" ? "例: 10" : "例: 100"}
            defaultValue={coupon?.number}
            className="min-w-0 flex-1 rounded-md border border-gray-300 p-3"
          />
          <span className="shrink-0 text-zinc-600">{type === "percent" ? "%" : "円"}</span>
        </div>
      </label>

      <div>
        <p className="mb-2 font-medium">割引の対象</p>
        <div className="grid grid-cols-3 gap-2">
          {scopeLabels.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setScope(item.value)}
              className={`w-full rounded-md px-3 py-3 text-sm ${scope === item.value ? "bg-[#E2584B] text-white" : "bg-gray-200 text-gray-700"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="target_scope" value={scope} />

        {scope === "menu" && (
          <select
            name="target_menu_id"
            required
            defaultValue={coupon?.target_menu_id ?? ""}
            className="mt-3 w-full rounded-md border border-gray-300 p-3"
          >
            <option value="">メニューを選択</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </select>
        )}

        {scope === "category" && (
          <select
            name="target_category_id"
            required
            defaultValue={coupon?.target_category_id ?? ""}
            className="mt-3 w-full rounded-md border border-gray-300 p-3"
          >
            <option value="">カテゴリを選択</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <p className="mb-2 font-medium">クーポンコード（自動生成可能）</p>
        <div className="flex items-center gap-3">
          <input
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="空欄なら誰でも使える公開クーポン"
            className="min-w-0 flex-1 rounded-md border border-gray-300 p-3"
          />
          <button
            type="button"
            onClick={() => setCode(generateCouponCode())}
            className="shrink-0 rounded-md border border-gray-300 px-4 py-3"
          >
            再生成
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          コードを設定すると、入力して引き換えたお客様だけが使えるようになります。
        </p>
      </div>

      <div className="flex w-full gap-4">
        <Link
          href="/store_admin/coupons"
          className="flex flex-1 items-center justify-center rounded-full border border-zinc-300 py-3 text-center"
        >
          戻る
        </Link>
        <SubmitButton
          label={coupon ? "更新" : "クーポンを作成"}
          pendingLabel={coupon ? "更新中..." : "作成中..."}
        />
      </div>
    </form>
  );
}
