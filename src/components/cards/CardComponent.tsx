import { useCallback, useState } from 'react'
import { Check, Code2, Copy, FileText, Link2, Trash2 } from 'lucide-react'
import { CardMarkdown } from '@/components/cards/CardMarkdown'
import type { Card, CardType } from '@/types/card'
import { formatCardDate } from '@/utils/formatDate'
import { copyToClipboard } from '@/utils/copyToClipboard'

const typeConfig: Record<
  CardType,
  { icon: typeof FileText; label: string }
> = {
  text: { icon: FileText, label: '文本' },
  code: { icon: Code2, label: '代码' },
  link: { icon: Link2, label: '链接' },
}

interface CardComponentProps {
  card: Card
  onOpen: () => void
  onDelete: () => void
  onCopied?: () => void
}

export function CardComponent({
  card,
  onOpen,
  onDelete,
  onCopied,
}: CardComponentProps) {
  const { icon: TypeIcon, label } = typeConfig[card.type]
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      const ok = await copyToClipboard(card.content)
      if (ok) {
        setCopied(true)
        onCopied?.()
        window.setTimeout(() => setCopied(false), 2000)
      }
    },
    [card.content, onCopied],
  )

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      className="hh-card group relative flex min-h-[200px] cursor-pointer flex-col rounded-xl p-6 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hh-accent-ring)]"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-md bg-[var(--hh-mauve)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-tight text-[var(--hh-text)]">
          {label}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--hh-coral)] opacity-0 transition-all duration-200 ease-in-out hover:bg-[var(--hh-mauve)] group-hover:opacity-100 focus-visible:opacity-100"
            aria-label="复制内容"
            title="复制内容"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[var(--hh-text)]" strokeWidth={1.5} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              stopPropagation(e)
              onDelete()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--hh-text-muted)] opacity-0 transition-all duration-200 ease-in-out hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hh-accent-ring)]"
            aria-label="删除卡片"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <span className="flex h-8 w-8 items-center justify-center" aria-hidden>
            <TypeIcon
              className="h-4 w-4 text-[var(--hh-coral)]"
              strokeWidth={1.5}
            />
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <CardMarkdown card={card} variant="preview" />
      </div>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--hh-border)] pt-4">
        <time
          className="text-xs tracking-tight text-[var(--hh-text-muted)]"
          dateTime={card.createdAt}
        >
          {formatCardDate(card.createdAt)}
        </time>
        {card.tags.length > 0 && (
          <ul className="flex flex-wrap justify-end gap-1.5">
            {card.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-[var(--hh-code-bg)] px-2 py-0.5 text-[11px] tracking-tight text-[var(--hh-text-muted)]"
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </footer>
    </article>
  )
}
