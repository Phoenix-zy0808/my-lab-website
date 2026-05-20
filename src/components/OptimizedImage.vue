<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
}>(), {
  alt: '',
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const webpSrc = computed(() => {
  if (!props.src)
    return ''

  if (/^(data:|blob:)/.test(props.src))
    return ''

  if (/\.(svg|webp)([?#].*)?$/i.test(props.src))
    return ''

  return props.src.replace(/\.(jpe?g|png)([?#].*)?$/i, '.webp$2')
})
</script>

<template>
  <picture class="contents">
    <source v-if="webpSrc" :srcset="webpSrc" type="image/webp">
    <img
      v-bind="$attrs"
      :src="src"
      :alt="alt"
      @load="emit('load', $event)"
      @error="emit('error', $event)"
    >
  </picture>
</template>
