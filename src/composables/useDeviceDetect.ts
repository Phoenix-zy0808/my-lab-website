import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'

/**
 * 设备检测 Hook
 * 用于检测当前设备的类型和特性
 *
 * @returns {object} 设备检测信息
 */
export function useDeviceDetect() {
  // 基础断点
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  // 精确设备检测
  const isSmallMobile = useMediaQuery('(max-width: 374px)')
  const isNormalMobile = useMediaQuery('(min-width: 375px) and (max-width: 429px)')
  const isLargeMobile = useMediaQuery('(min-width: 430px) and (max-width: 768px)')

  // 特殊屏幕检测
  const hasNotch = useMediaQuery('(min-width: 375px) and (min-height: 812px)')
  const isFoldable = useMediaQuery('(min-width: 600px) and (max-width: 800px) and (min-height: 1000px)')

  // 横屏检测
  const isLandscape = useMediaQuery('(orientation: landscape)')

  // 触摸设备检测
  const isTouch = useMediaQuery('(pointer: coarse)')

  // 设备类型
  const deviceType = computed(() => {
    if (isFoldable.value)
      return 'foldable'
    if (isTablet.value)
      return 'tablet'
    if (isDesktop.value)
      return 'desktop'
    if (isSmallMobile.value)
      return 'small-mobile'
    if (isLargeMobile.value)
      return 'large-mobile'
    if (isMobile.value)
      return 'mobile'
    return 'unknown'
  })

  return {
    // 基础断点
    isMobile,
    isTablet,
    isDesktop,

    // 精确尺寸
    isSmallMobile,
    isNormalMobile,
    isLargeMobile,

    // 特殊屏幕
    hasNotch,
    isFoldable,
    isLandscape,

    // 交互方式
    isTouch,

    // 设备类型
    deviceType,
  }
}
