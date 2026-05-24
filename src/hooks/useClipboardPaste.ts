import { useCallback, useState, type Dispatch, type SetStateAction } from 'react'
import type { Card, CardFilter } from '@/types/card'
import type { ToastVariant } from '@/components/ui/Toast'
import { createCardFromClipboard } from '@/utils/createCardFromClipboard'
import { readClipboardText } from '@/utils/readClipboardText'

export function useClipboardPaste(
  showToast: (message: string, variant?: ToastVariant) => void,
) {
  const [isPasting, setIsPasting] = useState(false)

  const pasteFromClipboard = useCallback(
    async (
      addCard: (card: Card) => void | Promise<void>,
      setActiveFilter: Dispatch<SetStateAction<CardFilter>>,
    ) => {
      setIsPasting(true)

      const result = await readClipboardText()
      setIsPasting(false)

      if (!result.ok) {
        showToast(result.message, 'error')
        return
      }

      const card = createCardFromClipboard(result.text)
      try {
        await addCard(card)
      } catch {
        showToast('同步到云端失败，请检查网络后重试', 'error')
        return
      }
      setActiveFilter((current) =>
        current === 'all' || current === card.type ? current : card.type,
      )

      const typeLabel =
        card.type === 'link' ? '链接' : card.type === 'code' ? '代码' : '文本'
      showToast(`已添加 ${typeLabel} 卡片`, 'success')
    },
    [showToast],
  )

  return { isPasting, pasteFromClipboard }
}
