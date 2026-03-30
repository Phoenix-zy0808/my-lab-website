<script setup lang="ts">
interface Props {
  background?: string
  title: string
  subtitle?: string
  description?: string
  size?: 'large' | 'medium' | 'small'
}

withDefaults(defineProps<Props>(), {
  size: 'large',
})

// 背景图加载状态
const bgLoaded = ref(false)

function handleBgLoad() {
  bgLoaded.value = true
}

function handleBgError() {
  // 加载失败也标记为已加载，使用渐变背景
  bgLoaded.value = true
}
</script>

<template>
  <section
    :class="[
      size === 'small' ? 'hero-section-sm' : size === 'medium' ? 'hero-section-md' : 'hero-section',
    ]"
    :style="{
      backgroundImage: background ? `url(${background})` : undefined,
      backgroundColor: bgLoaded ? 'transparent' : 'oklch(56% 0.062 207.6 / 0.2)',
    }"
    :aria-label="title"
    role="banner"
  >
    <!-- 渐变占位背景 -->
    <div
      v-if="!bgLoaded"
      class="inset-0 absolute from-primary/20 to-secondary/20 bg-gradient-to-br"
      aria-hidden="true"
    />

    <div class="hero-overlay" aria-hidden="true" />
    <div class="hero-content">
      <h1 class="hero-title">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="hero-subtitle">
        {{ subtitle }}
      </p>
      <p v-if="description" class="hero-description">
        {{ description }}
      </p>
    </div>

    <!-- 隐藏的图片元素用于监听加载 -->
    <img
      v-if="background"
      :src="background"
      class="hidden"
      alt=""
      aria-hidden="true"
      @load="handleBgLoad"
      @error="handleBgError"
    >
  </section>
</template>
