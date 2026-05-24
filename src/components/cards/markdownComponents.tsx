import type { Components } from 'react-markdown'

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 text-xl font-semibold tracking-tight text-[var(--hh-text)] last:mb-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2.5 text-lg font-semibold tracking-tight text-[var(--hh-text)] last:mb-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 text-base font-medium tracking-tight text-[var(--hh-text)] last:mb-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-relaxed tracking-tight text-[var(--hh-text-muted)] last:mb-0">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--hh-text)]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-[var(--hh-text-muted)] italic">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-none space-y-1.5 pl-0 text-sm last:mb-0 [&>li]:relative [&>li]:pl-4 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.6em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-[var(--hh-coral)] [&>li]:before:content-['']">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-sm marker:text-[var(--hh-coral)] last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed tracking-tight text-[var(--hh-text-muted)]">
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="break-all text-[var(--hh-coral-deep)] underline decoration-[var(--hh-coral)]/50 underline-offset-2 transition-colors hover:text-[var(--hh-text)] hover:decoration-[var(--hh-coral)]"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-[var(--hh-coral)]/60 bg-[var(--hh-code-bg)] pl-3 text-sm tracking-tight text-[var(--hh-text-muted)] last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-[var(--hh-border)]" />,
  code: ({ className, children, ...props }) => {
    const isFenced = Boolean(className?.includes('language-'))
    if (isFenced) {
      return (
        <code
          className={`${className ?? ''} font-mono text-[13px] tracking-normal`}
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code
        className="rounded-md bg-[var(--hh-code-bg)] px-1.5 py-0.5 font-mono text-[13px] tracking-normal text-[var(--hh-text)]"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="card-code-block mb-3 overflow-x-auto rounded-lg border border-[var(--hh-border)] bg-[var(--hh-code-block)] p-4 font-mono text-[13px] leading-relaxed tracking-normal text-[var(--hh-text)] last:mb-0">
      {children}
    </pre>
  ),
}
