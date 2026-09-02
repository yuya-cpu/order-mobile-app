import { db} from "../../../../db";
import { menus } from "../../../../db/schema";
import { isNull } from "drizzle-orm";
import { toggleMenuAccepted } from "./actions";

export default async function MenusPage() {
    const rows = await db.select({
        id: menus.id,
        name: menus.name,
        description: menus.description,
        price: menus.price,
        image_url: menus.image_url,
        is_accepted: menus.is_accepted,
    })
    .from(menus).
    where(isNull(menus.deleted_at));

if (rows.length === 0) {
    return
}

return (
    <table className="w-full">
        <thead>
            <tr className="text-left">
                <th className="py-2 pl-16 pr-2">写真</th>
                <th className="py-2 pl-2 pr-4">商品名</th>
                <th className="px-4 py-2">説明</th>
                <th className="px-4 py-2">価格</th>
            </tr>
        </thead>
        <tbody>
            {rows.map((menu) => (
                <tr
                    key={menu.id}
                    className={
                        menu.is_accepted
                            ? "border-b border-zinc-200"
                            : "border-b border-zinc-200 bg-zinc-100 text-zinc-400"
                    }
                >
                <td className="py-2 pl-16 pr-2">
                <img src={menu.image_url}
                        alt={menu.name}
                        className="w-16 h-16 object-cover"
                    />
                </td>
                <td className="py-2 pl-2 pr-4">
                    <p>{menu.name}</p>
                    <span
                        className={
                            menu.is_accepted
                                ? "text-xs text-emerald-700"
                                : "text-xs text-zinc-500"
                        }
                    >
                        {menu.is_accepted ? "受付中" : "受付停止"}
                    </span>
                </td>
                <td className="px-4 py-2">
                    <p>{menu.description}</p>
                </td>
                <td>
                    <p>{menu.price}円</p>
                </td>
                <td>
                    <div className="flex items-center gap-2">
                        <form action={toggleMenuAccepted.bind(null, menu.id)}>
                            
                            <button
                                type="submit"
                                className={`inline-block rounded-full border px-4 py-1.5 text-sm ${
                                    menu.is_accepted
                                      ? "border-zinc-400 text-zinc-700"
                                      : "border-emerald-700 text-emerald-700"
                                  }`}
                            >
                                {menu.is_accepted ? "受付停止" : "受付再開"}
                            </button>
                        </form>
                        <a
                            href={`/store_admin/menus/${menu.id}/edit`}
                            className="inline-block rounded-full border border-[#E2584B] px-4 py-1.5 text-sm text-[#E2584B]"
                        >
                            編集
                        </a>
                    </div>
                </td>
                </tr>
            ))}
        </tbody>
    </table>
);

}
    