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

// 图片数据
const galleryImages = [
  // 实验环境（4 张）
  {
    id: 'lab-1',
    src: '/images/life/lab-environment/raman-spectrometer.jpg',
    title: '拉曼光谱仪',
    description: '共聚焦拉曼光谱仪',
    category: '实验环境',
    date: '2024-01',
  },
  {
    id: 'lab-2',
    src: '/images/life/lab-environment/lab-bench.jpg',
    title: '实验台',
    description: '光学实验平台',
    category: '实验环境',
    date: '2024-01',
  },
  {
    id: 'lab-3',
    src: '/images/life/lab-environment/microscope.jpg',
    title: '显微镜',
    description: '高分辨率显微镜',
    category: '实验环境',
    date: '2024-02',
  },
  {
    id: 'lab-4',
    src: '/images/life/lab-environment/optical-table.jpg',
    title: '光学平台',
    description: '隔振光学平台',
    category: '实验环境',
    date: '2024-02',
  },

  // 学术活动（4 张）
  {
    id: 'academic-1',
    src: '/images/life/academic-events/group-meeting-2024-01.jpg',
    title: '组会讨论',
    description: '每周学术研讨会',
    category: '学术活动',
    date: '2024-01',
  },
  {
    id: 'academic-2',
    src: '/images/life/academic-events/group-meeting-2024-03.jpg',
    title: '组会报告',
    description: '学生学术报告',
    category: '学术活动',
    date: '2024-03',
  },
  {
    id: 'academic-3',
    src: '/images/life/academic-events/academic-conference-shanghai.jpg',
    title: '学术会议',
    description: '参加上海拉曼光谱会议',
    category: '学术活动',
    date: '2024-05',
  },
  {
    id: 'academic-4',
    src: '/images/life/academic-events/poster-presentation.jpg',
    title: '海报展示',
    description: '国际会议海报展示',
    category: '学术活动',
    date: '2024-06',
  },

  // 团队活动（4 张）
  {
    id: 'team-1',
    src: '/images/life/team-activities/team-building-2024-spring.jpg',
    title: '春游团建',
    description: '2024 年春季团建活动',
    category: '团队活动',
    date: '2024-04',
  },
  {
    id: 'team-2',
    src: '/images/life/team-activities/team-building-2024-autumn.jpg',
    title: '秋游团建',
    description: '2024 年秋季团建活动',
    category: '团队活动',
    date: '2024-10',
  },
  {
    id: 'team-3',
    src: '/images/life/team-activities/birthday-party.jpg',
    title: '生日派对',
    description: '实验室成员生日庆祝',
    category: '团队活动',
    date: '2024-07',
  },
  {
    id: 'team-4',
    src: '/images/life/team-activities/sports-meet.jpg',
    title: '运动会',
    description: '校运动会',
    category: '团队活动',
    date: '2024-09',
  },

  // 荣誉时刻（4 张）
  {
    id: 'honor-1',
    src: '/images/life/honors/award-ceremony-2024.jpg',
    title: '颁奖典礼',
    description: '2024 年度颁奖典礼',
    category: '荣誉时刻',
    date: '2024-12',
  },
  {
    id: 'honor-2',
    src: '/images/life/honors/scholarship-award.jpg',
    title: '奖学金颁奖',
    description: '国家奖学金颁奖',
    category: '荣誉时刻',
    date: '2024-11',
  },
  {
    id: 'honor-3',
    src: '/images/life/honors/competition-award.jpg',
    title: '竞赛获奖',
    description: '全国大学生竞赛获奖',
    category: '荣誉时刻',
    date: '2024-08',
  },
  {
    id: 'honor-4',
    src: '/images/life/honors/honorary-certificate.jpg',
    title: '荣誉证书',
    description: '优秀研究生荣誉',
    category: '荣誉时刻',
    date: '2024-06',
  },
]

const categories = ['全部', '实验环境', '学术活动', '团队活动', '荣誉时刻']
const selectedCategory = ref<string>('全部')

// 加载站点配置
async function loadConfig() {
  try {
    const res = await fetch('/data/site-config.json')
    config.value = await res.json()
  } catch (error) {
    console.error('Failed to load site config:', error)
  }
}

onMounted(() => {
  loadConfig()
})

const filteredImages = computed(() => {
  if (selectedCategory.value === '全部') {
    return galleryImages
  }
  return galleryImages.filter(img => img.category === selectedCategory.value)
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
    <div page-container py-12>
      <!-- 分类筛选 -->
      <div class="mb-8">
        <Tabs
          v-model="selectedCategory"
          :options="categories.map(c => ({ key: c, label: c }))"
        />
      </div>

      <!-- 图片画廊 -->
      <div v-if="filteredImages.length > 0" grid grid-cols-2 md:grid-cols-3 gap-4>
        <div
          v-for="image in filteredImages"
          :key="image.id"
          class="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
        >
          <img
            :src="image.src"
            :alt="image.title"
            w-full
            h-full
            object-cover
            transition
            duration-300
            group-hover:scale-110
            @error="(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E暂无图片%3C/text%3E%3C/svg%3E'
            }"
          />

          <!-- 遮罩层 -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"
          >
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 class="font-semibold text-lg">{{ image.title }}</h3>
              <p class="text-sm text-gray-300">{{ image.description }}</p>
              <div class="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span>{{ image.category }}</span>
                <span>•</span>
                <span>{{ image.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else text-center py-12>
        <div i-carbon-image text-6xl text-gray-300 mb-4 />
        <p text-gray-500>暂无图片</p>
      </div>
    </div>
  </div>
</template>
