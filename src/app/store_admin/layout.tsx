import { AdminHeader } from "../../components/admin/header";
import { AdminFooter } from "../../components/admin/footer";

export default function AdminLayout ({ children }: LayoutProps<"/">) {
    return (
        <div className="flex flex-col min-h-screen">
            <AdminHeader />
            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            <AdminFooter />
        </div>
    );
}