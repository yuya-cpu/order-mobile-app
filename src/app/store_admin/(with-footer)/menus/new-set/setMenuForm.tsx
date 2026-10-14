"use client";

import { useState } from "react";
import { createSetMenu } from "../actions";
import { MenuSubmitButton } from "../submit-button";
import { MenuImageInput } from "../image-input";

type SingleMenu = {
  id: string;
  name: string;
  price: number;
  category_name: string;
};

type Category = {
  id: string;
  name: string;
};

type Option = {
  category_id: string;
  name: string;
  items: { menus_id: string }[];
};

export function SetMenuForm({
  items,
  categories,
}: {
  items: SingleMenu[];
  categories: Category[];
}) {
  const [options, setOptions] = useState<Option[]>([
    { category_id: categories[0]?.id ?? "", name: categories[0]?.name ?? "", items: [] },
    { category_id: categories[1]?.id ?? "", name: categories[1]?.name ?? "", items: [] },
  ]);

  function updateCategory(index: number, categoryId: string) {
    const category = categories.find((row) => row.id === categoryId);
    setOptions((current) =>
      current.map((option, i) => {
        if (i !== index) return option;
        return {
          category_id: categoryId,
          name: category?.name ?? "",
          items: option.items.filter((item) =>
            items.some(
              (menu) =>
                menu.id === item.menus_id &&
                (!menu.category_name || menu.category_name === category?.name),
            ),
          ),
        };
      }),
    );
  }

  function toggleItem(index: number, menusId: string) {
    setOptions((current) =>
      current.map((option, i) => {
        if (i !== index) return option;
        const exists = option.items.some((item) => item.menus_id === menusId);
        return {
          ...option,
          items: exists
            ? option.items.filter((item) => item.menus_id !== menusId)
            : [...option.items, { menus_id: menusId }],
        };
      }),
    );
  }

  const fieldClass =
    "w-full rounded-full border border-zinc-200 bg-white px-5 py-3 outline-none placeholder:text-zinc-400";
  const areaClass =
    "w-full rounded-2xl border border-zinc-200 bg-white px-5 py-3 outline-none placeholder:text-zinc-400";
  const labelClass = "flex w-full flex-col gap-2 text-sm text-zinc-800";

  return (
    <form
      action={createSetMenu}
      className="flex w-full max-w-2xl flex-col gap-6"
    >
      <h1 className="text-center text-2xl font-bold">新しいセットの登録</h1>
      <div className="grid w-full grid-cols-2 gap-3">
        <a
          href="/store_admin/menus/new"
          className="rounded-full bg-[#F4F1EA] py-3 text-center text-zinc-700"
        >
          単品
        </a>
        <span className="rounded-full bg-[#E2584B] py-3 text-center text-white">
          セット
        </span>
      </div>
      <input type="hidden" name="options" value={JSON.stringify(options)} />
      <MenuImageInput required />
      <label className={labelClass}>
        商品名
        <input
          name="name"
          required
          placeholder="例: ハンバーガーセット"
          className={fieldClass}
        />
      </label>
      <label className={labelClass}>
        英語名
        <input name="name_en" placeholder="English name" className={fieldClass} />
      </label>
      <label className={labelClass}>
        価格（税込）
        <div className="flex items-center gap-3">
          <input name="price" required placeholder="例: 500" className={fieldClass} />
          <span className="shrink-0 text-zinc-700">円</span>
        </div>
      </label>
      <label className={labelClass}>
        説明
        <textarea
          name="description"
          required
          placeholder="商品の特徴やアレルギーを入力"
          className={areaClass}
        />
      </label>
      <label className={labelClass}>
        英語説明
        <textarea name="description_en" placeholder="Description" className={areaClass} />
      </label>

      {options.map((option, index) => {
        const matched = items.filter(
          (item) => item.category_name === option.name,
        );
        const categoryItems = matched.length > 0 ? matched : items;
        return (
        <div key={index} className="flex w-full flex-col gap-2">
          <label className={labelClass}>
            カテゴリー
            <select
              value={option.category_id}
              onChange={(e) => updateCategory(index, e.target.value)}
              className={fieldClass}
            >
              <option value="">選択してください</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          {option.category_id && (
            <>
          <p className="font-medium">候補</p>
          {categoryItems.length === 0 && (
            <p className="text-sm text-gray-500">このカテゴリーの単品がありません</p>
          )}
          {categoryItems.map((item) => {
            const selected = option.items.find(
              (choice) => choice.menus_id === item.id,
            );
            return (
              <label
                key={item.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => toggleItem(index, item.id)}
                  className="size-4 accent-[#E2584B]"
                />
                {item.name}
              </label>
            );
          })}
            </>
          )}
        </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          setOptions((current) => [
            ...current,
            { category_id: "", name: "", items: [] },
          ])
        }
        className="w-full rounded-full border border-zinc-400 py-2 text-sm"
      >
        枠を追加
      </button>

      <div className="flex w-full gap-3 pt-2">
        <a
          href="/store_admin/menus"
          className="flex flex-1 items-center justify-center rounded-full bg-white py-4 text-zinc-800"
        >
          戻る
        </a>
        <MenuSubmitButton idleLabel="セット登録" />
      </div>
    </form>
  );
}
