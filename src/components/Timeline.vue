<script setup lang="ts">
/**
 * 时间轴项目数据
 */
export interface TimelineItem {
  /** 时间 */
  time: string
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 颜色（可选） */
  color?: 'primary' | 'secondary' | 'accent'
}

interface Props {
  /** 时间轴数据 */
  items: TimelineItem[]
  /** 标题 */
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div class="py-8">
    <!-- 标题 -->
    <h3 v-if="title" class="text-lg text-gray-800 font-semibold mb-6">
      {{ title }}
    </h3>

    <!-- 时间轴 -->
    <div class="relative">
      <!-- 垂直线 -->
      <div

        bg-gray-200 w-0.5 bottom-0 left-4 top-0 absolute
        aria-hidden="true"
      />

      <!-- 时间轴项目 -->
      <div class="space-y-6">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="pl-12 relative"
        >
          <!-- 时间点 -->
          <div
            class="rounded-full flex flex-shrink-0 h-8 w-8 items-center left-0 top-0 justify-center absolute"
            :class="[
              item.color === 'secondary'
                ? 'bg-secondary text-white'
                : item.color === 'accent'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-white',
            ]"
          >
            <div v-if="index === 0" i-carbon-star text-sm aria-hidden="true" />
            <div v-else rounded-full bg-white h-2 w-2 aria-hidden="true" />
          </div>

          <!-- 时间 -->
          <div
            class="text-sm font-medium"
            :class="[
              item.color === 'secondary'
                ? 'text-secondary'
                : item.color === 'accent'
                  ? 'text-accent'
                  : 'text-primary',
            ]"
          >
            {{ item.time }}
          </div>

          <!-- 内容 -->
          <div class="mt-1">
            <h4 class="text-base text-gray-800 font-semibold">
              {{ item.title }}
            </h4>
            <p v-if="item.description" class="text-sm text-gray-600 leading-relaxed mt-1">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
