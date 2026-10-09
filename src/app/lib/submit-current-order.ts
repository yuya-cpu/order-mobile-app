type CartItem = { id: string; quantity: number };

export async function submitCurrentOrder(): Promise<
  { ok: true; orderNumber: string } | { ok: false; error?: string }
> {
  const last = sessionStorage.getItem("last-order-number") ?? "";
  const key = sessionStorage.getItem("orderType") === "here" ? "here-cart" : "cart";
  const raw = localStorage.getItem(key);
  const cart: CartItem[] = raw ? JSON.parse(raw) : [];
  const items = cart.filter((item) => item.id && item.quantity > 0);

  if (items.length === 0) {
    return last ? { ok: true, orderNumber: last } : { ok: false };
  }

  const orderType = sessionStorage.getItem("orderType") === "here" ? "here" : "take-out";
  const guestCount = Number(sessionStorage.getItem("guestCount") ?? "1");
  let res: Response;
  try {
    res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        paymentFlowId: sessionStorage.getItem("paymentFlowId") ?? "",
        orderType,
        customerNumber: orderType === "here" ? guestCount : 1,
        discountId: sessionStorage.getItem("discountId") ?? "",
      }),
    });
  } catch {
    return { ok: false };
  }

  let data: { error?: string; order_number?: string };
  try {
    data = await res.json();
  } catch {
    return { ok: false };
  }
  if (!res.ok) {
    return { ok: false, error: typeof data.error === "string" ? data.error : undefined };
  }

  const orderNumber = String(data.order_number ?? "");
  if (!orderNumber) {
    return { ok: false };
  }

  sessionStorage.setItem("last-order-number", orderNumber);
  sessionStorage.removeItem("discountId");
  localStorage.removeItem(key);
  return { ok: true, orderNumber };
}
