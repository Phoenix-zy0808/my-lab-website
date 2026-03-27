import type { Ref } from 'vue'

/**
 * 滚动监听 Hook
 * 支持节流、滚动方向检测和滚动到顶部
 * 
 * @param {number} throttle - 节流时间（ms）
 * @returns {{ isScrolled: Ref<boolean>, scrollY: Ref<number>, scrollDirection: Ref<'up' | 'down' | null>, scrollToTop: () => void }}
 */
export function useScroll(throttle = 100) {
  const isScrolled = ref(false)
  const scrollY = ref(0)
  const scrollDirection = ref<'up' | 'down' | null>(null)
  const lastScrollY = ref(0)

  /**
   * 处理滚动事件
   */
  const handleScroll = useThrottleFn(() => {
    const currentY = window.scrollY
    scrollY.value = currentY
    isScrolled.value = currentY > 50

    // 检测滚动方向
    if (currentY > lastScrollY.value) {
      scrollDirection.value = 'down'
    }
    else if (currentY < lastScrollY.value) {
      scrollDirection.value = 'up'
    }

    lastScrollY.value = currentY
  }, throttle)

  /**
   * 平滑滚动到顶部
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // 监听滚动
  if (typeof window !== 'undefined') {
    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // 初始化
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
  }

  return {
    isScrolled,
    scrollY,
    scrollDirection,
    scrollToTop,
  }
}
