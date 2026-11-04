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
      <div className="mb-6 flex w-full flex-col gap-4 rounded-2xl bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="h-6 w-64 max-w-full animate-pulse rounded bg-zinc-200" />
          <div className="mt-1 h-5 w-72 max-w-full animate-pulse rounded bg-zinc-100" />
        </div>
        <div>
          <div className="h-5 w-20 animate-pulse rounded bg-zinc-100" />
          <div className="mt-0 h-9 w-16 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
      <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="w-full rounded-2xl bg-white px-5 py-8 sm:px-6 sm:py-14">
            <div className="h-7 w-32 animate-pulse rounded bg-zinc-200" />
            <div className="mt-2 h-5 w-48 max-w-full animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>
      <div className="grid w-full grid-cols-1 gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2 sm:gap-6 sm:p-5">
        <div className="h-[52px] animate-pulse rounded-xl bg-zinc-100" />
        <div className="h-[52px] animate-pulse rounded-xl bg-zinc-100" />
      </div>
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
    <tr className="border-b border-zinc-200 last:border-b-0">
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
      <td className="px-4 py-2 text-right">
        <span className="inline-block animate-pulse rounded-xl border border-zinc-200 px-4 py-1.5 text-sm text-transparent">
          受付停止
        </span>
        <span className="ml-2 inline-block animate-pulse rounded-xl border border-zinc-200 px-4 py-1.5 text-sm text-transparent">
          編集
        </span>
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
                <th className="px-4 py-2 text-right">操作</th>
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

function CouponSkeletonRow() {
  return (
    <tr className="border-b border-zinc-200 last:border-b-0">
      <td className="py-2 pl-4 pr-2">
        <span className="block h-4 w-32 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-4 py-2">
        <span className="block h-4 w-24 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-4 py-2">
        <span className="inline-block h-7 w-[84px] animate-pulse rounded-md bg-zinc-200" />
      </td>
      <td className="px-4 py-2">
        <span className="block h-4 w-28 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-4 py-2 text-right">
        <span className="inline-block animate-pulse rounded-xl border border-zinc-200 px-4 py-1.5 text-sm text-transparent">
          編集
        </span>
      </td>
    </tr>
  );
}

export function CouponListSkeleton() {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <PageTitle width="w-72" />
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[720px]">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 pl-4 pr-2">クーポン名</th>
                <th className="px-4 py-2">対象</th>
                <th className="px-4 py-2">割引</th>
                <th className="px-4 py-2">コード</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              <CouponSkeletonRow />
              <CouponSkeletonRow />
            </tbody>
          </table>
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

function OrderSkeletonRow({ actionText }: { actionText: string }) {
  return (
    <tr className="border-b border-zinc-200 last:border-b-0">
      <td className="py-2 pl-4 pr-2">
        <span className="inline-block h-7 w-[86px] animate-pulse rounded-full bg-zinc-200" />
      </td>
      <td className="px-4 py-2">
        <span className="inline-block h-4 w-12 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-4 py-2">
        <span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-4 py-2">
        <span className="inline-block h-4 w-14 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-4 py-2">
        <span className="inline-block h-4 w-8 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-4 py-2 text-right">
        <span className="inline-block animate-pulse rounded-xl border border-zinc-200 px-4 py-1.5 text-sm text-transparent">
          {actionText}
        </span>
      </td>
    </tr>
  );
}

export function OrderTableSkeleton({
  actionLabel = "操作",
  actionText = "ステータスの変更",
  filter = false,
}: {
  actionLabel?: string;
  actionText?: string;
  filter?: boolean;
}) {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-zinc-300" />
        {filter ? (
          <div className="animate-pulse rounded-xl border border-zinc-200 px-4 py-1.5 text-sm text-transparent">
            調理中のみ
          </div>
        ) : null}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[720px]">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 pl-4 pr-2">ステータス</th>
                <th className="px-4 py-2">注文番号</th>
                <th className="px-4 py-2">商品名</th>
                <th className="px-4 py-2">注文時間</th>
                <th className="px-4 py-2">個数</th>
                <th className="px-4 py-2 text-right">{actionLabel}</th>
              </tr>
            </thead>
            <tbody>
              <OrderSkeletonRow actionText={actionText} />
              <OrderSkeletonRow actionText={actionText} />
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
    <tr className="border-b border-zinc-200 last:border-b-0">
      <td className="py-2 pl-4 pr-2">
        <span className="inline-block h-4 w-14 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-4 py-2">
        <span className="inline-block h-4 w-16 animate-pulse rounded bg-zinc-200" />
      </td>
      <td className="px-4 py-2">
        <span className="inline-block h-4 w-56 animate-pulse rounded bg-zinc-100" />
      </td>
      <td className="px-4 py-2">
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

export function MenuFormSkeleton({ height = 841 }: { height?: number }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8" aria-busy="true">
      <div
        className="w-full max-w-2xl animate-pulse rounded-2xl bg-white shadow-sm"
        style={{ height }}
      />
      <LoadingNote />
    </div>
  );
}

export function CouponFormSkeleton({ centered = true }: { centered?: boolean }) {
  return (
    <div
      className={`flex flex-1 px-4 py-8 sm:px-8 ${centered ? "items-center justify-center" : "flex-col items-center"}`}
      aria-busy="true"
    >
      <div className="h-[777px] w-full max-w-3xl animate-pulse rounded-2xl bg-white" />
      <LoadingNote />
    </div>
  );
}
