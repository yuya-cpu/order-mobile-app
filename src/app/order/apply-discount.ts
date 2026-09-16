export function applyDiscount(
    amount: number,
    coupon: { type: "percent" | "amount"; number: number } | null,
  ) {
    if (!coupon) return amount;
    if (coupon.type === "percent") {
      return Math.max(0, Math.floor((amount * (100 - coupon.number)) / 100));
    }
    return Math.max(0, amount - coupon.number);
  }