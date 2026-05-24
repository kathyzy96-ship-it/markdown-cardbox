import type { CardType } from '@/types/card'

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'this',
  'that',
  'from',
  'are',
  'was',
  'were',
  'have',
  'has',
  'not',
  'but',
  'you',
  'your',
  'can',
  'will',
  '的',
  '了',
  '是',
  '在',
  '和',
  '与',
  '或',
  '一个',
])

function sanitizeToken(raw: string): string {
  return raw
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .toLowerCase()
    .slice(0, 24)
}

function tagsFromLink(content: string): string[] {
  const line = content.trim().split('\n')[0]?.trim() ?? ''
  try {
    const host = new URL(line).hostname.replace(/^www\./i, '')
    const segment = host.split('.').filter(Boolean)[0]
    if (segment && segment.length >= 2) {
      return [segment, 'pasted']
    }
  } catch {
    // fall through
  }
  return ['pasted', 'link']
}

function tagsFromText(content: string): string[] {
  const tokens = content
    .replace(/[#*`[\]()>{}]/g, ' ')
    .split(/\s+/)
    .map(sanitizeToken)
    .filter(
      (word) =>
        word.length >= 2 &&
        word.length <= 20 &&
        !STOP_WORDS.has(word) &&
        !/^\d+$/.test(word),
    )

  const unique = [...new Set(tokens)]
  if (unique.length >= 2) return unique.slice(0, 2)
  if (unique.length === 1) return [unique[0], 'pasted']
  return ['pasted']
}

function tagsFromCode(content: string): string[] {
  const langMatch = content.match(/```(\w+)/)
  if (langMatch?.[1]) {
    return [langMatch[1].toLowerCase(), 'pasted']
  }

  if (/\btypescript\b|:\s*\w+\s*=>|interface\s+\w+/i.test(content)) {
    return ['typescript', 'pasted']
  }
  if (/\b(import|export)\b/.test(content) && /['"]/.test(content)) {
    return ['javascript', 'pasted']
  }
  if (/\bdef\s+\w+/.test(content)) {
    return ['python', 'pasted']
  }

  return ['pasted', 'code']
}

export function extractTags(content: string, type: CardType): string[] {
  switch (type) {
    case 'link':
      return tagsFromLink(content)
    case 'code':
      return tagsFromCode(content)
    default:
      return tagsFromText(content)
  }
}
