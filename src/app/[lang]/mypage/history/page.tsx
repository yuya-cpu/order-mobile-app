import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

export default async function OrderHistoryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
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

  const history = await listCustomerOrders(session.user.id);

  return (
    <main className="relative flex min-h-screen flex-col bg-[#FBF8F3] px-6 pb-10">
      <Link
        href={customerPath(lang, "/mypage")}
        className="absolute left-4 top-4 inline-flex items-center gap-0.5 text-sm text-[#E2584B]"
      >
        <ChevronLeft className="size-4" />
        {dict.common.back}
      </Link>
      <div className="mx-auto mt-20 w-full max-w-xs">
        <h1 className="text-center text-3xl font-bold text-zinc-900">{dict.history.title}</h1>
        {history.length === 0 ? (
          <p className="mt-10 text-center text-sm text-zinc-500">{dict.history.empty}</p>
        ) : (
          <ul className="mt-8 flex flex-col gap-3">
            {history.map((order) => {
              const status =
                order.status === "done"
                  ? dict.history.statusDone
                  : order.status === "cancel"
                    ? dict.history.statusCancel
                    : dict.history.statusProcessing;
              const place =
                order.orderType === "here" ? dict.orderType.here : dict.orderType.takeout;
              return (
                <li key={order.id}>
                  <Link
                    href={customerPath(lang, `/mypage/history/${order.id}`)}
                    className="block rounded-xl bg-white px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-zinc-900">#{order.orderNumber}</p>
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        {status}
                        <ChevronRight className="size-4 text-zinc-400" />
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatWhen(order.createdAt, lang)} / {place}
                    </p>
                    <ul className="mt-3 flex flex-col gap-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-3 text-sm text-zinc-700">
                          <span className="min-w-0 truncate">
                            {localizedText(lang, item.name, item.nameEn) || dict.history.unknownItem}
                          </span>
                          <span className="shrink-0">
                            {dict.history.quantity.replace("{{n}}", String(item.quantity))}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-right font-bold text-[#E2584B]">
                      {order.sumPrice.toLocaleString(lang === "en" ? "en-US" : "ja-JP")}
                      {dict.common.yen}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
