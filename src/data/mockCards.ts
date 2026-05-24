import type { Card } from '@/types/card'

export const mockCards: Card[] = [
  {
    id: '1',
    content:
      '## 设计笔记\n\n极简主义不是少做，而是**只做必要的事**。留白、层次、动效要克制。',
    type: 'text',
    tags: ['design', 'notes'],
    createdAt: '2026-05-24T08:30:00.000Z',
  },
  {
    id: '2',
    content:
      "const greet = (name: string) => {\n  return `Hello, ${name}!`\n}\n\nconsole.log(greet('Cardbox'))",
    type: 'code',
    tags: ['typescript', 'snippet'],
    createdAt: '2026-05-23T14:12:00.000Z',
  },
  {
    id: '3',
    content: 'https://tailwindcss.com/docs/installation',
    type: 'link',
    tags: ['docs', 'css'],
    createdAt: '2026-05-22T09:45:00.000Z',
  },
  {
    id: '4',
    content:
      '### 会议要点\n\n- 下周发布 **MVP**\n- 优先完成卡片 CRUD\n- 本地存储同步\n\n示例内联代码：`useLocalStorage`',
    type: 'text',
    tags: ['work', 'meeting'],
    createdAt: '2026-05-21T16:00:00.000Z',
  },
  {
    id: '5',
    content:
      'function debounce<T extends (...args: unknown[]) => void>(\n  fn: T,\n  ms: number\n) {\n  let timer: ReturnType<typeof setTimeout>\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn(...args), ms)\n  }\n}',
    type: 'code',
    tags: ['utils', 'javascript'],
    createdAt: '2026-05-20T11:20:00.000Z',
  },
  {
    id: '6',
    content: 'https://github.com/vitejs/vite',
    type: 'link',
    tags: ['dev', 'tooling'],
    createdAt: '2026-05-19T07:55:00.000Z',
  },
]
