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
        <main className="px-4 py-8 sm:px-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">顧客管理一覧</h1>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                <div className="min-w-[720px]">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="py-2 pl-4 pr-2">顧客ID</th>
                            <th className="px-4 py-2">名前</th>
                            <th className="px-4 py-2">連絡先</th>
                            <th className="px-4 py-2">登録日</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-zinc-500" colSpan={4}>
                                    データがありません
                                </td>
                            </tr>
                        ) : (
                            list.map((row) => (
                                <tr key={row.id} className="border-b border-zinc-200 last:border-b-0">
                                    <td className="py-2 pl-4 pr-2">
                                        C-{row.id.slice(0, 4).toUpperCase()}
                                    </td>
                                    <td className="px-4 py-2">{row.name}</td>
                                    <td className="px-4 py-2">{row.email}</td>
                                    <td className="px-4 py-2">{formatDate(row.createdAt)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </main>

    );
}
