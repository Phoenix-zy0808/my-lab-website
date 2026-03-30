/**
 * 性能监控 Hook
 * 用于收集和报告页面性能指标
 */

export function usePerformance() {
  const reportPerformance = () => {
    if (typeof window === 'undefined' || !window.performance)
      return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    const metrics = {
      // 页面加载总时间
      loadTime: navigation.loadEventEnd - navigation.startTime,
      // DOM 就绪时间
      domReady: navigation.domInteractive - navigation.startTime,
      // 首次内容绘制
      fcp: (performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry)?.startTime || 0,
      // 首次有意义绘制
      fmp: (performance.getEntriesByName('first-meaningful-paint')[0] as PerformanceEntry)?.startTime || 0,
    }

    // 开发环境输出
    if (import.meta.env.DEV) {
      console.warn('📊 性能指标:', {
        '加载总时间': `${metrics.loadTime.toFixed(2)}ms`,
        'DOM 就绪时间': `${metrics.domReady.toFixed(2)}ms`,
        '首次内容绘制': `${metrics.fcp.toFixed(2)}ms`,
        '首次有意义绘制': `${metrics.fmp.toFixed(2)}ms`,
      })
    }

    // 生产环境可以发送到分析服务
    if (import.meta.env.PROD) {
      // TODO: 集成分析服务
      // sendToAnalytics(metrics)
    }
  }

  onMounted(reportPerformance)

  return { reportPerformance }
}
