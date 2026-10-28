import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getCustomerSession } from "@/app/lib/customer-session";
import { listCustomerOrders } from "@/app/lib/customer-orders";
import { customerPath, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedText } from "@/i18n/localized";

function formatWhen(date: Date, lang: string) {
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function OrderHistoryDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const session = await getCustomerSession();
  if (!session) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#FBF8F3] px-6">
        <Link
          href={customerPath(lang, "/mypage")}
          className="absolute left-4 top-4 inline-flex items-center gap-0.5 text-sm text-[#E2584B]"
        >
          <ChevronLeft className="size-4" />
          {dict.common.back}
        </Link>
        <p className="text-center text-sm text-zinc-500">{dict.mypage.notLoggedIn}</p>
      </main>
    );
  }

  const [order] = await listCustomerOrders(session.user.id, id);
  if (!order) notFound();

  const status =
    order.status === "done"
      ? dict.history.statusDone
      : order.status === "cancel"
        ? dict.history.statusCancel
        : dict.history.statusProcessing;
  const place = order.orderType === "here" ? dict.orderType.here : dict.orderType.takeout;
  const money = lang === "en" ? "en-US" : "ja-JP";

  return (
    <main className="relative flex min-h-screen flex-col bg-[#FBF8F3] px-6 pb-10">
      <Link
        href={customerPath(lang, "/mypage/history")}
        className="absolute left-4 top-4 inline-flex items-center gap-0.5 text-sm text-[#E2584B]"
      >
        <ChevronLeft className="size-4" />
        {dict.common.back}
      </Link>
      <div className="mx-auto mt-20 w-full max-w-xs">
        <h1 className="text-center text-3xl font-bold text-zinc-900">#{order.orderNumber}</h1>
        <p className="mt-3 text-center text-sm text-zinc-400">
          {formatWhen(order.createdAt, lang)} / {place}
        </p>
        <p className="mt-1 text-center text-sm text-zinc-500">{status}</p>

        <ul className="mt-8 flex flex-col gap-3">
          {order.items.map((item) => (
            <li key={item.id} className="rounded-xl bg-white px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 font-bold text-zinc-900">
                  {localizedText(lang, item.name, item.nameEn) || dict.history.unknownItem}
                </p>
                <p className="shrink-0 text-sm text-zinc-500">
                  {dict.history.quantity.replace("{{n}}", String(item.quantity))}
                </p>
              </div>
              <p className="mt-1 text-right font-bold text-[#E2584B]">
                {item.price.toLocaleString(money)}
                {dict.common.yen}
              </p>
            </li>
          ))}
        </ul>

        {order.couponName ? (
          <div className="mt-4 rounded-xl bg-[#F4F1EA] px-4 py-3">
            <p className="text-xs text-zinc-500">{dict.history.coupon}</p>
            <p className="mt-1 font-bold text-[#E2584B]">
              {localizedText(lang, order.couponName, order.couponNameEn)}
              {order.couponNumber != null
                ? ` / ${
                    order.couponType === "percent"
                      ? `${order.couponNumber}% OFF`
                      : `-${order.couponNumber}${dict.common.yen}`
                  }`
                : ""}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4">
          <span className="text-sm font-bold text-zinc-800">{dict.history.total}</span>
          <span className="text-2xl font-bold text-[#E2584B]">
            {order.sumPrice.toLocaleString(money)}
            {dict.common.yen}
          </span>
        </div>
      </div>
    </main>
  );
}
