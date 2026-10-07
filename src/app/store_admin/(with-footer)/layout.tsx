import { redirect } from "next/navigation";
import { AdminFooter } from "@/components/admin/footer";
import { AdminHeader } from "@/components/admin/header";
import { getStoreAdmin } from "@/app/lib/store-admin";

export default async function AdminWithFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStoreAdmin();
  if (!session) {
    redirect("/store_admin");
  }

  return (
    <>
       <AdminHeader />
    <div className="flex min-h-0 flex-1 flex-col pb-40">{children}</div>
    <AdminFooter />
    </>
  );
}