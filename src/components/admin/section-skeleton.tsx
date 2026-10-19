function LoadingNote() {
  return <span className="sr-only">読み込み中</span>;
}

function PageTitle({ width }: { width: string }) {
  return <div className={`mb-6 h-8 animate-pulse rounded-lg bg-zinc-300 ${width}`} />;
}

export function HomePageSkeleton() {
  return (
    <main
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-8"
      aria-busy="true"
    >
      <div className="mb-6 h-[96px] w-full animate-pulse rounded-2xl bg-white" />
      <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-28 w-full animate-pulse rounded-2xl bg-white sm:h-[168px]"
          />
        ))}
      </div>
      <div className="h-[92px] w-full animate-pulse rounded-2xl bg-white" />
      <LoadingNote />
    </main>
  );
}

function MenuSkeletonRow() {
  return (
    <div className="flex h-[81px] items-center border-b border-zinc-200 last:border-b-0">
      <div className="py-2 pl-4 pr-2">
        <div className="h-16 w-16 animate-pulse rounded-md bg-zinc-200" />
      </div>
      <div className="flex w-40 flex-col gap-2 py-2 pl-2 pr-4">
        <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-12 animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="w-56 px-4">
        <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="w-24 px-4">
        <div className="h-4 w-14 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="flex gap-2 px-4">
        <div className="h-8 w-20 animate-pulse rounded-xl bg-zinc-100" />
        <div className="h-8 w-14 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    </div>
  );
}

export function MenuListSkeleton() {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <PageTitle width="w-40" />
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[720px]">
          <div className="flex h-10 items-center text-sm text-zinc-400">
            <span className="w-[88px] py-2 pl-4 pr-2">写真</span>
            <span className="w-40 py-2 pl-2 pr-4">商品名</span>
            <span className="w-56 px-4 py-2">説明</span>
            <span className="w-24 px-4 py-2">価格</span>
            <span className="px-4 py-2">操作</span>
          </div>
          <MenuSkeletonRow />
          <MenuSkeletonRow />
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

function CouponSkeletonCard() {
  return (
    <div className="h-[210px] rounded-2xl bg-white p-5">
      <div className="mb-2 h-7 w-24 animate-pulse rounded-md bg-zinc-200" />
      <div className="h-6 w-48 animate-pulse rounded bg-zinc-200" />
      <div className="mt-3 h-4 w-40 animate-pulse rounded bg-zinc-100" />
      <div className="mt-1 h-4 w-36 animate-pulse rounded bg-zinc-100" />
      <div className="mt-4 flex justify-end">
        <div className="h-8 w-16 animate-pulse rounded-xl border border-zinc-200 bg-white" />
      </div>
    </div>
  );
}

export function CouponListSkeleton() {
  return (
    <div className="px-4 py-8 sm:px-8" aria-busy="true">
      <PageTitle width="w-72" />
      <div className="flex flex-col gap-4">
        <CouponSkeletonCard />
        <CouponSkeletonCard />
      </div>
      <LoadingNote />
    </div>
  );
}

export function OrderTableSkeleton() {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <PageTitle width="w-40" />
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex h-[45px] items-center border-b border-zinc-200 text-sm text-zinc-400">
          <span className="w-[16%] px-3">ステータス</span>
          <span className="w-[14%] px-3">注文番号</span>
          <span className="w-[22%] px-3">商品名</span>
          <span className="w-[14%] px-3">注文時間</span>
          <span className="w-[12%] px-3">個数</span>
          <span className="w-[22%] px-3">操作</span>
        </div>
        <div className="flex h-[59px] items-center border-b border-zinc-100">
          <span className="w-[16%] px-3"><span className="inline-block h-6 w-16 animate-pulse rounded-full bg-zinc-200" /></span>
          <span className="w-[14%] px-3"><span className="inline-block h-4 w-12 animate-pulse rounded bg-zinc-200" /></span>
          <span className="w-[22%] px-3"><span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-100" /></span>
          <span className="w-[14%] px-3"><span className="inline-block h-4 w-14 animate-pulse rounded bg-zinc-100" /></span>
          <span className="w-[12%] px-3"><span className="inline-block h-4 w-8 animate-pulse rounded bg-zinc-200" /></span>
          <span className="w-[22%] px-3"><span className="inline-block h-8 w-28 animate-pulse rounded-xl bg-zinc-100" /></span>
        </div>
        <div className="flex h-[59px] items-center">
          <span className="w-[16%] px-3"><span className="inline-block h-6 w-16 animate-pulse rounded-full bg-zinc-200" /></span>
          <span className="w-[14%] px-3"><span className="inline-block h-4 w-12 animate-pulse rounded bg-zinc-200" /></span>
          <span className="w-[22%] px-3"><span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-100" /></span>
          <span className="w-[14%] px-3"><span className="inline-block h-4 w-14 animate-pulse rounded bg-zinc-100" /></span>
          <span className="w-[12%] px-3"><span className="inline-block h-4 w-8 animate-pulse rounded bg-zinc-200" /></span>
          <span className="w-[22%] px-3"><span className="inline-block h-8 w-28 animate-pulse rounded-xl bg-zinc-100" /></span>
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

export function MenuFormSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8" aria-busy="true">
      <div className="h-[841px] w-full max-w-2xl animate-pulse rounded-2xl bg-white shadow-sm" />
      <LoadingNote />
    </div>
  );
}

export function CouponFormSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8" aria-busy="true">
      <div className="h-[826px] w-full max-w-3xl animate-pulse rounded-2xl bg-white" />
      <LoadingNote />
    </div>
  );
}
