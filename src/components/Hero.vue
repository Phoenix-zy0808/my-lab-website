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
</script>

<template>
  <section
    :class="[
      size === 'small' ? 'hero-section-sm' : size === 'medium' ? 'hero-section-md' : 'hero-section',
    ]"
    :style="{ backgroundImage: background ? `url(${background})` : undefined }"
    :aria-label="title"
    role="banner"
  >
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
  </section>
</template>
