import { AlertCircle, CheckCircle2, X } from 'lucide-react'

export type ToastVariant = 'success' | 'error'

export interface ToastState {
  message: string
  variant: ToastVariant
}

interface ToastProps {
  toast: ToastState
  onDismiss: () => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const isSuccess = toast.variant === 'success'

  return (
    <div
      role="status"
      className="pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border border-[var(--hh-border)] bg-[var(--hh-surface)] px-4 py-3 shadow-[var(--hh-shadow-md)]"
    >
      {isSuccess ? (
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hh-coral)]"
          strokeWidth={1.5}
        />
      ) : (
        <AlertCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
          strokeWidth={1.5}
        />
      )}
      <p className="flex-1 text-sm leading-relaxed tracking-tight text-[var(--hh-text-muted)]">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-[var(--hh-text-muted)] transition-colors ease-in-out hover:bg-[var(--hh-mauve)]"
        aria-label="关闭提示"
      >
        <X className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
