<script setup lang="ts">
import type { NewsItem, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'IndexPage',
})

// SEO Meta
useSeoMeta({
  title: '首页',
  description: '拉曼光谱实验室 - 致力于拉曼光谱技术的基础研究与应用开发',
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

// 加载最新新闻
async function loadNews() {
  try {
    const res = await fetch('/data/news.json')
    const data = await res.json()
    news.value = data.slice(0, 3) // 只显示最新 3 条
  }
  catch (error) {
    console.error('Failed to load news:', error)
  }
}

onMounted(() => {
  loadConfig()
  loadNews()
})

// 导航卡片数据
const navCards = [
  {
    title: '课题组简介',
    description: '了解实验室的发展历程、研究方向和文化',
    icon: 'i-carbon-group',
    link: '/team',
    image: '/images/cards/about1.jpg',
  },
  {
    title: '团队成员',
    description: '认识我们的教授、研究人员和学生',
    icon: 'i-carbon-account',
    link: '/team',
    image: '/images/cards/team1.jpg',
  },
  {
    title: '研究方向',
    description: '探索我们在拉曼光谱领域的前沿研究',
    icon: 'i-carbon-microscope',
    link: '/research',
    image: '/images/cards/research1.jpg',
  },
]
</script>

<template>
  <div>
    <!-- Hero 区域 -->
    <Hero
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析实验室'"
      :subtitle="config?.labNameEn"
      :description="config?.description"
    />

    <!-- 悬浮导航卡片 -->
    <div class="relative z-10 -mt-16 lg:-mt-24 sm:-mt-20">
      <div class="mx-auto px-4 max-w-7xl lg:px-8 sm:px-6">
        <div gap-4 grid grid-cols-1 sm:gap-6 lg:grid-cols-3 sm:grid-cols-2>
          <Card
            v-for="card in navCards"
            :key="card.title"
            :title="card.title"
            :description="card.description"
            :icon="card.icon"
            :image="card.image"
            :link="card.link"
          />
        </div>
      </div>
    </div>

    <!-- 最新研究进展 -->
    <section class="mx-auto px-4 py-12 max-w-7xl lg:px-8 sm:px-6">
      <h2 section-title>
        最新研究进展
      </h2>
      <p section-subtitle>
        Latest Research News
      </p>

      <div gap-6 grid grid-cols-1 md:grid-cols-3>
        <div
          v-for="item in news"
          :key="item.id"
          card-border
          class="group transition-all duration-300 hover:border-secondary/50 hover:shadow-xl hover:-translate-y-1"
        >
          <!-- 日期标签 -->
          <div mb-3 flex items-center justify-between>
            <span

              bg="oklch(65% 0.045 200.5)/10"
              text-xs text-secondary px-2 py-1 rounded
            >
              {{ item.category || '实验室动态' }}
            </span>
            <span text-xs text-gray-500>{{ item.date }}</span>
          </div>

          <!-- 标题 -->
          <h3 text-base text-primary font-semibold mb-2 transition-colors line-clamp-2 group-hover:text-secondary>
            {{ item.title }}
          </h3>

          <!-- 摘要 -->
          <p v-if="item.summary" text-sm text-gray-600 leading-relaxed line-clamp-3>
            {{ item.summary }}
          </p>

          <!-- 链接 -->
          <div
            v-if="item.link"

            text-sm text-secondary font-medium mt-4 flex gap-2 items-center
          >
            <span>阅读全文</span>
            <div i-carbon-arrow-right transition duration-200 group-hover:translate-x-1 />
          </div>
        </div>
      </div>

      <div mt-8 text-center>
        <RouterLink to="/progress" btn>
          查看更多
        </RouterLink>
      </div>
    </section>
  </div>
</template>
