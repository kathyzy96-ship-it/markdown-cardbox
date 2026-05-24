import type { Card } from '@/types/card'
import { extractTags } from '@/utils/extractTags'
import { inferCardType } from '@/utils/inferCardType'

export function createCardFromClipboard(content: string): Card {
  const trimmed = content.trim()
  const type = inferCardType(trimmed)

  return {
    id: crypto.randomUUID(),
    content: trimmed,
    type,
    tags: extractTags(trimmed, type),
    createdAt: new Date().toISOString(),
  }
}
