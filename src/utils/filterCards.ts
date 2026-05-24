import type { Card, CardFilter } from '@/types/card'

export function filterCardsByCategory(
  cards: Card[],
  filter: CardFilter,
): Card[] {
  if (filter === 'all') return cards
  return cards.filter((card) => card.type === filter)
}

export function filterCardsBySearch(cards: Card[], query: string): Card[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return cards

  return cards.filter((card) => {
    if (card.content.toLowerCase().includes(normalized)) return true
    return card.tags.some((tag) => tag.toLowerCase().includes(normalized))
  })
}

export function getVisibleCards(
  cards: Card[],
  categoryFilter: CardFilter,
  searchQuery: string,
): Card[] {
  return filterCardsBySearch(
    filterCardsByCategory(cards, categoryFilter),
    searchQuery,
  )
}
