export const adminTabs = [
    { href: "/store_admin/menus", label: "メニュー一覧"},
    { href: "/store_admin/menus/new", label: "メニュー登録"},
    { href: "/store_admin/coupons", label: "クーポン一覧"},
    { href: "/store_admin/coupons/new", label: "クーポン作成"},
    { href: "/store_admin/history", label: "注文履歴"},
] 

export function isTabActive(pathname: string, href: string) {
    return pathname === href;
}