export default function AdminLayout({ children }: LayoutProps<"/store_admin">) {
    return (
      <div className="flex min-h-screen flex-col bg-[#EFEBE3]">
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    );
  }