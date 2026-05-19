<script setup lang="ts">
const props = defineProps<{
  options: { key: string | number, label: string, icon?: string }[]
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
  <div class="mb-8 px-4 overflow-x-auto -mx-4 sm:mx-0 sm:px-0">
    <div class="flex flex-nowrap gap-2 min-w-max sm:flex-wrap sm:min-w-0">
      <button
        v-for="option in options"
        :key="option.key"
        class="tab-btn flex-shrink-0 whitespace-nowrap" :class="[
          selected === option.key ? 'tab-btn-active' : 'tab-btn-inactive',
        ]"
        @click="selected = option.key"
      >
        <div v-if="option.icon" :class="option.icon" mr-2 inline-block />
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
