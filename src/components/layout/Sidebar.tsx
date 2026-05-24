import { ClipboardPaste, Code2, FileText, Layers, Link2 } from 'lucide-react'
import type { CardFilter } from '@/types/card'

const navItems: { id: CardFilter; label: string; icon: typeof Layers }[] = [
  { id: 'all', label: '全部', icon: Layers },
  { id: 'text', label: '文本', icon: FileText },
  { id: 'code', label: '代码', icon: Code2 },
  { id: 'link', label: '链接', icon: Link2 },
]

interface SidebarProps {
  activeFilter: CardFilter
  onFilterChange: (filter: CardFilter) => void
  onPasteNew: () => void
  isPasting?: boolean
  onNavigate?: () => void
  className?: string
}

export function Sidebar({
  activeFilter,
  onFilterChange,
  onPasteNew,
  isPasting = false,
  onNavigate,
  className = '',
}: SidebarProps) {
  const handleFilterChange = (filter: CardFilter) => {
    onFilterChange(filter)
    onNavigate?.()
  }

  return (
    <aside
      className={`hh-surface flex h-full w-[260px] shrink-0 flex-col border-r border-[var(--hh-border)] px-5 py-7 ${className}`}
    >
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--hh-border)] bg-[var(--hh-canvas)]">
          <Layers
            className="h-4 w-4 text-[var(--hh-coral)]"
            strokeWidth={1.5}
          />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-[var(--hh-text)]">
            Cardbox
          </h1>
          <p className="truncate text-xs tracking-tight text-[var(--hh-text-muted)]">
            Markdown 剪贴板
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5" aria-label="分类导航">
        <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--hh-text-muted)]">
          分类
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeFilter === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleFilterChange(id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium tracking-tight transition-all duration-200 ease-in-out ${
                isActive
                  ? 'bg-[var(--hh-mauve)] text-[var(--hh-text)]'
                  : 'text-[var(--hh-text-muted)] hover:bg-[var(--hh-canvas)] hover:text-[var(--hh-text)]'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? 'text-[var(--hh-text)]' : 'text-[var(--hh-text-muted)]'}`}
                strokeWidth={1.5}
              />
              {label}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onPasteNew}
        disabled={isPasting}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--hh-paste-btn)] px-4 py-3 text-sm font-medium tracking-tight text-[var(--hh-on-coral)] transition-colors duration-200 ease-in-out hover:brightness-95 active:scale-[0.99] disabled:cursor-wait disabled:opacity-50"
      >
        <ClipboardPaste
          className={`h-4 w-4 ${isPasting ? 'animate-pulse' : ''}`}
          strokeWidth={1.5}
        />
        {isPasting ? '读取剪贴板…' : '一键粘贴 / 新建'}
      </button>
    </aside>
  )
}
