import { useCallback, useEffect, useState } from 'react'
import { Check, Code2, Copy, FileText, Link2, Trash2, X } from 'lucide-react'
import { CardMarkdown } from '@/components/cards/CardMarkdown'
import { CardTagsEditor } from '@/components/cards/CardTagsEditor'
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

interface CardDetailModalProps {
  card: Card
  onClose: () => void
  onDelete: (id: string) => void
  onTagsChange: (id: string, tags: string[]) => void
  onCopied?: () => void
}

export function CardDetailModal({
  card,
  onClose,
  onDelete,
  onTagsChange,
  onCopied,
}: CardDetailModalProps) {
  const { icon: TypeIcon, label } = typeConfig[card.type]
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(card.content)
    if (ok) {
      setCopied(true)
      onCopied?.()
      window.setTimeout(() => setCopied(false), 2000)
    }
  }, [card.content, onCopied])

  const handleDelete = useCallback(() => {
    onDelete(card.id)
    onClose()
  }, [card.id, onDelete, onClose])

  useEffect(() => {
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
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--hh-text)]/12 backdrop-blur-[3px] transition-opacity"
        onClick={onClose}
        aria-label="关闭"
      />

      <div className="relative flex max-h-[min(88vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--hh-border)] bg-[var(--hh-surface)] shadow-[var(--hh-shadow-lg)]">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--hh-border)] px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--hh-mauve)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-tight text-[var(--hh-text)]">
                <TypeIcon className="h-3 w-3 text-[var(--hh-coral)]" strokeWidth={1.5} />
                {label}
              </span>
              <time
                className="text-xs tracking-tight text-[var(--hh-text-muted)]"
                dateTime={card.createdAt}
              >
                {formatCardDate(card.createdAt)}
              </time>
            </div>
            <h2
              id="card-detail-title"
              className="mt-2 text-lg font-semibold tracking-tight text-[var(--hh-text)]"
            >
              卡片详情
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--hh-border)] bg-[var(--hh-canvas)] px-3 py-2 text-sm font-medium tracking-tight text-[var(--hh-text)] transition-all duration-200 ease-in-out hover:border-[var(--hh-coral)] hover:bg-[var(--hh-mauve)]"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[var(--hh-coral)]" strokeWidth={1.5} />
              ) : (
                <Copy className="h-4 w-4 text-[var(--hh-coral)]" strokeWidth={1.5} />
              )}
              {copied ? '已复制' : '复制内容'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--hh-text-muted)] transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="删除卡片"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--hh-text-muted)] transition-colors hover:bg-[var(--hh-mauve)]"
              aria-label="关闭"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <CardMarkdown card={card} variant="full" />
        </div>

        <footer className="shrink-0 border-t border-[var(--hh-border)] px-6 py-4">
          <CardTagsEditor
            tags={card.tags}
            onChange={(tags) => onTagsChange(card.id, tags)}
          />
        </footer>
      </div>
    </div>
  )
}
