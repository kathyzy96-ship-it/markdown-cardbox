import { useEffect, type ReactNode } from 'react'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-[var(--hh-text)]/20 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-label="关闭菜单"
        tabIndex={open ? 0 : -1}
      />

      <div
        className={`absolute inset-y-0 left-0 w-[min(280px,88vw)] shadow-[var(--hh-shadow-lg)] transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
      >
        {children}
      </div>
    </div>
  )
}
