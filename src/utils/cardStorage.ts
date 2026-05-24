import { CARDS_STORAGE_KEY } from '@/constants/storage'
import { mockCards } from '@/data/mockCards'
import type { Card, CardType } from '@/types/card'

function isCardType(value: unknown): value is CardType {
  return value === 'text' || value === 'code' || value === 'link'
}

function isCard(value: unknown): value is Card {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.content === 'string' &&
    isCardType(record.type) &&
    Array.isArray(record.tags) &&
    record.tags.every((tag) => typeof tag === 'string') &&
    typeof record.createdAt === 'string'
  )
}

export function sortCardsByNewest(cards: Card[]): Card[] {
  return [...cards].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

function parseStoredCards(raw: string): Card[] | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    const cards = parsed.filter(isCard)
    if (cards.length !== parsed.length) return null
    return sortCardsByNewest(cards)
  } catch {
    return null
  }
}

export function loadCardsFromStorage(): Card[] {
  try {
    const raw = localStorage.getItem(CARDS_STORAGE_KEY)
    if (raw === null) return sortCardsByNewest(mockCards)
    const cards = parseStoredCards(raw)
    if (cards === null) return sortCardsByNewest(mockCards)
    return cards
  } catch {
    return sortCardsByNewest(mockCards)
  }
}

export function saveCardsToStorage(cards: Card[]): void {
  try {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards))
  } catch {
    console.warn('[Cardbox] Failed to save cards to localStorage')
  }
}
