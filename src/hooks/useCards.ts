import { useCallback, useEffect, useState } from 'react'
import type { Card } from '@/types/card'
import {
  deleteUserCard,
  fetchUserCards,
  insertUserCard,
  updateUserCardTags as updateUserCardTagsApi,
} from '@/services/cardsApi'
import { loadCardsFromStorage, saveCardsToStorage, sortCardsByNewest } from '@/utils/cardStorage'

export function useCards(userId: string | null, authReady: boolean) {
  const [cards, setCards] = useState<Card[]>([])
  const [cardsLoading, setCardsLoading] = useState(true)
  const [syncError, setSyncError] = useState<string | null>(null)
  const isCloud = Boolean(userId)

  useEffect(() => {
    if (!authReady) return

    if (!userId) {
      setCards(loadCardsFromStorage())
      setCardsLoading(false)
      setSyncError(null)
      return
    }

    let cancelled = false
    setCardsLoading(true)
    setSyncError(null)

    void fetchUserCards(userId)
      .then((loaded) => {
        if (!cancelled) setCards(loaded)
      })
      .catch(() => {
        if (!cancelled) {
          setSyncError('无法从云端加载卡片，请稍后重试')
          setCards([])
        }
      })
      .finally(() => {
        if (!cancelled) setCardsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId, authReady])

  useEffect(() => {
    if (!authReady || isCloud) return
    saveCardsToStorage(cards)
  }, [cards, isCloud, authReady])

  const addCard = useCallback(
    async (card: Card) => {
      if (userId) {
        const inserted = await insertUserCard(userId, card)
        setCards((prev) => sortCardsByNewest([inserted, ...prev]))
        return
      }
      setCards((prev) => sortCardsByNewest([card, ...prev]))
    },
    [userId],
  )

  const removeCard = useCallback(
    async (id: string) => {
      if (userId) {
        await deleteUserCard(id)
      }
      setCards((prev) => prev.filter((card) => card.id !== id))
    },
    [userId],
  )

  const updateCardTags = useCallback(
    async (id: string, tags: string[]) => {
      if (userId) {
        await updateUserCardTagsApi(id, tags)
      }
      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, tags } : card)),
      )
    },
    [userId],
  )

  return {
    cards,
    cardsLoading,
    syncError,
    isCloud,
    addCard,
    removeCard,
    updateCardTags,
  }
}
