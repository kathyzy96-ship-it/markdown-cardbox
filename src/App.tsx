import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CardFilter } from '@/types/card'
import { AppLayout } from '@/components/layout/AppLayout'
import { MainArea } from '@/components/layout/MainArea'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { Sidebar } from '@/components/layout/Sidebar'
import { CardDetailModal } from '@/components/cards/CardDetailModal'
import { Toast } from '@/components/ui/Toast'
import { useAppToast } from '@/hooks/useAppToast'
import { useCards } from '@/hooks/useCards'
import { useClipboardPaste } from '@/hooks/useClipboardPaste'
import { getVisibleCards } from '@/utils/filterCards'

export default function App() {
  const { cards, addCard, removeCard, updateCardTags } = useCards()
  const [activeFilter, setActiveFilter] = useState<CardFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { toast, dismissToast, showToast } = useAppToast()
  const { isPasting, pasteFromClipboard } = useClipboardPaste(showToast)

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId) ?? null,
    [cards, selectedCardId],
  )

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(dismissToast, 4500)
    return () => window.clearTimeout(timer)
  }, [toast, dismissToast])

  const handlePasteNew = useCallback(() => {
    void pasteFromClipboard(addCard, setActiveFilter)
  }, [pasteFromClipboard, addCard])

  const handleDeleteCard = useCallback(
    (id: string) => {
      removeCard(id)
      setSelectedCardId((current) => (current === id ? null : current))
    },
    [removeCard],
  )

  const handleOpenCard = useCallback((id: string) => {
    setSelectedCardId(id)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedCardId(null)
  }, [])

  const handleCopied = useCallback(() => {
    showToast('内容已复制到剪贴板', 'success')
  }, [showToast])

  const handleTagsChange = useCallback(
    (id: string, tags: string[]) => {
      updateCardTags(id, tags)
    },
    [updateCardTags],
  )

  const visibleCards = useMemo(
    () => getVisibleCards(cards, activeFilter, searchQuery),
    [cards, activeFilter, searchQuery],
  )

  const sidebarProps = {
    activeFilter,
    onFilterChange: setActiveFilter,
    onPasteNew: handlePasteNew,
    isPasting,
    onNavigate: closeDrawer,
  }

  return (
    <>
      <AppLayout>
        <Sidebar
          {...sidebarProps}
          className="sticky top-0 hidden h-screen shrink-0 md:flex"
        />

        <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
          <Sidebar {...sidebarProps} className="h-full w-full max-w-[280px]" />
        </MobileDrawer>

        <div className="flex min-w-0 flex-1 flex-col">
          <MobileHeader
            onMenuOpen={() => setDrawerOpen(true)}
            onPasteNew={handlePasteNew}
            isPasting={isPasting}
          />
          <MainArea
            cards={visibleCards}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCard={handleOpenCard}
            onDeleteCard={handleDeleteCard}
            onCopied={handleCopied}
          />
        </div>
      </AppLayout>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={handleCloseDetail}
          onDelete={handleDeleteCard}
          onTagsChange={handleTagsChange}
          onCopied={handleCopied}
        />
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] w-full max-w-md -translate-x-1/2 px-4">
          <Toast toast={toast} onDismiss={dismissToast} />
        </div>
      )}
    </>
  )
}
