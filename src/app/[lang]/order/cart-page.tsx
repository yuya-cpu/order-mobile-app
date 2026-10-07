"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ticket, Trash2 } from "lucide-react";
import { QuantityButtons } from "./quantity-buttons";
import { calculateDiscount, type DiscountLine } from "@/app/lib/apply-discount";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";
import { localizedText } from "@/i18n/localized";
import { withCurrentMenuImages } from "@/app/lib/cart-menu-images";
import { MenuPhoto } from "@/app/lib/menu-image";
import { customerFixedBarClass } from "@/components/customer/shell";

type Coupon = {
  id: string;
  name: string;
  name_en?: string | null;
  type: "percent" | "amount";
  number: number;
  target_menu_id?: string | null;
  target_menu_name?: string | null;
  target_menu_name_en?: string | null;
  target_category_id?: string | null;
  target_category_name?: string | null;
};

type CartItem = {
  id: string;
  cartId?: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  category_id?: string | null;
  choices?: { optionName: string; itemName: string }[];
};

export function OrderCartPage({
  storageKey,
  menuPath,
  orderType,
}: {
  storageKey: string;
  menuPath: string;
  orderType: "here" | "take-out";
}) {
  const { lang } = useParams<{ lang: string }>();
  const dict = useDictionary();
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discountId, setDiscountId] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [draftDiscountId, setDraftDiscountId] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const [redeemDone, setRedeemDone] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    const parsed: CartItem[] = raw ? JSON.parse(raw) : [];
    setItems(parsed);
    setDiscountId(sessionStorage.getItem("discountId") ?? "");
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(Array.isArray(data) ? data : data.coupons ?? []));
    void withCurrentMenuImages(parsed).then((next) => {
      setItems(next);
    });
  }, [storageKey]);

  function lineId(item: CartItem) {
    return item.cartId ?? item.id;
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((currentItems) => {
      if (!currentItems) return currentItems;
      const newItems = currentItems.map((item) =>
        lineId(item) === id ? { ...item, quantity } : item,
      );
      localStorage.setItem(storageKey, JSON.stringify(newItems));
      return newItems;
    });
  }

  function deleteItem(id: string) {
    setItems((currentItems) => {
      if (!currentItems) return currentItems;
      const newItems = currentItems.filter((item) => lineId(item) !== id);
      localStorage.setItem(storageKey, JSON.stringify(newItems));
      return newItems;
    });
  }

  function openCouponModal() {
    setDraftDiscountId(discountId);
    setCodeInput("");
    setRedeemError("");
    setRedeemDone(false);
    setCouponOpen(true);
  }

  function redeemErrorMessage(code: unknown) {
    switch (code) {
      case "emptyCode":
        return dict.cart.couponCodeEmpty;
      case "notFound":
        return dict.cart.couponCodeNotFound;
      case "expired":
        return dict.cart.couponCodeExpired;
      case "alreadyOwned":
        return dict.cart.couponCodeAlreadyOwned;
      case "notLoggedIn":
        return dict.cart.couponCodeNotLoggedIn;
      default:
        return dict.cart.couponCodeFailed;
    }
  }

  async function redeemCode() {
    const code = codeInput.trim();
    setRedeemDone(false);
    if (!code) {
      setRedeemError(dict.cart.couponCodeEmpty);
      return;
    }

    setRedeeming(true);
    setRedeemError("");
    try {
      const res = await fetch("/api/coupons/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRedeemError(redeemErrorMessage(data.error));
        return;
      }

      // 引き換え直後は対象メニュー名などを含んだ一覧を取り直す。
      const listRes = await fetch("/api/coupons");
      const list = await listRes.json();
      setCoupons(Array.isArray(list) ? list : []);
      setDraftDiscountId(String(data.coupon?.id ?? ""));
      setCodeInput("");
      setRedeemDone(true);
    } catch {
      setRedeemError(dict.cart.couponCodeFailed);
    } finally {
      setRedeeming(false);
    }
  }

  function couponTargetLabel(coupon: Coupon) {
    if (coupon.target_menu_name) {
      return dict.cart.couponTargetMenu.replace(
        "{{name}}",
        localizedText(String(lang), coupon.target_menu_name, coupon.target_menu_name_en),
      );
    }
    if (coupon.target_category_name) {
      return dict.cart.couponTargetCategory.replace("{{name}}", coupon.target_category_name);
    }
    return dict.cart.couponTargetAll;
  }

  function confirmCoupon() {
    setDiscountId(draftDiscountId);
    setCouponOpen(false);
  }

  const selectedCoupon = coupons.find((coupon) => coupon.id === discountId) ?? null;
  const draftCoupon = coupons.find((coupon) => coupon.id === draftDiscountId) ?? null;
  const discountLines: DiscountLine[] = (items ?? []).map((item) => ({
    menu_id: item.id,
    category_id: item.category_id ?? null,
    price: item.price,
    quantity: item.quantity,
  }));
  const { subtotal, discount, total } = calculateDiscount(discountLines, selectedCoupon);
  const checkoutBlocked = subtotal > 0 && total <= 0;

  if (!items) {
    return (
      <main className="px-4 py-16">
        <div>{dict.common.loading}</div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="px-4 py-16">
        <h1 className="mb-4 text-center text-2xl font-bold">{dict.cart.title}</h1>
        <p className="mb-4 text-sm text-gray-500">{dict.cart.empty}</p>
        <Link
          href={customerPath(lang, menuPath)}
          className="block w-full rounded-xl bg-[#E2584B] py-3 text-center text-white"
        >
          {dict.cart.backToMenu}
        </Link>
      </main>
    );
  }

  return (
    <main className="px-4 pb-32 pt-8">
      <h1 className="mb-6 text-center text-2xl font-bold">{dict.cart.title}</h1>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={lineId(item)} className="rounded-2xl bg-[#EFEBE3] p-3">
            <div className="flex items-start gap-3">
              <MenuPhoto
                url={item.image_url}
                alt={item.name}
                className="size-14 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-bold">{item.name}</h2>
                <p className="text-sm font-bold text-[#E2584B]">
                  {item.price}
                  {dict.common.yen}
                </p>
                {item.choices && item.choices.length > 0 && (
                  <p className="truncate text-xs text-gray-500">
                    {item.choices.map((choice) => `${choice.optionName}:${choice.itemName}`).join(" / ")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm text-zinc-600">
                  {dict.cart.quantity.replace("{{n}}", String(item.quantity))}
                </span>
                <button
                  type="button"
                  onClick={() => deleteItem(lineId(item))}
                  className="flex size-8 items-center justify-center rounded-full bg-white text-[#E2584B]"
                  aria-label={dict.cart.delete}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-3">
              <QuantityButtons
                price={item.price}
                quantity={item.quantity}
                showPrice={false}
                grouped
                onChange={(quantity) => updateQuantity(lineId(item), quantity)}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <p className="mb-2 text-sm font-bold">{dict.cart.appliedCoupon}</p>
        <div className="rounded-xl bg-[#E8A317] px-4 py-3 font-bold text-black">
          {selectedCoupon
            ? localizedText(String(lang), selectedCoupon.name, selectedCoupon.name_en)
            : dict.cart.noCoupon}
        </div>
        <button
          type="button"
          onClick={openCouponModal}
          className="mt-3 w-full rounded-xl border border-zinc-300 bg-white py-3 text-center font-bold"
        >
          {dict.cart.selectCoupon}
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-2 px-4">
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <span>{dict.cart.subtotal}</span>
          <span>
            {subtotal} {dict.common.yen}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm font-bold text-[#E8A317]">
            <span>{dict.cart.discount}</span>
            <span>
              -{discount} {dict.common.yen}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
          <span className="text-xl font-bold">{dict.cart.total}</span>
          <span className="text-2xl font-bold text-[#E2584B]">
            {total} {dict.common.yen}
          </span>
        </div>
        {checkoutBlocked && (
          <p className="mt-1 text-sm text-red-600">{dict.cart.zeroTotal}</p>
        )}
      </div>

      <div className={`${customerFixedBarClass} bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}>
        <div className="flex gap-3">
          <Link
            href={customerPath(lang, menuPath)}
            className="flex-[3] rounded-xl border border-zinc-300 py-3 text-center"
          >
            {dict.common.back}
          </Link>
          {checkoutBlocked ? (
            <span
              aria-disabled="true"
              className="flex h-12 flex-[7] items-center justify-center rounded-xl bg-[#E2584B] text-center text-white opacity-50"
            >
              {dict.cart.checkout}
            </span>
          ) : (
            <Link
              href={customerPath(lang, "/order/take-out/select-payment")}
              onClick={() => {
                sessionStorage.setItem("orderType", orderType);
                sessionStorage.setItem("discountId", discountId);
              }}
              className="flex h-12 flex-[7] items-center justify-center rounded-xl bg-[#E2584B] text-center text-white"
            >
              {dict.cart.checkout}
            </Link>
          )}
        </div>
      </div>

      {couponOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setCouponOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold">{dict.cart.selectCoupon}</h2>
            <p className="mt-1 text-sm text-zinc-500">{dict.cart.couponHelp}</p>

            <div className="mt-4 border-t border-zinc-200 pt-4">
              <p className="mb-2 text-sm font-bold">{dict.cart.couponCodeLabel}</p>
              <div className="flex items-center gap-2">
                <input
                  value={codeInput}
                  onChange={(event) => {
                    setCodeInput(event.target.value);
                    setRedeemError("");
                    setRedeemDone(false);
                  }}
                  placeholder={dict.cart.couponCodePlaceholder}
                  autoCapitalize="characters"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-300 px-3 py-2.5 uppercase outline-none placeholder:normal-case"
                />
                <button
                  type="button"
                  onClick={redeemCode}
                  disabled={redeeming}
                  className="shrink-0 rounded-xl bg-[#E2584B] px-4 py-2.5 text-sm text-white disabled:opacity-50"
                >
                  {redeeming ? dict.cart.couponCodeAdding : dict.cart.couponCodeAdd}
                </button>
              </div>
              {redeemError && <p className="mt-2 text-sm text-red-600">{redeemError}</p>}
              {redeemDone && (
                <p className="mt-2 text-sm text-[#E8A317]">{dict.cart.couponCodeAdded}</p>
              )}
            </div>

            <p className="mt-4 text-sm font-bold">{dict.cart.availableCoupons}</p>
            <ul className="mt-3 flex max-h-60 flex-col gap-3 overflow-y-auto">
              <li>
                <button
                  type="button"
                  onClick={() => setDraftDiscountId("")}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left ${
                    draftDiscountId === "" ? "border-[#E2584B]" : "border-zinc-200"
                  }`}
                >
                  <Ticket className="size-5 shrink-0 text-[#E2584B]" />
                  <span className="min-w-0 flex-1 text-sm font-medium">{dict.cart.noCoupon}</span>
                  {draftDiscountId === "" ? (
                    <span className="shrink-0 rounded-full bg-[#E2584B] px-2 py-0.5 text-xs text-white">
                      {dict.cart.selectedBadge}
                    </span>
                  ) : null}
                </button>
              </li>
              {coupons.map((coupon) => {
                const on = draftDiscountId === coupon.id;
                const preview = calculateDiscount(discountLines, coupon);
                return (
                  <li key={coupon.id}>
                    <button
                      type="button"
                      disabled={!preview.hasTarget}
                      onClick={() => setDraftDiscountId(coupon.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left disabled:opacity-50 ${
                        on ? "border-[#E2584B]" : "border-zinc-200"
                      }`}
                    >
                      <Ticket className="size-5 shrink-0 text-[#E2584B]" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">
                          {localizedText(String(lang), coupon.name, coupon.name_en)}
                        </span>
                        <span className="block truncate text-xs text-zinc-500">
                          {couponTargetLabel(coupon)}
                        </span>
                        {preview.hasTarget ? (
                          <span className="block text-xs text-[#E8A317]">
                            -{preview.discount} {dict.common.yen}
                          </span>
                        ) : (
                          <span className="block text-xs text-zinc-400">
                            {dict.cart.couponNoTarget}
                          </span>
                        )}
                      </span>
                      {on ? (
                        <span className="shrink-0 rounded-full bg-[#E2584B] px-2 py-0.5 text-xs text-white">
                          {dict.cart.selectedBadge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
              <span className="text-sm font-bold">{dict.cart.total}</span>
              <span className="text-xl font-bold text-[#E2584B]">
                {calculateDiscount(discountLines, draftCoupon).total} {dict.common.yen}
              </span>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setCouponOpen(false)}
                className="flex-1 rounded-xl border border-zinc-300 py-3"
              >
                {dict.cart.cancel}
              </button>
              <button
                type="button"
                onClick={confirmCoupon}
                className="flex-[2] rounded-xl bg-[#E2584B] py-3 text-white"
              >
                {dict.cart.confirmCoupon}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
