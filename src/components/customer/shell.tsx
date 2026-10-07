export const customerFixedBarClass =
  "fixed bottom-0 left-1/2 z-10 w-full max-w-[430px] -translate-x-1/2";

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#E8E0D4]">
      <div className="mx-auto flex min-h-full w-full max-w-[430px] flex-1 flex-col bg-white">
        {children}
      </div>
    </div>
  );
}
