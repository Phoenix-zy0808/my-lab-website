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
  } catch (error) {
    console.error('Failed to load site config:', error)
  }
}

// 加载研究方向数据
async function loadResearch() {
  try {
    const res = await fetch('/data/research.json')
    directions.value = await res.json()
  } catch (error) {
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
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div space-y-12>
        <div
          v-for="(dir, index) in directions"
          :key="dir.id"
        >
          <!-- 方向标题 -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-primary mb-2">
              {{ index + 1 }}. {{ dir.title }}
            </h2>
          </div>

          <!-- 方向描述 -->
          <p class="text-gray-700 leading-relaxed mb-6">
            {{ dir.description }}
          </p>

          <!-- 关键词 -->
          <div v-if="dir.keywords?.length" class="flex flex-wrap gap-2 mb-8">
            <span
              v-for="keyword in dir.keywords"
              :key="keyword"
              text-xs
              px-3
              py-1
              rounded-full
              bg="oklch(65% 0.045 200.5)/10"
              text-secondary
            >
              {{ keyword }}
            </span>
          </div>

          <!-- 研究进展 -->
          <div v-if="dir.progress?.length" class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div i-carbon-time text-lg />
              研究进展
            </h3>

            <div class="space-y-8">
              <div
                v-for="progress in dir.progress"
                :key="progress.id"
              >
                <!-- 进展标题和日期 -->
                <div class="flex items-center gap-3 mb-3">
                  <h4 class="text-base font-semibold text-gray-800">
                    {{ progress.title }}
                  </h4>
                  <span
                    v-if="progress.date"
                    text-xs
                    px-2
                    py-1
                    rounded
                    bg-gray-100
                    text-gray-500
                  >
                    {{ progress.date }}
                  </span>
                </div>

                <!-- 进展描述 -->
                <p class="text-sm text-gray-600 leading-relaxed mb-4">
                  {{ progress.description }}
                </p>

                <!-- 图片展示 -->
                <div v-if="progress.images?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    v-for="(img, imgIndex) in progress.images"
                    :key="imgIndex"
                    class="rounded-lg overflow-hidden shadow-md"
                  >
                    <img
                      :src="img.src"
                      :alt="img.caption"
                      w-full
                      h-48
                      object-cover
                      @error="(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/gallery/placeholder.svg'
                      }"
                    />
                    <p class="text-xs text-gray-500 text-center py-2 bg-gray-50">
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
