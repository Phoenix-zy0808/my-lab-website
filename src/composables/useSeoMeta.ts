import { onMounted, watchEffect } from 'vue'

export interface UseSeoMetaInput {
  title?: string
  description?: string
}

export function useSeoMeta(meta: UseSeoMetaInput) {
  const siteName = '智能光谱分析与材料信息课题组'

  if (meta.title) {
    watchEffect(() => {
      document.title = `${meta.title} - ${siteName}`
    })
  }

  onMounted(() => {
    if (meta.description)
      setMetaTag('description', meta.description)
  })
}

function setMetaTag(name: string, content: string) {
  if (typeof document === 'undefined')
    return

  let meta = document.querySelector(`meta[name="${name}"]`)

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}
