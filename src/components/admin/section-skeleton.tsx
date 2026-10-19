function LoadingNote() {
  return <span className="sr-only">読み込み中</span>;
}

export function HomePageSkeleton() {
  return (
    <main
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8"
      aria-busy="true"
    >
      <div className="mb-6 h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
      <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-white shadow-sm sm:h-36"
          />
        ))}
      </div>
      <div className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
      <LoadingNote />
    </main>
  );
}

export function TablePageSkeleton() {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <div className="mb-6 h-8 w-40 animate-pulse rounded-lg bg-zinc-300" />
      <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
      <LoadingNote />
    </main>
  );
}

export function FormPageSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className="flex flex-1 items-center justify-center px-4 py-8"
      aria-busy="true"
    >
      <div
        className={`h-[28rem] w-full animate-pulse rounded-2xl bg-white shadow-sm ${wide ? "max-w-3xl" : "max-w-2xl"}`}
      />
      <LoadingNote />
    </div>
  );
}

export function CardListSkeleton() {
  return (
    <div className="px-4 py-8 sm:px-8" aria-busy="true">
      <div className="mb-6 h-8 w-64 animate-pulse rounded-lg bg-zinc-300" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
      <LoadingNote />
    </div>
  );
}

export function HistoryDetailSkeleton() {
  return (
    <main className="px-4 py-8 sm:px-8" aria-busy="true">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
        <div className="h-40 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
      <LoadingNote />
    </main>
  );
}

export function PasswordPageSkeleton() {
  return (
    <div
      className="flex flex-1 items-center justify-center px-4 py-12"
      aria-busy="true"
    >
      <div className="h-80 w-full max-w-lg animate-pulse rounded-3xl bg-white shadow-sm" />
      <LoadingNote />
    </div>
  );
}
