export type DiscountCoupon = {
    type: "percent" | "amount";
    number: number;
    target_menu_id?: string | null;
    target_category_id?: string | null;
};

export type DiscountLine = {
    menu_id: string;
    category_id?: string | null;
    price: number;
    quantity: number;
};

export type DiscountResult = {
    subtotal: number;
    discount: number;
    total: number;
    /** 対象商品がカートにあるか。false なら割引額は必ず 0 になる。 */
    hasTarget: boolean;
};

function isTargetLine(line: DiscountLine, coupon: DiscountCoupon) {
    if (coupon.target_menu_id) return line.menu_id === coupon.target_menu_id;
    if (coupon.target_category_id) return line.category_id === coupon.target_category_id;
    return true;
}

export function calculateDiscount(
    lines: DiscountLine[],
    coupon: DiscountCoupon | null,
): DiscountResult {
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    if (!coupon) {
        return { subtotal, discount: 0, total: subtotal, hasTarget: true };
    }

    let targetSubtotal = 0;
    let targetQuantity = 0;
    for (const line of lines) {
        if (!isTargetLine(line, coupon)) continue;
        targetSubtotal += line.price * line.quantity;
        targetQuantity += line.quantity;
    }

    // percent は従来どおり割引後の金額を切り捨てる。amount は対象商品の個数ぶん引く。
    const raw =
        coupon.type === "percent"
            ? targetSubtotal - Math.floor((targetSubtotal * (100 - coupon.number)) / 100)
            : coupon.number * targetQuantity;
    const discount = Math.min(Math.max(0, raw), targetSubtotal);

    return {
        subtotal,
        discount,
        total: subtotal - discount,
        hasTarget: targetQuantity > 0,
    };
}
