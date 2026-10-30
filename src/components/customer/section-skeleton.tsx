import { customerFixedBarClass } from "@/components/customer/shell";

function LoadingNote() {
  return <span className="sr-only">読み込み中</span>;
}

export function MenuBrowseSkeleton() {
  return (
    <main className="mx-auto w-full max-w-lg px-4 py-8 pb-28" aria-busy="true">
      <div className="mx-auto mb-4 h-8 w-36 animate-pulse rounded-lg bg-zinc-200" />
      <div className="-mx-4 mb-4 h-10 animate-pulse bg-[#F7F3EC]" />
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-9 w-[4.75rem] animate-pulse rounded-full bg-zinc-200" />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index} className="rounded-2xl bg-[#EFEBE3] p-2">
            <div className="h-28 w-full animate-pulse rounded-xl bg-zinc-200" />
            <div className="mt-2.5 h-4 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="mt-1 h-5 w-14 animate-pulse rounded bg-zinc-200" />
          </li>
        ))}
      </ul>
      <div className={`${customerFixedBarClass} bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}>
        <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
      </div>
      <LoadingNote />
    </main>
  );
}

export function MenuDetailSkeleton() {
  return (
    <main className="mx-auto flex w-full flex-col px-4 py-6 pb-28" aria-busy="true">
      <div className="mb-4 h-48 w-full animate-pulse rounded-xl bg-zinc-200" />
      <div className="mx-auto mb-2 h-8 w-40 animate-pulse rounded-lg bg-zinc-200" />
      <div className="mx-auto mb-4 h-4 w-56 max-w-full animate-pulse rounded bg-zinc-100" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse rounded bg-zinc-100" />
        <div className="h-10 w-32 animate-pulse rounded-full bg-zinc-200" />
      </div>
      <div className="mt-6 h-4 w-24 animate-pulse rounded bg-zinc-200" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="h-[108px] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-50" />
        <div className="h-[108px] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-50" />
      </div>
      <div className={`${customerFixedBarClass} bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}>
        <div className="h-12 w-full animate-pulse rounded-full bg-zinc-200" />
      </div>
      <LoadingNote />
    </main>
  );
}

