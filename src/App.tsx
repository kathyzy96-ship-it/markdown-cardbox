import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CardFilter } from '@/types/card'
import { AuthModal } from '@/components/auth/AuthModal'
import { AppLayout } from '@/components/layout/AppLayout'
import { MainArea } from '@/components/layout/MainArea'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { Sidebar } from '@/components/layout/Sidebar'
import { CardDetailModal } from '@/components/cards/CardDetailModal'
import { Toast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'
import { useAppToast } from '@/hooks/useAppToast'
import { useCards } from '@/hooks/useCards'
import { useClipboardPaste } from '@/hooks/useClipboardPaste'
import { getVisibleCards } from '@/utils/filterCards'

export default function App() {
  const { user, authReady } = useAuth()
  const userId = user?.id ?? null
  const { cards, cardsLoading, syncError, addCard, removeCard, updateCardTags } =
    useCards(userId, authReady)
  const skipCloudToast = useRef(true)

  const [activeFilter, setActiveFilter] = useState<CardFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
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

  useEffect(() => {
    if (syncError) showToast(syncError, 'error')
  }, [syncError, showToast])

  useEffect(() => {
    if (!authReady || !userId) return
    if (skipCloudToast.current) {
      skipCloudToast.current = false
      return
    }
    showToast('已连接云端，卡片将自动同步', 'success')
  }, [userId, authReady, showToast])

  const handlePasteNew = useCallback(() => {
    void pasteFromClipboard(addCard, setActiveFilter)
  }, [pasteFromClipboard, addCard])

  const handleDeleteCard = useCallback(
    (id: string) => {
      void (async () => {
        try {
          await removeCard(id)
          setSelectedCardId((current) => (current === id ? null : current))
        } catch {
          showToast('删除失败，请检查网络后重试', 'error')
        }
      })()
    },
    [removeCard, showToast],
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
      void (async () => {
        try {
          await updateCardTags(id, tags)
        } catch {
          showToast('标签同步失败，请稍后重试', 'error')
        }
      })()
    },
    [updateCardTags, showToast],
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
    onOpenAuth: () => setAuthModalOpen(true),
  }

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--hh-canvas)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--hh-border)] border-t-[var(--hh-coral)]" />
      </div>
    )
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
            cardsLoading={cardsLoading}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCard={handleOpenCard}
            onDeleteCard={handleDeleteCard}
            onCopied={handleCopied}
          />
        </div>
      </AppLayout>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

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
