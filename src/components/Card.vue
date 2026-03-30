<script setup lang="ts">
import { useImageLazyLoad } from '~/composables/useImageLazyLoad'

interface Props {
  title: string
  description?: string
  icon?: string
  image?: string
  link?: string
  imagePosition?: 'top' | 'left'
}

const props = withDefaults(defineProps<Props>(), {
  imagePosition: 'top',
})

// 图片懒加载
const { imgRef, src: lazySrc, isLoaded } = props.image
  ? useImageLazyLoad(props.image)
  : { imgRef: ref(null), src: ref(''), isLoaded: ref(true) }
</script>

<template>
  <component
    :is="link ? 'RouterLink' : 'div'"
    :to="link"
    class="card-hover no-underline block" :class="[
      imagePosition === 'left' ? 'flex flex-col sm:flex-row' : 'flex flex-col',
    ]"
    :aria-label="link ? `前往${title}页面` : undefined"
    role="article"
  >
    <!-- 图片区域 -->
    <div
      v-if="image"
      ref="imgRef"
      class="mb-4 rounded-lg relative overflow-hidden" :class="[
        imagePosition === 'left' ? 'sm:w-48 sm:mb-0 sm:mr-4' : 'h-48',
      ]"
    >
      <img
        :src="lazySrc"
        :alt="title"

        loading="lazy"
        decoding="async"

        h-full w-full transition duration-300 object-cover hover:scale-110
        :class="{ 'opacity-0': !isLoaded }"
      >
      <!-- 加载占位 - 带骨架屏动画 -->
      <div
        v-if="!isLoaded"

        bg="gray-100"

        flex items-center inset-0 justify-center absolute animate-pulse
        aria-hidden="true"
      >
        <div class="flex flex-col gap-2 items-center">
          <div i-carbon-image text-3xl text-gray-300 />
          <div class="rounded bg-gray-200 h-2 w-20 animate-pulse" />
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div flex-1>
      <!-- Icon -->
      <div
        v-if="icon"

        bg="oklch(56% 0.062 207.6)/0.1"

        text-2xl text-primary mb-3 rounded-lg flex h-12 w-12 items-center justify-center
        aria-hidden="true"
      >
        <div :class="icon" />
      </div>

      <!-- 标题 -->
      <h3 text-xl text-primary font-semibold mb-2>
        {{ title }}
      </h3>

      <!-- 描述 -->
      <p v-if="description" text-sm text-gray-600 leading-relaxed>
        {{ description }}
      </p>

      <!-- 链接指示 -->
      <div
        v-if="link"

        text-sm text-secondary font-medium mt-4 flex gap-2 items-center
        aria-hidden="true"
      >
        <span>了解更多</span>
        <div i-carbon-arrow-right transition duration-200 group-hover:translate-x-1 />
      </div>
    </div>
  </component>
</template>
