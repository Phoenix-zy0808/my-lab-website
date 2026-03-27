<script setup lang="ts">
const props = defineProps<{
  options: { key: string | number; label: string; icon?: string }[]
  modelValue: string | number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selected = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <div tabs>
    <button
      v-for="option in options"
      :key="option.key"
      :class="[
        'tab-btn',
        selected === option.key ? 'tab-btn-active' : 'tab-btn-inactive',
      ]"
      @click="selected = option.key"
    >
      <div v-if="option.icon" :class="option.icon" inline-block mr-2 />
      {{ option.label }}
    </button>
  </div>
</template>
