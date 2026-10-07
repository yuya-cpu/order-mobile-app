"use client";

import { OrderCartPage } from "../../cart-page";

export default function CartPage() {
  return (
    <OrderCartPage
      storageKey="here-cart"
      menuPath="/order/here"
      orderType="here"
    />
  );
}
