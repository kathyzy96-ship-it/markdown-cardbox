import { Search } from 'lucide-react'

interface CardSearchInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function CardSearchInput({
  value,
  onChange,
  className = '',
}: CardSearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--hh-text-muted)]"
        strokeWidth={1.5}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索内容或标签…"
        className="w-full rounded-lg border border-[var(--hh-border)] bg-[var(--hh-surface)] py-2.5 pl-10 pr-4 text-sm tracking-tight text-[var(--hh-text)] shadow-[var(--hh-shadow-sm)] placeholder:text-[var(--hh-text-muted)] transition-all duration-200 ease-in-out hover:border-[var(--hh-border-hover)] focus:border-[var(--hh-coral)] focus:outline-none focus:ring-1 focus:ring-[var(--hh-accent-ring)]"
        aria-label="搜索卡片"
      />
    </div>
  )
}
