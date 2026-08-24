"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminTabs, isTabActive } from "./store_admin-nav";

export function AdminFooter() {
    const pathname = usePathname();
   
    return (
        <footer className="flex shrink-0 items-center justify-between p-4">
            <nav className="flex items-center gap-5">
                {adminTabs.map((tab) => {
                    const active = isTabActive(pathname, tab.href);
                    return (
                        <Link key={tab.href} href={tab.href} 
                        className={`text-sm font-medium text-zinc-900 hover:text-zinc-600
                             ${active ? "text-zinc-900" : "text-zinc-500"}`}>
                                {tab.label}
                             </Link>
                    );
                })}
            </nav>
        </footer>
    );
}