"use client";

import { useFormStatus } from "react-dom";

export function PendingSubmitButton({
  idleLabel,
  pendingLabel = "処理中...",
  className,
  disabled = false,
}: {
  idleLabel: string;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={[className, pending ? "opacity-50" : null].filter(Boolean).join(" ")}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
