export type ClipboardReadResult =
  | { ok: true; text: string }
  | { ok: false; reason: 'empty' | 'denied' | 'unsupported' | 'unknown'; message: string }

export async function readClipboardText(): Promise<ClipboardReadResult> {
  if (!navigator.clipboard?.readText) {
    return {
      ok: false,
      reason: 'unsupported',
      message: '当前浏览器不支持剪贴板读取，请使用 Chrome、Edge 或 Safari 最新版。',
    }
  }

  try {
    const text = await navigator.clipboard.readText()
    if (!text.trim()) {
      return {
        ok: false,
        reason: 'empty',
        message: '剪贴板为空，请先复制一些文本或链接。',
      }
    }
    return { ok: true, text }
  } catch (error) {
    const name = error instanceof DOMException ? error.name : ''

    if (name === 'NotAllowedError') {
      return {
        ok: false,
        reason: 'denied',
        message:
          '需要剪贴板权限：请在浏览器地址栏旁的权限提示中选择「允许」，然后再次点击「一键粘贴 / 新建」。',
      }
    }

    return {
      ok: false,
      reason: 'unknown',
      message: '无法读取剪贴板，请确认已授予权限后重试。',
    }
  }
}
