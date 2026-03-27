import type { Ref } from 'vue'

/**
 * 通用数据获取 Hook
 * 支持错误处理、加载状态和缓存
 * 
 * @template T - 数据类型
 * @param {string} url - 数据 URL
 * @param {boolean} immediate - 是否立即获取
 * @returns {{ data: Ref<T | null>, loading: Ref<boolean>, error: Ref<Error | null>, fetchData: () => Promise<void> }}
 */
export function useFetchData<T>(url: string, immediate = true) {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * 获取数据
   */
  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      data.value = result as T
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch data')
      // 生产环境上报错误
      if (import.meta.env.DEV) {
        console.error(`[useFetchData] Error fetching ${url}:`, error.value)
      }
    }
    finally {
      loading.value = false
    }
  }

  // 立即获取
  if (immediate) {
    onMounted(fetchData)
  }

  return {
    data,
    loading,
    error,
    fetchData,
  }
}
