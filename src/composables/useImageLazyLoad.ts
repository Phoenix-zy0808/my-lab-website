/**
 * 图片懒加载 Hook
 * 使用 Intersection Observer API 实现
 * 
 * @param {string} src - 图片真实地址
 * @param {string} placeholder - 占位图
 * @returns {{ src: Ref<string>, isLoaded: Ref<boolean>, imgRef: Ref<HTMLImageElement | null> }}
 */
export function useImageLazyLoad(src: string, placeholder = '/images/gallery/placeholder.svg') {
  const imgRef = ref<HTMLImageElement | null>(null)
  const isLoaded = ref(false)
  const currentSrc = ref(placeholder)

  /**
   * 加载图片
   */
  const loadImage = () => {
    if (!src) return

    const img = new Image()
    img.onload = () => {
      currentSrc.value = src
      isLoaded.value = true
    }
    img.onerror = () => {
      // 加载失败保持占位图
      console.warn(`[useImageLazyLoad] Failed to load image: ${src}`)
    }
    img.src = src
  }

  // 使用 Intersection Observer
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    onMounted(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage()
              observer.disconnect()
            }
          })
        },
        {
          rootMargin: '50px',
          threshold: 0,
        },
      )

      if (imgRef.value) {
        observer.observe(imgRef.value)
      }

      onUnmounted(() => {
        observer.disconnect()
      })
    })
  }
  else {
    // 降级处理：直接加载
    onMounted(loadImage)
  }

  return {
    imgRef,
    src: currentSrc,
    isLoaded,
  }
}
