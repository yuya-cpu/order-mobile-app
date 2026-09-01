"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminTabs, isTabActive } from "./store_admin-nav";

export function AdminFooter() {
    const pathname = usePathname();

    return (
        <footer className="flex shrink-0 items-center justify-between p-4">
            <nav className="flex flex-wrap items-center gap-2">
                {adminTabs.map((tab) => {
                    const active = isTabActive(pathname, tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={
                                active
                                    ? "rounded-full bg-[#E2584B] px-4 py-2 text-sm font-medium text-white"
                                    : "rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700"
                            }
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </footer>
    );
}