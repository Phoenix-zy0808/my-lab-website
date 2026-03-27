import { watchEffect, onMounted } from 'vue'

/**
 * SEO Meta 标签配置接口
 */
export interface UseSeoMetaInput {
  /** 页面标题 */
  title?: string
  /** 页面描述 */
  description?: string
}

/**
 * 设置页面 SEO Meta 标签
 * 简化版本：只设置最基本的 title 和 description
 * 
 * @example
 * ```ts
 * useSeoMeta({
 *   title: '团队成员',
 *   description: '介绍实验室的教授、研究人员和学生',
 * })
 * ```
 */
export function useSeoMeta(meta: UseSeoMetaInput) {
  const siteName = '拉曼光谱实验室'

  // 设置标题
  if (meta.title) {
    watchEffect(() => {
      document.title = `${meta.title} - ${siteName}`
    })
  }

  // 设置描述
  onMounted(() => {
    if (meta.description) {
      setMetaTag('description', meta.description)
    }
  })
}

/**
 * 设置或更新 meta 标签
 */
function setMetaTag(name: string, content: string) {
  if (typeof document === 'undefined') return

  let meta = document.querySelector(`meta[name="${name}"]`)

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}
