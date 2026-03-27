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
    :class="[
      'card-hover block no-underline',
      imagePosition === 'left' ? 'flex flex-col sm:flex-row' : 'flex flex-col',
    ]"
    :aria-label="link ? `前往${title}页面` : undefined"
    role="article"
  >
    <!-- 图片区域 -->
    <div
      v-if="image"
      ref="imgRef"
      :class="[
        'relative overflow-hidden rounded-lg mb-4',
        imagePosition === 'left' ? 'sm:w-48 sm:mb-0 sm:mr-4' : 'h-48',
      ]"
    >
      <img
        :src="lazySrc"
        :alt="title"
        w-full
        h-full
        object-cover
        loading="lazy"
        decoding="async"
        transition
        duration-300
        hover:scale-110
        :class="{ 'opacity-0': !isLoaded }"
      />
      <!-- 加载占位 -->
      <div
        v-if="!isLoaded"
        absolute
        inset-0
        bg="gray-100"
        flex
        items-center
        justify-center
        aria-hidden="true"
      >
        <div i-carbon-image text-3xl text-gray-300 />
      </div>
    </div>

    <!-- 内容区域 -->
    <div flex-1>
      <!-- Icon -->
      <div
        v-if="icon"
        w-12
        h-12
        rounded-lg
        bg="oklch(56% 0.062 207.6)/0.1"
        flex
        items-center
        justify-center
        text-primary
        text-2xl
        mb-3
        aria-hidden="true"
      >
        <div :class="icon" />
      </div>

      <!-- 标题 -->
      <h3 text-xl font-semibold text-primary mb-2>
        {{ title }}
      </h3>

      <!-- 描述 -->
      <p v-if="description" text-gray-600 text-sm leading-relaxed>
        {{ description }}
      </p>

      <!-- 链接指示 -->
      <div
        v-if="link"
        mt-4
        flex
        items-center
        gap-2
        text-secondary
        text-sm
        font-medium
        aria-hidden="true"
      >
        <span>了解更多</span>
        <div i-carbon-arrow-right transition duration-200 group-hover:translate-x-1 />
      </div>
    </div>
  </component>
</template>
