export function AdminHeader() {
    return (
        <header className="flex items-center justify-between p-4">
            <div className="flex items-center gap-5">
                <div className="text-lg font-bold text-zinc-900">Hello World
                </div>
            </div>
            <button type="button" className="text-zinc-900 hover:text-zinc-600">
                ログアウト
            </button>
        </header>
    );
}
