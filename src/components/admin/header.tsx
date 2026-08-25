export function AdminHeader() {
    return (
        <header className="mt-6 flex items-center justify-between border-y border-zinc-300 bg-white px-4 py-4">
            <div className="flex items-center gap-5">
                <div className="text-2xl font-bold text-zinc-900">Hello World
                </div>
            </div>
            <button type="button" className="text-lg text-zinc-900 hover:text-zinc-600">
                ログアウト
            </button>
        </header>
    );
}
