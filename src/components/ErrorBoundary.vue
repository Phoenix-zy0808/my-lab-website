<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

interface Props {
  /** 错误发生时的回退内容 */
  fallback?: string
  /** 是否显示错误详情（开发环境） */
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallback: '内容加载失败，请稍后重试',
  showDetails: false,
})

const emit = defineEmits<{
  /** 错误捕获时触发 */
  error: [error: Error, errorInfo: { componentStack?: string }]
}>()

const hasError = ref(false)
const errorMessage = ref<string>('')
const errorStack = ref<string>('')

/**
 * 捕获子组件错误
 */
onErrorCaptured((error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message

  // 收集组件堆栈
  if (instance) {
    const componentName = instance.type?.name || instance.type?.__name || 'Anonymous'
    errorStack.value = `Component: ${componentName}\nInfo: ${info}`
  }

  // 通知父组件
  emit('error', error, {
    componentStack: errorStack.value,
  })

  // 生产环境上报错误
  if (import.meta.env.PROD) {
    // TODO: 集成错误监控系统（如 Sentry）
    console.error('[ErrorBoundary] Captured error:', error)
  }

  // 阻止错误继续向上传播
  return false
})
</script>

<template>
  <div>
    <slot v-if="!hasError" />

    <div
      v-else
      role="alert"
      class="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-200"
    >
      <div class="i-carbon-warning text-4xl text-red-500 mb-4" aria-hidden="true" />
      <p class="text-red-700 font-medium mb-2">
        {{ fallback }}
      </p>

      <!-- 开发环境显示错误详情 -->
      <details v-if="showDetails || import.meta.env.DEV" class="mt-4 w-full max-w-md">
        <summary class="cursor-pointer text-sm text-red-600 hover:text-red-700">
          错误详情
        </summary>
        <div class="mt-2 p-3 bg-white rounded border border-red-200 text-left">
          <p class="text-xs font-mono text-red-800 mb-2">
            {{ errorMessage }}
          </p>
          <pre class="text-xs text-gray-500 whitespace-pre-wrap">{{ errorStack }}</pre>
        </div>
      </details>

      <!-- 重试按钮 -->
      <button
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        @click="hasError = false"
      >
        重试
      </button>
    </div>
  </div>
</template>
