<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  pdfUrl?: string
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

function close() {
  isOpen.value = false
}

// ESC 键关闭
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" fixed inset-0 z-50 flex items-center justify-center>
        <!-- 遮罩层 -->
        <div
          absolute inset-0 bg="rgb(0 0 0 / 0.6)" backdrop-blur-sm
          @click="close"
        />

        <!-- 模态框主体 -->
        <div
          relative
          bg-white
          rounded-lg
          shadow-2xl
          w-full
          h-full
          sm:w-[90vw]
          sm:h-[90vh]
          sm:max-w-5xl
          m-4
          flex
          flex-col
          transition-all
          duration-200
        >
          <!-- 头部 -->
          <div
            flex
            items-center
            justify-between
            px-4
            py-3
            border-b
            border-gray-200
          >
            <h3 text-lg font-semibold text-primary>
              {{ title || 'PDF 预览' }}
            </h3>
            <button
              icon-btn
              text-xl
              i-carbon-close
              @click="close"
            />
          </div>

          <!-- PDF 内容区域 -->
          <div flex-1 overflow-hidden bg-gray-100>
            <iframe
              v-if="pdfUrl"
              :src="pdfUrl + '#toolbar=0'"
              w-full
              h-full
              border-0
              title="PDF Preview"
            />
            <div v-else flex items-center justify-center h-full>
              <div text-center text-gray-500>
                <div i-carbon-document text-4xl mb-4 op="50" />
                <p>未指定 PDF 文件</p>
              </div>
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div
            flex
            items-center
            justify-end
            gap-3
            px-4
            py-3
            border-t
            border-gray-200
            bg-gray-50
          >
            <a
              v-if="pdfUrl"
              :href="pdfUrl"
              target="_blank"
              download
              btn-secondary
              flex
              items-center
              gap-2
            >
              <div i-carbon-download />
              下载 PDF
            </a>
            <button btn @click="close">
              关闭
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
