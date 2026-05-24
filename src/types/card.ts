export type CardType = 'text' | 'code' | 'link'

export type CardFilter = 'all' | CardType

export interface Card {
  id: string
  content: string
  type: CardType
  tags: string[]
  createdAt: string
}
