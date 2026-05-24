import { ClipboardPaste, Menu } from 'lucide-react'

interface MobileHeaderProps {
  onMenuOpen: () => void
  onPasteNew: () => void
  isPasting?: boolean
}

export function MobileHeader({
  onMenuOpen,
  onPasteNew,
  isPasting = false,
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[var(--hh-border)] bg-[var(--hh-surface)] px-4 shadow-[var(--hh-shadow-sm)] md:hidden">
      <button
        type="button"
        onClick={onMenuOpen}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--hh-text)] transition-colors hover:bg-[var(--hh-mauve)]"
        aria-label="打开菜单"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <span className="text-[15px] font-semibold tracking-tight text-[var(--hh-text)]">
        Cardbox
      </span>

      <button
        type="button"
        onClick={onPasteNew}
        disabled={isPasting}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--hh-paste-btn)] text-[var(--hh-on-coral)] transition-colors hover:brightness-95 disabled:opacity-50"
        aria-label="一键粘贴 / 新建"
      >
        <ClipboardPaste
          className={`h-4 w-4 ${isPasting ? 'animate-pulse' : ''}`}
          strokeWidth={1.5}
        />
      </button>
    </header>
  )
}
