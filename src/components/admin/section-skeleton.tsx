export function AdminSectionSkeleton() {
  return (
    <div className="flex flex-1 flex-col px-4 py-8 sm:px-8" aria-busy="true">
      <div className="mb-6 h-8 w-40 animate-pulse rounded-lg bg-zinc-300" />
      <div className="mb-4 h-36 animate-pulse rounded-2xl bg-white shadow-sm" />
      <div className="h-36 animate-pulse rounded-2xl bg-white shadow-sm" />
      <span className="sr-only">読み込み中</span>
    </div>
  );
}