export function OrderTypeSkeleton() {
  return (
    <main className="flex flex-1 flex-col bg-[#FBF8F3] px-6" aria-busy="true">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-6 h-7 w-48 animate-pulse rounded-lg bg-zinc-200" />
        <div className="grid w-full grid-cols-2 gap-4">
          <div className="aspect-square animate-pulse rounded-2xl border border-[#E8DCC8] bg-[#F7F1E3]" />
          <div className="aspect-square animate-pulse rounded-2xl border border-[#E8DCC8] bg-[#F7F1E3]" />
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

export function GuestCountSkeleton() {
  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-10 px-4"
      aria-busy="true"
    >
      <div className="h-9 w-56 animate-pulse rounded-lg bg-zinc-200" />
      <div className="h-20 w-full animate-pulse rounded-2xl bg-zinc-100" />
      <div className="h-14 w-full animate-pulse rounded-full bg-zinc-200" />
      <LoadingNote />
    </main>
  );
}

export function CartSkeleton() {
  return (
    <main className="px-4 pb-32 pt-8" aria-busy="true">
      <div className="mx-auto mb-6 h-8 w-28 animate-pulse rounded-lg bg-zinc-200" />
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 2 }, (_, index) => (
          <li key={index} className="rounded-2xl bg-[#EFEBE3] p-3">
            <div className="flex items-start gap-3">
              <div className="size-14 shrink-0 animate-pulse rounded-full bg-zinc-200" />
              <div className="min-w-0 flex-1">
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
                <div className="mt-2 h-4 w-16 animate-pulse rounded bg-zinc-200" />
              </div>
              <div className="size-8 shrink-0 animate-pulse rounded-full bg-white" />
            </div>
            <div className="mt-3 h-10 w-36 animate-pulse rounded-full bg-white" />
          </li>
        ))}
      </ul>
      <div className="mt-8 h-4 w-28 animate-pulse rounded bg-zinc-200" />
      <div className="mt-2 h-12 animate-pulse rounded-xl bg-[#F4F1EA]" />
      <div className="mt-3 h-12 animate-pulse rounded-xl border border-zinc-200" />
      <div className="mt-8 flex flex-col gap-2 px-4">
        <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
        <div className="h-7 w-full animate-pulse rounded bg-zinc-100" />
      </div>
      <div className={`${customerFixedBarClass} bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}>
        <div className="flex gap-3">
          <div className="h-12 flex-[3] animate-pulse rounded-xl bg-zinc-100" />
          <div className="h-12 flex-[7] animate-pulse rounded-xl bg-zinc-200" />
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

export function PaymentSkeleton() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8" aria-busy="true">
      <div className="mx-auto h-8 w-40 animate-pulse rounded-lg bg-zinc-200" />
      <div className="mx-auto mt-4 h-6 w-24 animate-pulse rounded bg-zinc-200" />
      <div className="mt-8 h-36 animate-pulse rounded-xl bg-[#F4F1EA]" />
      <div className="mt-8 h-12 animate-pulse rounded-xl bg-zinc-200" />
      <LoadingNote />
    </main>
  );
}

export function CompleteSkeleton() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6" aria-busy="true">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200" />
      <div className="mt-6 h-4 w-20 animate-pulse rounded bg-zinc-100" />
      <div className="mt-4 h-12 w-24 animate-pulse rounded-lg bg-zinc-200" />
      <LoadingNote />
    </main>
  );
}

export function MypageSkeleton() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#FBF8F3] px-6 pb-10" aria-busy="true">
      <div className="absolute left-4 top-4 h-4 w-16 animate-pulse rounded bg-zinc-200" />
      <div className="mx-auto mt-20 w-full max-w-xs">
        <div className="mx-auto h-9 w-32 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mx-auto mt-10 h-4 w-24 animate-pulse rounded bg-zinc-200" />
        <div className="mx-auto mt-2 h-6 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="mt-8 h-14 animate-pulse rounded-xl bg-[#F4F1EA]" />
        <div className="my-8 h-px bg-zinc-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
        <div className="mt-4 h-14 animate-pulse border border-zinc-200 bg-white" />
        <div className="mt-3 h-14 animate-pulse border border-zinc-200 bg-white" />
      </div>
      <LoadingNote />
    </main>
  );
}

export function LoginSkeleton() {
  return (
    <main className="relative flex min-h-screen flex-col bg-white px-6" aria-busy="true">
      <div className="absolute left-4 top-4 h-4 w-16 animate-pulse rounded bg-zinc-200" />
      <div className="mx-auto flex w-full max-w-xs flex-1 flex-col items-center justify-center">
        <div className="h-9 w-32 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-8 h-5 w-40 animate-pulse rounded bg-zinc-100" />
        <div className="mt-10 h-14 w-full animate-pulse rounded-xl bg-zinc-200" />
        <div className="mt-6 h-4 w-24 animate-pulse rounded bg-zinc-100" />
      </div>
      <LoadingNote />
    </main>
  );
}

export function SignupSkeleton() {
  return (
    <main className="relative flex min-h-screen flex-col bg-white px-6" aria-busy="true">
      <div className="absolute left-4 top-4 h-4 w-16 animate-pulse rounded bg-zinc-200" />
      <div className="mx-auto flex w-full max-w-xs flex-1 flex-col items-center justify-center">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-4 h-4 w-56 animate-pulse rounded bg-zinc-100" />
        <div className="mt-8 h-5 w-40 animate-pulse rounded bg-zinc-100" />
        <div className="mt-10 h-14 w-full animate-pulse rounded-full bg-zinc-200" />
      </div>
      <LoadingNote />
    </main>
  );
}

export function HistoryListSkeleton() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#FBF8F3] px-6 pb-10" aria-busy="true">
      <div className="absolute left-4 top-4 h-4 w-16 animate-pulse rounded bg-zinc-200" />
      <div className="mx-auto mt-20 w-full max-w-xs">
        <div className="mx-auto h-9 w-32 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-8 flex flex-col gap-3">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="rounded-xl bg-white px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-14 animate-pulse rounded bg-zinc-100" />
              </div>
              <div className="mt-2 h-3 w-40 animate-pulse rounded bg-zinc-100" />
              <div className="mt-3 h-4 w-32 animate-pulse rounded bg-zinc-100" />
              <div className="mt-2 h-4 w-24 animate-pulse rounded bg-zinc-100" />
              <div className="ml-auto mt-3 h-5 w-16 animate-pulse rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

export function HistoryDetailSkeleton() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#FBF8F3] px-6 pb-10" aria-busy="true">
      <div className="absolute left-4 top-4 h-4 w-16 animate-pulse rounded bg-zinc-200" />
      <div className="mx-auto mt-20 w-full max-w-xs">
        <div className="mx-auto h-9 w-24 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mx-auto mt-3 h-4 w-48 animate-pulse rounded bg-zinc-100" />
        <div className="mt-8 rounded-xl bg-white px-4 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="ml-auto mt-3 h-5 w-16 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="mt-3 rounded-xl bg-white px-4 py-4">
          <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
          <div className="ml-auto mt-3 h-5 w-16 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="h-9 w-24 animate-pulse rounded-xl bg-zinc-200" />
          <div className="h-8 w-24 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
      <LoadingNote />
    </main>
  );
}

export function ResetPasswordSkeleton() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#F5F2EB] px-6" aria-busy="true">
      <div className="mx-auto flex w-full max-w-xs flex-1 flex-col justify-center">
        <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-10 h-4 w-20 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-12 animate-pulse rounded-xl bg-[#F4F1EA]" />
        <div className="mt-5 h-4 w-28 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-12 animate-pulse rounded-xl bg-[#F4F1EA]" />
        <div className="mt-8 h-12 animate-pulse rounded-full bg-zinc-200" />
        <div className="mx-auto mt-6 h-4 w-28 animate-pulse rounded bg-zinc-200" />
      </div>
      <LoadingNote />
    </main>
  );
}
