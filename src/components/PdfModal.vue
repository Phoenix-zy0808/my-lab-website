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

// 在新窗口打开 PDF
function openInNewWindow() {
  if (props.pdfUrl) {
    const normalizedUrl = props.pdfUrl.startsWith('/') ? props.pdfUrl : `/${props.pdfUrl}`
    // 使用 encodeURI 编码中文路径
    const encodedUrl = encodeURI(normalizedUrl)
    window.open(encodedUrl, '_blank', 'noopener,noreferrer')
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
          sm:w-[500px]
          sm:max-w-[90vw]
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
            px-6
            py-4
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

          <!-- PDF 内容区域 - 改为提示信息 -->
          <div px-6 py-8>
            <div text-center>
              <div i-carbon-document text-6xl mb-4 op="50" />
              <p text-gray-600 mb-2>
                {{ title || 'PDF 文件' }}
              </p>
              <p text-sm text-gray-500>
                由于浏览器安全限制，请点击下方按钮在新窗口打开 PDF
              </p>
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div
            flex
            items-center
            justify-end
            gap-3
            px-6
            py-4
            border-t
            border-gray-200
            bg-gray-50
          >
            <button
              btn-secondary
              flex
              items-center
              gap-2
              @click="openInNewWindow"
            >
              <div i-carbon-launch />
              在新窗口打开
            </button>
            <button btn @click="close">
              关闭
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
