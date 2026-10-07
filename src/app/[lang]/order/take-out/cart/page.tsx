"use client";

import { OrderCartPage } from "../../cart-page";

export default function CartPage() {
  return (
    <OrderCartPage
      storageKey="cart"
      menuPath="/order/take-out"
      orderType="take-out"
    />
  );
}
