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
  } catch (error) {
    console.error('Failed to load site config:', error)
  }
}

// 加载新闻数据
async function loadNews() {
  try {
    const res = await fetch('/data/progress.json')
    news.value = await res.json()
  } catch (error) {
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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 新闻列表 -->
      <div v-if="news.length > 0" class="space-y-4">
        <div
          v-for="item in news"
          :key="item.id"
          class="py-4 border-b border-gray-100 last:border-0"
        >
          <div class="flex items-start gap-3">
            <!-- 箭头图标 -->
            <div
              class="w-5 h-5 rounded-full flex items-center justify-center text-secondary flex-shrink-0 mt-1"
            >
              <div i-carbon-caret-right text-sm />
            </div>

            <!-- 内容 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <h3 class="text-base font-semibold text-gray-800">
                  {{ item.title }}
                </h3>
                <span class="text-sm text-gray-500 flex-shrink-0">
                  {{ item.date }}
                </span>
              </div>
              <p v-if="item.summary" class="text-sm text-gray-600 mt-2 leading-relaxed">
                {{ item.summary }}
              </p>
              <div v-if="item.category" class="mt-2">
                <span
                  text-xs
                  px-2
                  py-1
                  rounded
                  bg="oklch(65% 0.045 200.5)/10"
                  text-secondary
                >
                  {{ item.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else text-center py-12>
        <div i-carbon-calendar text-6xl text-gray-300 mb-4 />
        <p text-gray-500>暂无新闻</p>
      </div>
    </div>

    <TheFooter />
  </div>
</template>
