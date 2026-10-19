import { Suspense } from "react";
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
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center pb-40 text-lg font-medium text-zinc-900">
          読み込み中
        </div>
      }
    >
    <div className="flex min-h-0 flex-1 flex-col pb-40">{children}</div>
    </Suspense>
    <AdminFooter />
    </>
  );
}