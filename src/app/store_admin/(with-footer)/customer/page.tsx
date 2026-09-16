import { db } from "@/db";
import { user } from "@/db/customer-auth-schema";
import { desc } from "drizzle-orm";

function formatDate(date: Date) {
    return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export default async function CustomerPage() {
    const list = await db.select(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        } )
        .from(user)
        .orderBy(desc(user.createdAt));

    return (
        <main className="px-8 py-8">
            <div className="mb-8 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">顧客管理一覧</h1>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full table-fixed text-center">
                    <thead>
                        <tr className="border-b border-zinc-200 bg-[#F2EBE1]">
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">顧客ID</th>
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">名前</th>
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">連絡先</th>
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">登録日</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td className="px-3 py-6 text-zinc-500" colSpan={4}>
                                    データがありません
                                </td>
                            </tr>
                        ) : (
                            list.map((row) => (
                                <tr key={row.id} className="border-b border-zinc-100">
                                    <td className="px-3 py-3">
                                        C-{row.id.slice(0, 4).toUpperCase()}
                                    </td>
                                    <td className="px-3 py-3">{row.name}</td>
                                    <td className="px-3 py-3">{row.email}</td>
                                    <td className="px-3 py-3">{formatDate(row.createdAt)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>

    );
}
