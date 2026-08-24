export const adminTabs = [
    { href: "/menus", label: "Menus"},
    { href: "/menus/new", label: "New Menu"},
    { href: "/coupons", label: "Coupons"},
    { href: "/coupons/new", label: "New Coupon"},
    { href: "history", label: "History"},
] 

export function isTabActive(pathname: string, href: string) {
    return pathname === href;
}