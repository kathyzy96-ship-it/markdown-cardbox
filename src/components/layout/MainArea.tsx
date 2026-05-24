import type { Card, CardFilter } from '@/types/card'
import { CardComponent } from '@/components/cards/CardComponent'
import { CardSearchInput } from '@/components/ui/CardSearchInput'

const filterLabels: Record<CardFilter, string> = {
  all: '全部卡片',
  text: '文本',
  code: '代码',
  link: '链接',
}

interface MainAreaProps {
  cards: Card[]
  activeFilter: CardFilter
  searchQuery: string
  onSearchChange: (query: string) => void
  onOpenCard: (id: string) => void
  onDeleteCard: (id: string) => void
  onCopied?: () => void
}

export function MainArea({
  cards,
  activeFilter,
  searchQuery,
  onSearchChange,
  onOpenCard,
  onDeleteCard,
  onCopied,
}: MainAreaProps) {
  const hasSearch = searchQuery.trim().length > 0
  const isEmpty = cards.length === 0

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[var(--hh-canvas)]">
      <header className="border-b border-[var(--hh-border)] px-4 py-5 md:px-10 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--hh-text)] md:text-2xl">
              {filterLabels[activeFilter]}
            </h2>
            <p className="mt-1 text-sm tracking-tight text-[var(--hh-text-muted)]">
              {hasSearch
                ? `找到 ${cards.length} 张匹配卡片`
                : `共 ${cards.length} 张卡片`}
            </p>
          </div>
          <CardSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full md:max-w-xs"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 md:px-10 md:py-8">
        {isEmpty ? (
          <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--hh-border)] bg-[var(--hh-surface)] px-4 shadow-[var(--hh-shadow-sm)] md:h-64">
            <p className="text-center text-sm font-medium tracking-tight text-[var(--hh-text)]">
              {hasSearch ? '未找到匹配的卡片' : '暂无卡片'}
            </p>
            <p className="mt-1 text-center text-xs tracking-tight text-[var(--hh-text-muted)]">
              {hasSearch
                ? '试试其他关键词，或切换分类'
                : '点击「一键粘贴」添加卡片'}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-7 2xl:grid-cols-4">
            {cards.map((card) => (
              <li key={card.id}>
                <CardComponent
                  card={card}
                  onOpen={() => onOpenCard(card.id)}
                  onDelete={() => onDeleteCard(card.id)}
                  onCopied={onCopied}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
