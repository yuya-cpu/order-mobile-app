import { redirect } from "next/navigation";
import { CustomerHeader } from "@/components/customer/header";
import { getCustomerSession } from "@/app/lib/customer-session";
import { customerPath } from "@/i18n/config";

export default async function OrderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await getCustomerSession();
  if (!session) {
    redirect(customerPath(lang, "/login"));
  }

  return (
    <>
      <CustomerHeader />
      {children}
    </>
  );
}
