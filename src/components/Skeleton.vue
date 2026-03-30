<script setup lang="ts">
interface Props {
  /** 骨架屏类型 */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  /** 宽度 */
  width?: string
  /** 高度 */
  height?: string
  /** 行数（仅 text 类型） */
  lines?: number
  /** 动画 */
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'text',
  lines: 3,
  animated: true,
})
</script>

<template>
  <!-- 文本骨架屏 -->
  <div v-if="variant === 'text'" :style="{ width, height }">
    <div
      v-for="i in lines"
      :key="i"

      mb-2 rounded bg-gray-200 h-4
      :class="{ 'animate-pulse': animated }"
      :style="{ width: i === lines ? '60%' : undefined }"
    />
  </div>

  <!-- 圆形骨架屏 -->
  <div
    v-else-if="variant === 'circular'"
    :class="{ 'animate-pulse': animated }"

    rounded-full bg-gray-200
    :style="{
      width: width || '48px',
      height: height || '48px',
    }"
  />

  <!-- 矩形骨架屏 -->
  <div
    v-else-if="variant === 'rectangular'"
    :class="{ 'animate-pulse': animated }"

    rounded bg-gray-200
    :style="{
      width: width || '100%',
      height: height || '160px',
    }"
  />

  <!-- 圆角矩形骨架屏 -->
  <div
    v-else-if="variant === 'rounded'"
    :class="{ 'animate-pulse': animated }"

    rounded-lg bg-gray-200
    :style="{
      width: width || '100%',
      height: height || '160px',
    }"
  />
</template>
