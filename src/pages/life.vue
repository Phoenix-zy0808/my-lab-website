<script setup lang="ts">
import type { SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'LifePage',
})

// SEO Meta
useSeoMeta({
  title: '课题组生活',
  description: '展示实验室的学术活动、团队建设和日常生活',
})

const config = ref<SiteConfig | null>(null)

const galleryImages = [
  {
    id: 'lab-1',
    src: '/images/life/lab-environment/1.png',
    title: '实验室参观交流',
    description: '课题组成员在实验室开展现场交流',
    category: '实验环境',
    date: '2024-03',
  },
  {
    id: 'lab-2',
    src: '/images/life/lab-environment/2.png',
    title: '实验室团队合影',
    description: '成员在实验空间合影留念',
    category: '实验环境',
    date: '2024-03',
  },
  {
    id: 'lab-3',
    src: '/images/life/lab-environment/4png.png',
    title: '展会现场交流',
    description: '围绕检测系统与应用场景进行展示交流',
    category: '实验环境',
    date: '2024-03',
  },
  {
    id: 'lab-4',
    src: '/images/life/lab-environment/7.png',
    title: '仪器操作演示',
    description: '成员进行光谱检测与数据采集演示',
    category: '仪器操作',
    date: '2024-03',
  },
  {
    id: 'team-1',
    src: '/images/life/lab-environment/8.png',
    title: '合作交流合影',
    description: '项目交流后的团队合影',
    category: '团队合影',
    date: '2024-03',
  },
  {
    id: 'meeting-1',
    src: '/images/life/lab-environment/DSC00579.JPG',
    title: '项目会议讨论',
    description: '围绕项目方案开展会议讨论',
    category: '项目交流',
    date: '2024-03',
  },
  {
    id: 'meeting-2',
    src: '/images/life/lab-environment/DSC00595.JPG',
    title: '项目签约仪式',
    description: '项目合作交流与签约现场',
    category: '项目交流',
    date: '2024-03',
  },
  {
    id: 'instrument-1',
    src: '/images/life/lab-environment/DSC00625.JPG',
    title: '光谱平台操作',
    description: '成员在检测平台前进行数据处理',
    category: '仪器操作',
    date: '2024-03',
  },
  {
    id: 'instrument-2',
    src: '/images/life/lab-environment/DSC00633.JPG',
    title: '检测数据讲解',
    description: '围绕仪器界面与检测结果进行讲解',
    category: '仪器操作',
    date: '2024-03',
  },
  {
    id: 'visit-1',
    src: '/images/life/lab-environment/IMG_20240330_151157.jpg',
    title: '实验室展厅参观',
    description: '参观实验室展厅与成果展示空间',
    category: '实验环境',
    date: '2024-03',
  },
  {
    id: 'meeting-4',
    src: '/images/life/lab-environment/IMG_20240330_160337_edit_148768137653925.jpg',
    title: '交流汇报现场',
    description: '围绕研究进展与系统应用进行汇报交流',
    category: '项目交流',
    date: '2024-03',
  },
]

const categories = ['全部', '实验环境', '仪器操作', '项目交流', '团队合影']
const selectedCategory = ref<string>('全部')

// 懒加载状态管理
interface LazyImageState {
  isLoaded: boolean
  isVisible: boolean
}

const imageStates = reactive<Record<string, LazyImageState>>({})

// 初始化图片状态
galleryImages.forEach((img) => {
  imageStates[img.id] = {
    isLoaded: false,
    isVisible: false,
  }
})

// Intersection Observer
let observer: IntersectionObserver | null = null

function initObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // 降级处理：全部标记为可见
    Object.keys(imageStates).forEach((id) => {
      imageStates[id].isVisible = true
    })
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('data-image-id')
        if (id && entry.isIntersecting) {
          imageStates[id].isVisible = true
          observer?.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: '100px',
      threshold: 0,
    },
  )
}

function registerImage(el: HTMLImageElement | null, _id: string) {
  if (!el || !observer)
    return
  observer.observe(el)
}

// 加载站点配置
async function loadConfig() {
  try {
    const res = await fetch('/data/site-config.json')
    config.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load site config:', error)
  }
}

onMounted(() => {
  loadConfig()
  initObserver()
})

onUnmounted(() => {
  observer?.disconnect()
})

const filteredImages = computed(() => {
  if (selectedCategory.value === '全部') {
    return galleryImages
  }
  return galleryImages.filter(img => img.category === selectedCategory.value)
})

// 监听分类变化，重新观察新显示的图片
watch(
  () => filteredImages.value.length,
  () => {
    // 分类变化后，重新初始化观察
    setTimeout(() => {
      filteredImages.value.forEach((img) => {
        const el = document.querySelector(`[data-image-id="${img.id}"]`) as HTMLImageElement
        if (el && observer && !imageStates[img.id].isVisible) {
          observer.observe(el)
        }
      })
    }, 0)
  },
)
</script>

<template>
  <div>
    <!-- 页面头部 -->
    <Hero
      size="medium"
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析实验室'"
      :subtitle="config?.labNameEn || 'Laboratory for Intelligent Spectral Analysis'"
      :description="config?.description"
    />

    <!-- 主要内容 -->
    <div page-container py-12>
      <!-- 分类筛选 -->
      <div class="mb-8">
        <Tabs
          v-model="selectedCategory"
          :options="categories.map(c => ({ key: c, label: c }))"
        />
      </div>

      <!-- 图片画廊 -->
      <div v-if="filteredImages.length > 0" gap-4 grid grid-cols-2 md:grid-cols-3>
        <div
          v-for="image in filteredImages"
          :key="image.id"
          class="group rounded-lg aspect-square shadow-lg relative overflow-hidden"
        >
          <!-- 使用原生 loading="lazy" + Intersection Observer -->
          <img
            :ref="(el) => registerImage(el as HTMLImageElement, image.id)"
            :data-image-id="image.id"
            :src="imageStates[image.id].isVisible ? image.src : ''"
            :alt="image.title"

            loading="lazy"
            decoding="async"

            h-full w-full transition duration-300 object-cover group-hover:scale-110
            :class="{ 'opacity-0': !imageStates[image.id].isLoaded }"
            @load="imageStates[image.id].isLoaded = true"
            @error="(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E暂无图片%3C/text%3E%3C/svg%3E'
              imageStates[image.id].isLoaded = true
            }"
          >
          <!-- 加载占位 -->
          <div
            v-if="!imageStates[image.id].isLoaded"
            class="bg-gray-100 flex items-center inset-0 justify-center absolute"
          >
            <div class="i-carbon-image text-3xl text-gray-300" />
          </div>

          <!-- 遮罩层 -->
          <div
            class="opacity-0 transition duration-300 inset-0 absolute from-black/80 to-transparent via-black/20 bg-gradient-to-t group-hover:opacity-100"
          >
            <div class="text-white p-4 bottom-0 left-0 right-0 absolute">
              <h3 class="text-lg font-semibold">
                {{ image.title }}
              </h3>
              <p class="text-sm text-gray-300">
                {{ image.description }}
              </p>
              <div class="text-xs text-gray-400 mt-2 flex gap-2 items-center">
                <span>{{ image.category }}</span>
                <span>•</span>
                <span>{{ image.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else py-12 text-center>
        <div i-carbon-image text-6xl text-gray-300 mb-4 />
        <p text-gray-500>
          暂无图片
        </p>
      </div>
    </div>
  </div>
</template>
