import { useCallback, useState, type KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { mergeUniqueTags, normalizeTag } from '@/utils/normalizeTag'

interface CardTagsEditorProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function CardTagsEditor({ tags, onChange }: CardTagsEditorProps) {
  const [draft, setDraft] = useState('')
  const [hint, setHint] = useState<string | null>(null)

  const addTag = useCallback(() => {
    const normalized = normalizeTag(draft)
    if (!normalized) {
      setHint('请输入有效标签（字母、数字、中文或连字符）')
      return
    }
    if (tags.includes(normalized)) {
      setHint('标签已存在')
      setDraft('')
      return
    }
    onChange(mergeUniqueTags(tags, normalized))
    setDraft('')
    setHint(null)
  }, [draft, tags, onChange])

  const removeTag = useCallback(
    (tag: string) => {
      onChange(tags.filter((t) => t !== tag))
      setHint(null)
    },
    [tags, onChange],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--hh-text-muted)]">
        标签
      </p>

      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--hh-code-bg)] pl-2 pr-1 py-0.5 text-[11px] tracking-tight text-[var(--hh-text)]"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="flex h-4 w-4 items-center justify-center rounded text-[var(--hh-text-muted)] transition-colors hover:bg-[var(--hh-mauve)] hover:text-[var(--hh-text)]"
                aria-label={`移除标签 ${tag}`}
              >
                <X className="h-3 w-3" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setHint(null)
          }}
          onKeyDown={onKeyDown}
          placeholder="添加标签…"
          className="min-w-0 flex-1 rounded-lg border border-[var(--hh-border)] bg-[var(--hh-canvas)] px-3 py-2 text-sm tracking-tight text-[var(--hh-text)] placeholder:text-[var(--hh-text-muted)] focus:border-[var(--hh-coral)] focus:outline-none focus:ring-1 focus:ring-[var(--hh-accent-ring)]"
          aria-label="新标签"
        />
        <button
          type="button"
          onClick={addTag}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-[var(--hh-border)] bg-[var(--hh-mauve)] px-3 py-2 text-sm font-medium tracking-tight text-[var(--hh-text)] transition-colors hover:border-[var(--hh-coral)]"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          添加
        </button>
      </div>

      {hint && (
        <p className="text-xs tracking-tight text-[var(--hh-coral-deep)]">{hint}</p>
      )}
    </div>
  )
}
