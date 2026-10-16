"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { adminTabs, isTabActive } from "./store_admin-nav";

function TabLabel({ label }: { label: string }) {
    const { pending } = useLinkStatus();
    return <span aria-busy={pending}>{pending ? "移動中..." : label}</span>;
}

export function AdminFooter() {
    const pathname = usePathname();

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-10 border-t bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <nav className="flex flex-nowrap items-center gap-2 overflow-x-auto">
                {adminTabs.map((tab) => {
                    const active = isTabActive(pathname, tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={
                                active
                                    ? "shrink-0 whitespace-nowrap rounded-xl bg-[#E2584B] px-4 py-2 text-sm font-medium text-white"
                                    : "shrink-0 whitespace-nowrap rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700"
                            }
                        >
                            <TabLabel label={tab.label} />
                        </Link>
                    );
                })}
            </nav>
        </footer>
    );
}
