import Link from "next/link";
import { Upload } from "lucide-react";
import { notFound } from "next/navigation";
import { getCustomerSession } from "@/app/lib/customer-session";
import { listCustomerOrders, type CustomerOrder } from "@/app/lib/customer-orders";
import { CustomerBackButton } from "@/components/customer/back-button";
import { customerPath, isLocale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { localizedText } from "@/i18n/localized";

function formatDate(date: Date, lang: string) {
  const parts = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  if (lang === "en") {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }
  return `${value("year")}年${Number(value("month"))}月${Number(value("day"))}日`;
}

function statusLabel(status: string, dict: Dictionary) {
  if (status === "done") return dict.history.statusDone;
  if (status === "cancel") return dict.history.statusCancel;
  return dict.history.statusProcessing;
}

function statusClass(status: string) {
  if (status === "done") return "bg-[#E7F6EC] text-[#3CAA6A]";
  if (status === "cancel") return "bg-zinc-100 text-zinc-500";
  return "bg-[#FDECDC] text-[#E39A4B]";
}

function itemSummary(order: CustomerOrder, lang: string, dict: Dictionary) {
  const separator = lang === "en" ? ", " : "、";
  return order.items
    .map((item) => {
      const name = localizedText(lang, item.name, item.nameEn) || dict.history.unknownItem;
      return `${name} x${item.quantity}`;
    })
    .join(separator);
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
        <CustomerBackButton fallback="/mypage" />
        <p className="text-center text-sm text-zinc-500">{dict.mypage.notLoggedIn}</p>
      </main>
    );
  }

  const history = await listCustomerOrders(session.user.id);

  return (
    <main className="relative min-h-screen bg-[#FBF8F3] px-4 pb-10 pt-14">
      <CustomerBackButton fallback="/mypage" />
      <h1 className="text-2xl font-bold text-zinc-900">{dict.history.title}</h1>
      {history.length === 0 ? (
        <p className="mt-10 text-center text-sm text-zinc-500">{dict.history.empty}</p>
      ) : (
        <ul className="mt-5 flex flex-col gap-4">
          {history.map((order) => {
            const money = order.sumPrice.toLocaleString(lang === "en" ? "en-US" : "ja-JP");
            return (
              <li key={order.id} className="rounded-2xl border border-zinc-200 bg-white px-4 py-4">
                <Link href={customerPath(lang, `/mypage/history/${order.id}`)} className="block">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-zinc-900">{formatDate(order.createdAt, lang)}</p>
                    <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${statusClass(order.status)}`}>
                      {statusLabel(order.status, dict)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">
                    {dict.history.callNumber}: {order.orderNumber}
                  </p>
                  <hr className="my-3 border-zinc-200" />
                  <p className="text-sm leading-6 text-zinc-800">{itemSummary(order, lang, dict)}</p>
                </Link>
                <hr className="my-3 border-zinc-200" />
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-zinc-900">
                    {dict.history.total} {money}
                    {dict.common.yen}
                  </p>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#F3D0C6] bg-white px-3 py-2 text-sm font-medium text-[#E2584B]"
                  >
                    <Upload className="size-4" />
                    {dict.history.receipt}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
