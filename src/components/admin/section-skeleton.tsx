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

function ColumnGroup({ widths }: { widths: number[] }) {
  return (
    <colgroup>
      {widths.map((width, index) => (
        <col key={index} style={{ width: `${(width / 1856) * 100}%` }} />
      ))}
    </colgroup>
  );
}

function MenuSkeletonRow() {
  return (
    <tr className="border-b border-zinc-200">
      <td className="py-2 pl-4 pr-2">
        <span className="block h-16 w-16 animate-pulse rounded-md bg-zinc-200" />
      </td>
      <td className="py-2 pl-2 pr-4">
        <span className="block h-4 w-28 animate-pulse rounded bg-zinc-200" />
        <span className="mt-2 block h-3 w-12 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-4 py-2">
        <span className="block h-4 w-64 max-w-full animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="py-2">
        <span className="block h-4 w-14 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="py-2">
        <span className="inline-block h-[34px] w-[88px] animate-pulse rounded-xl bg-zinc-100" />
        <span className="ml-2 inline-block h-[34px] w-[62px] animate-pulse rounded-xl bg-zinc-100" />
      </td>
    </tr>
  );
}

export function MenuListSkeleton() {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <PageTitle width="w-40" />
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[720px]">
          <table className="w-full table-fixed text-left">
            <ColumnGroup widths={[203, 387, 750, 147, 369]} />
            <thead>
              <tr>
                <th className="py-2 pl-4 pr-2">写真</th>
                <th className="py-2 pl-2 pr-4">商品名</th>
                <th className="px-4 py-2">説明</th>
                <th className="px-4 py-2">価格</th>
                <th className="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <MenuSkeletonRow />
              <MenuSkeletonRow />
            </tbody>
          </table>
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

function CouponSkeletonCard() {
  return (
    <div className="h-[210px] rounded-2xl bg-white p-5">
      <div className="mb-2 h-7 w-[84px] animate-pulse rounded-md bg-zinc-200" />
      <div className="h-7 w-32 animate-pulse rounded bg-zinc-200" />
      <div className="mt-3 flex gap-2">
        <span className="h-5 w-7 animate-pulse rounded bg-zinc-100" />
        <span className="h-5 w-24 animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="mt-1 flex gap-2">
        <span className="h-5 w-[42px] animate-pulse rounded bg-zinc-100" />
        <span className="h-5 w-[107px] animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="mt-4 flex justify-end">
        <span className="h-[34px] w-[62px] animate-pulse rounded-xl bg-zinc-100" />
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

function OrderSkeletonRow({ actionWidth }: { actionWidth: string }) {
  return (
    <tr className="border-b border-zinc-100">
      <td className="px-3 py-3">
        <span className="inline-block h-7 w-[86px] animate-pulse rounded-full bg-zinc-200" />
      </td>
      <td className="px-3 py-3">
        <span className="inline-block h-4 w-12 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-3 py-3">
        <span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-3 py-3">
        <span className="inline-block h-4 w-14 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-3 py-3">
        <span className="inline-block h-4 w-8 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-3 py-3">
        <span className={`inline-block h-[34px] animate-pulse rounded-xl bg-zinc-100 ${actionWidth}`} />
      </td>
    </tr>
  );
}

export function OrderTableSkeleton({
  actionLabel = "操作",
  actionWidth = "w-[146px]",
  filter = false,
}: {
  actionLabel?: string;
  actionWidth?: string;
  filter?: boolean;
}) {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-zinc-300" />
        {filter ? <div className="h-[34px] w-24 animate-pulse rounded-xl bg-zinc-200" /> : null}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[720px]">
          <table className="w-full table-fixed text-center">
            <ColumnGroup widths={[203, 148, 726, 148, 223, 408]} />
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="px-3 py-3 text-sm font-medium">ステータス</th>
                <th className="px-3 py-3 text-sm font-medium">注文番号</th>
                <th className="px-3 py-3 text-sm font-medium">商品名</th>
                <th className="px-3 py-3 text-sm font-medium">注文時間</th>
                <th className="px-3 py-3 text-sm font-medium">個数</th>
                <th className="px-3 py-3 text-sm font-medium">{actionLabel}</th>
              </tr>
            </thead>
            <tbody>
              <OrderSkeletonRow actionWidth={actionWidth} />
              <OrderSkeletonRow actionWidth={actionWidth} />
            </tbody>
          </table>
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

function CustomerSkeletonRow() {
  return (
    <tr className="border-b border-zinc-100">
      <td className="px-3 py-3">
        <span className="inline-block h-4 w-14 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-3 py-3">
        <span className="inline-block h-4 w-16 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-3 py-3">
        <span className="inline-block h-4 w-56 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-3 py-3">
        <span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-200" />
      </td>
    </tr>
  );
}

export function CustomerTableSkeleton() {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <PageTitle width="w-40" />
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[720px]">
          <table className="w-full table-fixed text-center">
            <ColumnGroup widths={[184, 364, 1074, 234]} />
            <thead>
              <tr className="border-b border-zinc-200 bg-[#F2EBE1]">
                <th className="px-3 py-3 text-sm font-medium text-zinc-700">顧客ID</th>
                <th className="px-3 py-3 text-sm font-medium text-zinc-700">名前</th>
                <th className="px-3 py-3 text-sm font-medium text-zinc-700">連絡先</th>
                <th className="px-3 py-3 text-sm font-medium text-zinc-700">登録日</th>
              </tr>
            </thead>
            <tbody>
              <CustomerSkeletonRow />
              <CustomerSkeletonRow />
            </tbody>
          </table>
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
