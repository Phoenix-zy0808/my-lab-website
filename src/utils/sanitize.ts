/**
 * XSS 防护工具
 * 简单的 HTML 转义函数，用于防止 XSS 攻击
 * 
 * @example
 * ```ts
 * const safe = escapeHtml(userInput)
 * ```
 */

/**
 * 转义 HTML 特殊字符
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return str.replace(/[&<>"']/g, char => htmlEscapes[char])
}

/**
 * 清理 HTML（允许安全标签）
 * 注意：生产环境建议使用 DOMPurify
 */
export function sanitizeHtml(html: string): string {
  // 简单实现：移除 script 标签和 on* 属性
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '')
}

/**
 * 清理 URL，防止 javascript: 协议
 */
export function sanitizeUrl(url: string): string {
  const normalizedUrl = url.trim().toLowerCase()
  if (normalizedUrl.startsWith('javascript:') || normalizedUrl.startsWith('data:')) {
    console.warn('[sanitizeUrl] Blocked potentially dangerous URL:', url)
    return '#'
  }
  return url
}
