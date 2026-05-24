import { useCallback, useState } from 'react'
import type { ToastState, ToastVariant } from '@/components/ui/Toast'

export function useAppToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  const dismissToast = useCallback(() => setToast(null), [])

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    setToast({ message, variant })
  }, [])

  return { toast, dismissToast, showToast }
}
