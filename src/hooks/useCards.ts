import { useCallback, useEffect, useState } from 'react'
import type { Card } from '@/types/card'
import { loadCardsFromStorage, saveCardsToStorage } from '@/utils/cardStorage'

export function useCards() {
  const [cards, setCards] = useState<Card[]>(loadCardsFromStorage)

  useEffect(() => {
    saveCardsToStorage(cards)
  }, [cards])

  const addCard = useCallback((card: Card) => {
    setCards((prev) => [card, ...prev])
  }, [])

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id))
  }, [])

  const updateCardTags = useCallback((id: string, tags: string[]) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, tags } : card)),
    )
  }, [])

  return { cards, addCard, removeCard, updateCardTags }
}
