import { db} from "../../../db";
import { menus } from "../../../db/schema";
import {isNotNull} from "drizzle-orm";

export default async function MenusPage() {
    const rows = await db.select({
        id: menus.id,
        name: menus.name,
        description: menus.description,
        price: menus.price,
        image_url: menus.image_url,
    })
    .from(menus).
    where(isNotNull(menus.deleted_at));

if (rows.length === 0) {
    return
}

return (
    <table className="w-full">
        <thead>
            <tr className="text-left">
                <th className="px-4 py-2">写真</th>
                <th className="px-4 py-2">商品名</th>
                <th className="px-4 py-2">説明</th>
                <th className="px-4 py-2">価格</th>
            </tr>
        </thead>
        <tbody>
            {rows.map((menu) => (
                <tr key={menu.id}>
                <td>
                    <img src={menu.image_url}
                        alt={menu.name}
                        className="w-16 h-16 object-cover"
                    />
                </td>
                <td>
                    <p>{menu.name}</p>
                </td>
                <td>
                    <p>{menu.description}</p>
                </td>
                <td>
                    <p>{menu.price}円</p>
                </td>
                <td>
                    <a href={`/store_admin/menus/${menu.id}/edit`} 
                    className="text-blue-500 hover:text-blue-700">編集</a>
                </td>
                </tr>
            ))}
        </tbody>
    </table>
);

}
    