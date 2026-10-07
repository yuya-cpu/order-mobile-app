"use client";

import { AddToCart as SharedAddToCart } from "../../add-to-cart";
import type { SetOption } from "../../get-set-options";

export function AddToCart(props: {
  id: string;
  name: string;
  price: number;
  image_url: string;
  options?: SetOption[];
}) {
  return (
    <SharedAddToCart
      storageKey="cart"
      cartPath="/order/take-out/cart"
      {...props}
    />
  );
}
