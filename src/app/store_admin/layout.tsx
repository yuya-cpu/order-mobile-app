import { AdminHeader } from "../../components/admin/header";
import { AdminFooter } from "../../components/admin/footer";

export default function AdminLayout ({ children }: LayoutProps<"/">) {
    return (
        <div className="flex min-h-screen flex-col bg-[#EFEBE3]">
            <AdminHeader />
            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            <AdminFooter />
        </div>
    );
}