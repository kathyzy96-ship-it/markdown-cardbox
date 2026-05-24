import { useEffect, useId, useState } from 'react'
import { Loader2, LogIn, UserPlus, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type AuthMode = 'login' | 'signup'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const titleId = useId()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) return
    setEmail('')
    setPassword('')
    setError(null)
    setSuccessMessage(null)
    setMode('login')
  }, [open])

  if (!open) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setSubmitting(true)

    const result =
      mode === 'login'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (mode === 'signup') {
      setSuccessMessage('注册成功！若项目开启了邮箱验证，请查收邮件后登录。')
      setMode('login')
      setPassword('')
      return
    }

    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[var(--hh-text)]/20 backdrop-blur-[2px]" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="hh-surface relative w-full max-w-[400px] rounded-2xl border border-[var(--hh-border)] p-6 shadow-[0_24px_48px_-12px_rgba(74,63,58,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--hh-text-muted)] transition-colors hover:bg-[var(--hh-canvas)] hover:text-[var(--hh-text)]"
          aria-label="关闭"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="mb-6 pr-8">
          <h2
            id={titleId}
            className="text-lg font-semibold tracking-tight text-[var(--hh-text)]"
          >
            {mode === 'login' ? '欢迎回来' : '创建账户'}
          </h2>
          <p className="mt-1 text-sm tracking-tight text-[var(--hh-text-muted)]">
            登录后卡片将自动同步到云端
          </p>
        </div>

        <div className="mb-5 flex rounded-lg border border-[var(--hh-border)] bg-[var(--hh-canvas)] p-0.5">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError(null)
              setSuccessMessage(null)
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium tracking-tight transition-all duration-200 ${
              mode === 'login'
                ? 'bg-[var(--hh-surface)] text-[var(--hh-text)] shadow-sm'
                : 'text-[var(--hh-text-muted)] hover:text-[var(--hh-text)]'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" strokeWidth={1.5} />
            登录
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError(null)
              setSuccessMessage(null)
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium tracking-tight transition-all duration-200 ${
              mode === 'signup'
                ? 'bg-[var(--hh-surface)] text-[var(--hh-text)] shadow-sm'
                : 'text-[var(--hh-text-muted)] hover:text-[var(--hh-text)]'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium tracking-tight text-[var(--hh-text-muted)]">
              邮箱
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="hh-auth-input w-full rounded-lg border border-[var(--hh-border)] bg-[var(--hh-canvas)] px-3 py-2.5 text-sm tracking-tight text-[var(--hh-text)] outline-none transition-[border-color,box-shadow] duration-200"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium tracking-tight text-[var(--hh-text-muted)]">
              密码
            </span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="hh-auth-input w-full rounded-lg border border-[var(--hh-border)] bg-[var(--hh-canvas)] px-3 py-2.5 text-sm tracking-tight text-[var(--hh-text)] outline-none transition-[border-color,box-shadow] duration-200"
              placeholder="至少 6 位"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-[var(--hh-coral)]/40 bg-[var(--hh-coral)]/10 px-3 py-2 text-sm tracking-tight text-[var(--hh-text)]">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="rounded-lg border border-[var(--hh-mauve)] bg-[var(--hh-mauve)]/50 px-3 py-2 text-sm tracking-tight text-[var(--hh-text)]">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--hh-paste-btn)] px-4 py-3 text-sm font-medium tracking-tight text-[var(--hh-on-coral)] transition-colors duration-200 hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                处理中…
              </>
            ) : mode === 'login' ? (
              '登录并同步'
            ) : (
              '注册账户'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
