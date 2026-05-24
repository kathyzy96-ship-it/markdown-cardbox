import type { CardType } from '@/types/card'

const CODE_KEYWORD =
  /\b(const|let|var|function|import|export|class|interface|type|return|async|await|def|fn|pub|impl|package|using|#include)\b/

const FENCED_CODE = /```[\s\S]*?```/

export function inferCardType(content: string): CardType {
  const trimmed = content.trim()
  if (!trimmed) return 'text'

  const firstLine = trimmed.split('\n')[0]?.trim() ?? ''
  if (/^https?:\/\//i.test(firstLine)) {
    return 'link'
  }

  if (looksLikeCode(trimmed)) {
    return 'code'
  }

  return 'text'
}

function looksLikeCode(content: string): boolean {
  if (FENCED_CODE.test(content)) return true

  const braceCount = (content.match(/[{}]/g) ?? []).length
  const hasKeywords = CODE_KEYWORD.test(content)
  const semicolonCount = (content.match(/;/g) ?? []).length
  const parenPairs = (content.match(/[()]/g) ?? []).length

  if (hasKeywords && braceCount >= 2) return true
  if (hasKeywords && semicolonCount >= 2) return true
  if (hasKeywords && parenPairs >= 4) return true
  if (braceCount >= 6) return true

  return false
}
