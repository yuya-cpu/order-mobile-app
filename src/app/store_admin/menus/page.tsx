import { db} from "../../../db";
import { menus } from "../../../db/schema";
import { isNull } from "drizzle-orm";

export default async function MenusPage() {
    const rows = await db.select({
        id: menus.id,
        name: menus.name,
        description: menus.description,
        price: menus.price,
        image_url: menus.image_url,
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
                <tr key={menu.id} className="border-b border-zinc-200">
                <td className="py-2 pl-16 pr-2">
                    <img src={menu.image_url}
                        alt={menu.name}
                        className="w-16 h-16 object-cover"
                    />
                </td>
                <td className="py-2 pl-2 pr-4">
                    <p>{menu.name}</p>
                </td>
                <td className="px-4 py-2">
                    <p>{menu.description}</p>
                </td>
                <td>
                    <p>{menu.price}円</p>
                </td>
                <td>
                    <a
                        href={`/store_admin/menus/${menu.id}/edit`}
                        className="inline-block rounded-full border border-[#E2584B] px-4 py-1.5 text-sm text-[#E2584B]"
                    >
                        編集
                    </a>
                </td>
                </tr>
            ))}
        </tbody>
    </table>
);

}
    