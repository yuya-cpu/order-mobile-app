"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuantityButtons } from "./quantity-buttons";
import type { SetOption } from "./get-set-options";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";
import { customerFixedBarClass } from "@/components/customer/shell";

type Cartitem = {
  id: string;
  cartId?: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  option_detail_ids?: string[];
  choices?: { optionName: string; itemName: string }[];
};

function initialSelected(options: SetOption[]) {
  const selected: Record<string, string> = {};
  for (const option of options) {
    if (option.items[0]) {
      selected[option.id] = option.items[0].id;
    }
  }
  return selected;
}

function isChoosable(option: SetOption) {
  if (option.items.length === 0) return false;
  if (option.name === "ドリンク") return true;
  return option.items.length > 1;
}

export function AddToCart(props: {
  storageKey: string;
  cartPath: string;
  id: string;
  name: string;
  price: number;
  image_url: string;
  options?: SetOption[];
}) {
  const options = props.options ?? [];
  const choosable = options.filter(isChoosable);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    initialSelected(options),
  );
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const dict = useDictionary();
  const ready = options.every((option) => selected[option.id]);

  function add() {
    if (!ready) return;
    const raw = localStorage.getItem(props.storageKey);
    const items: Cartitem[] = raw ? JSON.parse(raw) : [];
    const option_detail_ids = options.map((option) => selected[option.id]);
    const cartId = options.length
      ? `${props.id}:${option_detail_ids.join(",")}`
      : props.id;
    const choices = options.map((option) => {
      const item = option.items.find((choice) => choice.id === selected[option.id]);
      return {
        optionName: option.name,
        itemName: item?.name ?? "",
      };
    });

    const i = items.findIndex((item) => (item.cartId ?? item.id) === cartId);
    if (i >= 0) {
      items[i].quantity = quantity;
      items[i].price = props.price;
      items[i].image_url = props.image_url;
      items[i].name = props.name;
    } else {
      items.push({
        id: props.id,
        cartId,
        name: props.name,
        price: props.price,
        quantity,
        image_url: props.image_url,
        option_detail_ids,
        choices,
      });
    }
    localStorage.setItem(props.storageKey, JSON.stringify(items));
    router.push(customerPath(lang, props.cartPath));
  }

  return (
    <div className="w-full">
      <div className="flex w-full flex-row items-center justify-between">
        <span className="text-sm text-zinc-500">{dict.detail.priceInTax}</span>
        <QuantityButtons price={props.price} quantity={quantity} onChange={setQuantity} />
      </div>

      {options.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold">{dict.detail.setContents}</h2>
          <ul className="mt-2 space-y-1 text-sm text-zinc-700">
            {options.map((option) => (
              <li key={option.id}>
                ・
                {isChoosable(option)
                  ? option.name
                  : (option.items[0]?.name ?? option.name)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {choosable.map((option) => (
        <section key={option.id} className="mt-6">
          <h2 className="mb-3 text-sm font-bold">{option.name}</h2>
          <div className="grid grid-cols-2 gap-3">
            {option.items.map((item) => {
              const on = selected[option.id] === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelected((current) => ({ ...current, [option.id]: item.id }))
                  }
                  className={`relative flex min-h-[108px] flex-col rounded-2xl border bg-white p-3 text-left ${
                    on ? "border-[#E2584B]" : "border-zinc-200"
                  }`}
                >
                  <span className="pr-6 text-sm font-bold">{item.name}</span>
                  {item.description ? (
                    <p className="mt-1 pr-6 text-xs text-zinc-500">{item.description}</p>
                  ) : null}
                  <span
                    className={`absolute bottom-3 right-3 flex size-4 items-center justify-center rounded-full border ${
                      on ? "border-[#E2584B]" : "border-zinc-300"
                    }`}
                  >
                    {on ? <span className="size-2 rounded-full bg-[#E2584B]" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className={`${customerFixedBarClass} bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}>
        <button
          type="button"
          onClick={add}
          disabled={!ready}
          className="w-full rounded-full bg-[#E2584B] py-3 text-white disabled:opacity-50"
        >
          {dict.detail.addToCart}
        </button>
      </div>
    </div>
  );
}
