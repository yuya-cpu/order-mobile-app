"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuantityButtons } from "./quantityButtons";
import type { SetOption } from "../../get-set-options";

const KEY = "here-cart";

type Cartitem = {
    id: string;
    cartId?: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
    option_detail_ids?: string[];
    choices?: { optionName: string; itemName: string }[];
}

function initialSelected(options: SetOption[]) {
    const selected: Record<string, string> = {};
    for (const option of options) {
        if (option.items.length === 1) {
            selected[option.id] = option.items[0].id;
        }
    }
    return selected;
}

export function AddToCart(props : {
    id: string;
    name: string;
    price: number;
    image_url: string;
    options?: SetOption[];
}) {
    const options = props.options ?? [];
    const [quantity, setQuantity] = useState(1);
    const [selected, setSelected] = useState<Record<string, string>>(() =>
        initialSelected(options),
    );
    const router = useRouter();
    const ready = options.every((option) => selected[option.id]);

function add() {
    if (!ready) return;
    const raw = localStorage.getItem(KEY);
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
    localStorage.setItem(KEY, JSON.stringify(items));
    router.push("/order/here/cart");
}

return (    
    <div className="w-full">
      {options.map((option) => (
        <div key={option.id} className="mb-4 flex w-full flex-col gap-2">
          <p className="font-medium">{option.name}</p>
          {option.items.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={option.id}
                  checked={selected[option.id] === item.id}
                  onChange={() =>
                    setSelected((current) => ({ ...current, [option.id]: item.id }))
                  }
                  className="size-4 accent-[#E2584B]"
                />
                {item.name}
            </label>
          ))}
        </div>
      ))}
      <div className="flex w-full flex-row justify-between">
        <span>税込み価格</span>
        <QuantityButtons price={props.price} quantity={quantity} onChange={setQuantity} />
      </div>
      <button
        type="button"
        onClick={add}
        disabled={!ready}
        className="mt-6 w-full rounded-full bg-[#E2584B] py-2 text-white disabled:opacity-50"
      >
        カートに追加
      </button>
      </div>
  );
}
