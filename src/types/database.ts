import type { CardType } from '@/types/card'

export interface CardRow {
  id: string
  user_id: string
  content: string
  type: CardType
  tags: string[]
  created_at: string
}
