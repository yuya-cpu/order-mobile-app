import { AdminFooter } from "@/components/admin/footer";

export default function AdminWithFooterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <AdminFooter />
        </>
    );
}
