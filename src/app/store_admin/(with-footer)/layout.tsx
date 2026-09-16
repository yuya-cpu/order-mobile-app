import { AdminFooter } from "@/components/admin/footer";

export default function AdminWithFooterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex min-h-0 flex-1 flex-col pb-40">{children}</div>
            <AdminFooter />
        </>
    );
}
