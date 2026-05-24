import type { Card } from '@/types/card'

const FENCED_CODE = /```[\s\S]*?```/

function inferCodeLanguage(tags: string[]): string {
  const lang = tags.find((tag) =>
    ['typescript', 'javascript', 'python', 'rust', 'go', 'css', 'html'].includes(
      tag.toLowerCase(),
    ),
  )
  if (!lang) return ''
  if (lang === 'typescript') return 'typescript'
  if (lang === 'javascript') return 'javascript'
  return lang.toLowerCase()
}

/** Normalize raw card content for react-markdown. */
export function prepareCardContent(card: Card): string {
  const { content, type, tags } = card

  if (type === 'code' && !FENCED_CODE.test(content)) {
    const lang = inferCodeLanguage(tags)
    return `\`\`\`${lang}\n${content.trim()}\n\`\`\``
  }

  if (type === 'link' && !content.includes('[') && /^https?:\/\//i.test(content.trim())) {
    return `[${content.trim()}](${content.trim()})`
  }

  return content
}

export function cardHasCodeBlock(content: string, type: Card['type']): boolean {
  return type === 'code' || FENCED_CODE.test(content)
}
