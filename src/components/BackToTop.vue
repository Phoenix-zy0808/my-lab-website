<script setup lang="ts">
import { useScroll } from '~/composables/useScroll'

const { isScrolled } = useScroll(300)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <button
      v-if="isScrolled"

      text-white rounded-full bg-primary flex h-12 w-12 shadow-lg transition duration-200 items-center bottom-8 right-8 justify-center fixed z-40 hover:bg-primary-light
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <div i-carbon-chevron-up text-xl />
    </button>
  </transition>
</template>
