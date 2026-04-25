/**
 * 收集并输出页面性能指标。
 * 不依赖组件生命周期，可在应用挂载后直接调用。
 */
export function reportPerformance() {
  if (typeof window === 'undefined' || !window.performance)
    return

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined

  if (!navigation)
    return

  const metrics = {
    loadTime: navigation.loadEventEnd - navigation.startTime,
    domReady: navigation.domInteractive - navigation.startTime,
    fcp: (performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry | undefined)?.startTime || 0,
    fmp: (performance.getEntriesByName('first-meaningful-paint')[0] as PerformanceEntry | undefined)?.startTime || 0,
  }

  if (import.meta.env.DEV) {
    console.warn('性能指标:', {
      '加载总时间': `${metrics.loadTime.toFixed(2)}ms`,
      'DOM 就绪时间': `${metrics.domReady.toFixed(2)}ms`,
      '首次内容绘制': `${metrics.fcp.toFixed(2)}ms`,
      '首次有意义绘制': `${metrics.fmp.toFixed(2)}ms`,
    })
  }

  if (import.meta.env.PROD) {
    // TODO: 集成分析服务
    // sendToAnalytics(metrics)
  }

  return metrics
}

export function usePerformance() {
  return { reportPerformance }
}
