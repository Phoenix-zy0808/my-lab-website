<script setup lang="ts">
import type { ResearchDirection, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'ResearchPage',
})

// SEO Meta
useSeoMeta({
  title: '研究方向',
  description: '探索我们在拉曼光谱领域的前沿研究方向',
})

const config = ref<SiteConfig | null>(null)
const directions = ref<ResearchDirection[]>([])

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

// 加载研究方向数据
async function loadResearch() {
  try {
    const res = await fetch('/data/research.json')
    directions.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load research directions:', error)
  }
}

onMounted(() => {
  loadConfig()
  loadResearch()
})
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
    <div class="mx-auto px-4 py-12 max-w-5xl lg:px-8 sm:px-6">
      <div space-y-12>
        <div
          v-for="(dir, index) in directions"
          :key="dir.id"
        >
          <!-- 方向标题 -->
          <div class="mb-6">
            <h2 class="text-2xl text-primary font-bold mb-2">
              {{ index + 1 }}. {{ dir.title }}
            </h2>
          </div>

          <!-- 方向描述 -->
          <p class="text-gray-700 leading-relaxed mb-6">
            {{ dir.description }}
          </p>

          <!-- 关键词 -->
          <div v-if="dir.keywords?.length" class="mb-8 flex flex-wrap gap-2">
            <span
              v-for="keyword in dir.keywords"
              :key="keyword"

              bg="oklch(65% 0.045 200.5)/10"
              text-xs text-secondary px-3 py-1 rounded-full
            >
              {{ keyword }}
            </span>
          </div>

          <!-- 研究进展 -->
          <div v-if="dir.progress?.length" class="mt-8">
            <h3 class="text-lg text-gray-800 font-semibold mb-4 flex gap-2 items-center">
              <div i-carbon-time text-lg />
              研究进展
            </h3>

            <div class="space-y-8">
              <div
                v-for="progress in dir.progress"
                :key="progress.id"
              >
                <!-- 进展标题和日期 -->
                <div class="mb-3 flex gap-3 items-center">
                  <h4 class="text-base text-gray-800 font-semibold">
                    {{ progress.title }}
                  </h4>
                  <span
                    v-if="progress.date"

                    text-xs text-gray-500 px-2 py-1 rounded bg-gray-100
                  >
                    {{ progress.date }}
                  </span>
                </div>

                <!-- 进展描述 -->
                <p class="text-sm text-gray-600 leading-relaxed mb-4">
                  {{ progress.description }}
                </p>

                <!-- 图片展示 -->
                <div v-if="progress.images?.length" class="gap-4 grid grid-cols-1 sm:grid-cols-2">
                  <div
                    v-for="(img, imgIndex) in progress.images"
                    :key="imgIndex"
                    class="rounded-lg shadow-md overflow-hidden"
                  >
                    <img
                      :src="img.src"
                      :alt="img.caption"

                      h-48 w-full object-cover
                      @error="(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/gallery/placeholder.svg'
                      }"
                    >
                    <p class="text-xs text-gray-500 py-2 text-center bg-gray-50">
                      {{ img.caption }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
