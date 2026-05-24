import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { markdownComponents } from '@/components/cards/markdownComponents'
import type { Card } from '@/types/card'
import { cardHasCodeBlock, prepareCardContent } from '@/utils/prepareCardContent'

export type CardMarkdownVariant = 'preview' | 'full'

interface CardMarkdownProps {
  card: Card
  variant?: CardMarkdownVariant
}

export function CardMarkdown({ card, variant = 'preview' }: CardMarkdownProps) {
  const source = prepareCardContent(card)
  const isCodeHeavy = cardHasCodeBlock(card.content, card.type)
  const isPreview = variant === 'preview'

  return (
    <div
      className={`card-markdown ${isCodeHeavy ? 'card-markdown--code' : ''} ${
        isPreview
          ? 'max-h-[11rem] overflow-hidden [mask-image:var(--hh-mask-fade)]'
          : ''
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
