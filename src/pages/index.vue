<script setup lang="ts">
import type { NewsItem, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'IndexPage',
})

useSeoMeta({
  title: '首页',
  description: '聚焦光谱信号解析、材料信息建模与智能检测应用，开展交叉研究与人才培养。',
})

const config = ref<SiteConfig | null>(null)
const news = ref<NewsItem[]>([])

async function loadConfig() {
  try {
    const res = await fetch('/data/site-config.json')
    config.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load site config:', error)
  }
}

async function loadNews() {
  try {
    const res = await fetch('/data/news.json')
    const data = await res.json()
    news.value = data.slice(0, 3)
  }
  catch (error) {
    console.error('Failed to load news:', error)
  }
}

onMounted(() => {
  loadConfig()
  loadNews()
})

const navCards = [
  {
    title: '智能光谱分析',
    description: '围绕拉曼及相关光谱数据开展信号解析、降噪与识别方法研究。',
    icon: 'i-carbon-group',
    link: '/research',
    image: '/images/cards/about1.jpg',
  },
  {
    title: '材料信息建模',
    description: '结合实验数据、计算模拟与机器学习方法开展材料性能建模。',
    icon: 'i-carbon-account',
    link: '/research',
    image: '/images/cards/team1.jpg',
  },
  {
    title: '智能检测应用',
    description: '面向检测场景推进算法、系统与应用验证的协同研究。',
    icon: 'i-carbon-microscope',
    link: '/research',
    image: '/images/cards/research1.jpg',
  },
]
</script>

<template>
  <div>
    <Hero
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析与材料信息课题组'"
      :subtitle="config?.labNameEn || 'Intelligent Spectral Analysis and Materials Informatics Group'"
      :description="config?.description || '聚焦光谱信号解析、材料信息建模与智能检测应用，开展交叉研究与人才培养。'"
    />

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

    <section class="mx-auto px-4 py-12 max-w-7xl lg:px-8 sm:px-6">
      <h2 section-title>
        最新研究进展
      </h2>
      <p section-subtitle>
        Recent Updates
      </p>

      <div gap-6 grid grid-cols-1 md:grid-cols-3>
        <div
          v-for="item in news"
          :key="item.id"
          card-border
          class="group transition-all duration-300 hover:border-secondary/50 hover:shadow-xl hover:-translate-y-1"
        >
          <div mb-3 flex items-center justify-between>
            <span bg="oklch(65% 0.045 200.5)/10" text-xs text-secondary px-2 py-1 rounded>
              {{ item.category || '课题组动态' }}
            </span>
            <span text-xs text-gray-500>{{ item.date }}</span>
          </div>

          <h3 text-base text-primary font-semibold mb-2 transition-colors line-clamp-2 group-hover:text-secondary>
            {{ item.title }}
          </h3>

          <p v-if="item.summary" text-sm text-gray-600 leading-relaxed line-clamp-3>
            {{ item.summary }}
          </p>

          <div v-if="item.link" text-sm text-secondary font-medium mt-4 flex gap-2 items-center>
            <span>查看全文</span>
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
