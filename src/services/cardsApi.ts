import { supabase } from '@/supabaseClient'
import type { Card, CardType } from '@/types/card'
import type { CardRow } from '@/types/database'
import { sortCardsByNewest } from '@/utils/cardStorage'

function isCardType(value: string): value is CardType {
  return value === 'text' || value === 'code' || value === 'link'
}

function rowToCard(row: CardRow): Card | null {
  if (!isCardType(row.type)) return null
  return {
    id: row.id,
    content: row.content,
    type: row.type,
    tags: row.tags ?? [],
    createdAt: row.created_at,
  }
}

export async function fetchUserCards(userId: string): Promise<Card[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('id, user_id, content, type, tags, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  const cards = (data as CardRow[])
    .map(rowToCard)
    .filter((card): card is Card => card !== null)

  return sortCardsByNewest(cards)
}

export async function insertUserCard(userId: string, card: Card): Promise<Card> {
  const { data, error } = await supabase
    .from('cards')
    .insert({
      id: card.id,
      user_id: userId,
      content: card.content,
      type: card.type,
      tags: card.tags,
      created_at: card.createdAt,
    })
    .select('id, user_id, content, type, tags, created_at')
    .single()

  if (error) throw error

  const mapped = rowToCard(data as CardRow)
  if (!mapped) throw new Error('Invalid card returned from server')
  return mapped
}

export async function deleteUserCard(cardId: string): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('id', cardId)
  if (error) throw error
}

export async function updateUserCardTags(
  cardId: string,
  tags: string[],
): Promise<void> {
  const { error } = await supabase
    .from('cards')
    .update({ tags })
    .eq('id', cardId)

  if (error) throw error
}
