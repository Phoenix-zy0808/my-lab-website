<script setup lang="ts">
import type { NewsItem, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'ProgressPage',
})

// SEO Meta
useSeoMeta({
  title: '研究进展',
  description: '了解实验室的最新研究进展和学术动态',
})

const config = ref<SiteConfig | null>(null)
const news = ref<NewsItem[]>([])

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

// 加载新闻数据
async function loadNews() {
  try {
    const res = await fetch('/data/progress.json')
    news.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load news:', error)
  }
}

onMounted(() => {
  loadConfig()
  loadNews()
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
    <div class="mx-auto px-4 py-12 max-w-4xl lg:px-8 sm:px-6">
      <!-- 新闻列表 -->
      <div v-if="news.length > 0" class="space-y-4">
        <div
          v-for="item in news"
          :key="item.id"
          class="py-4 border-b border-gray-100 last:border-0"
        >
          <div class="flex gap-3 items-start">
            <!-- 箭头图标 -->
            <div
              class="text-secondary mt-1 rounded-full flex flex-shrink-0 h-5 w-5 items-center justify-center"
            >
              <div i-carbon-caret-right text-sm />
            </div>

            <!-- 内容 -->
            <div class="flex-1 min-w-0">
              <div class="flex gap-4 items-start justify-between">
                <h3 class="text-base text-gray-800 font-semibold">
                  {{ item.title }}
                </h3>
                <span class="text-sm text-gray-500 flex-shrink-0">
                  {{ item.date }}
                </span>
              </div>
              <p v-if="item.summary" class="text-sm text-gray-600 leading-relaxed mt-2">
                {{ item.summary }}
              </p>
              <div v-if="item.category" class="mt-2">
                <span

                  bg="oklch(65% 0.045 200.5)/10"
                  text-xs text-secondary px-2 py-1 rounded
                >
                  {{ item.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else py-12 text-center>
        <div i-carbon-calendar text-6xl text-gray-300 mb-4 />
        <p text-gray-500>
          暂无新闻
        </p>
      </div>
    </div>
  </div>
</template>
