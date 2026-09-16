"use client";

import { useState } from "react";
import { createSetMenu } from "../actions";

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

  return (
    <form
      action={createSetMenu}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4"
    >
      <h1 className="text-center font-bold text-2xl">新しいセットの登録</h1>
      <div className="grid w-full grid-cols-2 gap-4">
        <a
          href="/store_admin/menus/new"
          className="w-full rounded-md px-4 py-3 text-center bg-gray-200 text-gray-700"
        >
          単品
        </a>
        <span className="w-full rounded-md px-4 py-3 text-center bg-[#E2584B] text-white">
          セット
        </span>
      </div>
      <input type="hidden" name="options" value={JSON.stringify(options)} />
      <label className="flex w-full flex-col gap-1 font-medium">
        画像
        <input
          name="image"
          type="file"
          accept="image/*"
          required
          className="border border-gray-300 rounded-md p-2"
        />
      </label>
      <label className="flex w-full flex-col gap-1 font-medium">
        商品名
        <input
          name="name"
          required
          className="border border-gray-300 rounded-md p-2"
        />
      </label>
      <label className="flex w-full flex-col gap-1 font-medium">
        価格（税込）
        <input
          name="price"
          required
          className="border border-gray-300 rounded-md p-2"
        />
      </label>
      <label className="flex w-full flex-col gap-1 font-medium">
        説明
        <textarea
          name="description"
          required
          className="border border-gray-300 rounded-md p-2"
        />
      </label>

      {options.map((option, index) => {
        const matched = items.filter(
          (item) => item.category_name === option.name,
        );
        const categoryItems = matched.length > 0 ? matched : items;
        return (
        <div key={index} className="flex w-full flex-col gap-2">
          <label className="flex w-full flex-col gap-1 font-medium">
            カテゴリー
            <select
              value={option.category_id}
              onChange={(e) => updateCategory(index, e.target.value)}
              className="border border-gray-300 rounded-md p-2"
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

      <div className="flex w-full gap-3">
        <a
          href="/store_admin/menus"
          className="flex flex-1 items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700"
        >
          一覧に戻る
        </a>
        <button
          type="submit"
          className="flex flex-1 items-center justify-center rounded-full bg-[#E2584B] px-4 py-2 text-sm text-white"
        >
          セット登録
        </button>
      </div>
    </form>
  );
}
