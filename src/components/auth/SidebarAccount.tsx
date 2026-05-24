import { Cloud, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface SidebarAccountProps {
  onOpenAuth: () => void
}

function truncateEmail(email: string, max = 22): string {
  if (email.length <= max) return email
  const [local, domain] = email.split('@')
  if (!domain) return `${email.slice(0, max - 1)}…`
  const shortLocal =
    local.length > 8 ? `${local.slice(0, 6)}…` : local
  return `${shortLocal}@${domain}`
}

export function SidebarAccount({ onOpenAuth }: SidebarAccountProps) {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <button
        type="button"
        onClick={onOpenAuth}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--hh-border)] bg-[var(--hh-canvas)] px-4 py-2.5 text-sm font-medium tracking-tight text-[var(--hh-text)] transition-colors duration-200 hover:border-[var(--hh-coral)]/60 hover:bg-[var(--hh-surface)]"
      >
        <User className="h-4 w-4 text-[var(--hh-coral)]" strokeWidth={1.5} />
        登录 / 注册
      </button>
    )
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-[var(--hh-border)] bg-[var(--hh-canvas)] px-3 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--hh-mauve)]">
          <Cloud className="h-4 w-4 text-[var(--hh-coral)]" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium tracking-tight text-[var(--hh-text)]">
            {truncateEmail(user.email ?? '已登录')}
          </p>
          <p className="text-[10px] tracking-tight text-[var(--hh-text-muted)]">
            云端同步中
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void signOut()}
        className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium tracking-tight text-[var(--hh-text-muted)] transition-colors hover:bg-[var(--hh-canvas)] hover:text-[var(--hh-text)]"
      >
        <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
        退出登录
      </button>
    </div>
  )
}
