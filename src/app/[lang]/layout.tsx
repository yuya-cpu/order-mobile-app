import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { CustomerShell } from "@/components/customer/shell";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }
  return <CustomerShell>{children}</CustomerShell>;
}
