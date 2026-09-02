import { db } from "@/db";
import { users } from "@/db/schema";
import { isNull, desc } from "drizzle-orm";
import { StatusModal } from "./status-modal";


const shopId = "11111111-1111-1111-1111-111111111111";

const defaultCustomers = [
  {
    id: "77777777-7777-7777-7777-777777777771",
    name: "山田 太郎",
    email: "taro.yamada@example.com",
    password: "demo", // notNull なので必須
    line_id: null as string | null,
    is_accepted: true,
    shop_id: shopId,
  },
  {
    id: "77777777-7777-7777-7777-777777777772",
    name: "LINEユーザー",
    email: null as string | null,
    password: "demo",
    line_id: "U_demo_line_001",
    is_accepted: false,
    shop_id: shopId,
  },
];

function CustomerStatus(is_accepted: boolean) {
    return is_accepted ? "アクティブ" : "バン";
}

function statusColor(is_accepted: boolean) {
    return is_accepted ? "bg-emerald-600 text-white" : "bg-zinc-600 text-white";
}

function contactLabel(user: {
    email: string | null;
    line_id: string | null;
  }) {
    if (user.email) return user.email;
    if (user.line_id) return `LINE: ${user.line_id}`;
    return "—";
  }

function formatDate(date: Date) {
    return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export default async function CustomerPage() {
    const existing = await db.select({ id: users.id }).from(users);
    const missing = defaultCustomers.filter(
      (c) => !existing.some((row) => row.id === c.id),
    );
    if (missing.length > 0) {
      await db.insert(users).values(missing);
    }
    const list = await db.select(
        {
            id: users.id,
            name: users.name,
            email: users.email,
            line_id: users.line_id,
            created_at: users.created_at,
            is_accepted: users.is_accepted,
        } )
        .from(users)
        .where(isNull(users.deleted_at))
        .orderBy(desc(users.created_at));

    return (
        <main className="px-8 py-8">
            <div className="mb-8 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">顧客管理一覧</h1>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full table-fixed text-center">
                    <thead>
                        <tr className="border-b border-zinc-200 bg-[#F2EBE1]">
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">ステータス</th>
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">顧客ID</th>
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">名前</th>
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">連絡先</th>
                            <th className="px-3 py-3 text-sm font-medium text-zinc-700">登録日</th>
                            <th className="w-[14%] px-3 py-3 text-sm font-medium text-zinc-700"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td className="px-3 py-6 text-zinc-500" colSpan={6}>
                                    データがありません
                                </td>
                            </tr>
                        ) : (
                            list.map((user) => (
                                <tr key={user.id} className="border-b border-zinc-100">
                                    <td className="px-3 py-3">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-sm text-white ${statusColor(user.is_accepted)}`}
                                        >
                                            {CustomerStatus(user.is_accepted)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        C-{user.id.slice(0, 4).toUpperCase()}
                                    </td>
                                    <td className="px-3 py-3">{user.name}</td>
                                    <td className="px-3 py-3">{contactLabel(user)}</td>
                                    <td className="px-3 py-3">{formatDate(user.created_at)}</td>
                                    <td className="px-3 py-3">
                                        <StatusModal
                                            userId={user.id}
                                            name={user.name}
                                            contact={contactLabel(user)}
                                            isAccepted={user.is_accepted}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>

    );
}
