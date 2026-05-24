/** Normalize user input into a storable tag, or null if invalid. */
export function normalizeTag(raw: string): string | null {
  const trimmed = raw.trim().replace(/^#+/, '')
  if (!trimmed) return null

  const tag = trimmed
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .slice(0, 24)

  return tag.length >= 1 ? tag : null
}

export function mergeUniqueTags(existing: string[], next: string): string[] {
  const normalized = normalizeTag(next)
  if (!normalized) return existing
  if (existing.includes(normalized)) return existing
  return [...existing, normalized]
}
