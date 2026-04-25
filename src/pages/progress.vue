<script setup lang="ts">
import type { NewsItem, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'ProgressPage',
})

useSeoMeta({
  title: '研究进展',
  description: '聚焦光谱分析、智能检测、算法建模与交叉应用，持续推进面向实际问题的研究工作。',
})

const config = ref<SiteConfig | null>(null)
const updates = ref<NewsItem[]>([])

const progressHighlights = [
  {
    title: '光谱智能分析方法持续深化',
    summary: '课题组围绕拉曼光谱及相关复杂光谱数据分析，持续开展信号降噪、特征提取、模式识别与弱差异信息解析研究，形成了面向复杂体系光谱数据的智能分析方法积累，并在论文、专利和软件成果中得到体现。',
    keywords: ['拉曼光谱', '智能分析', '信号解析'],
  },
  {
    title: '光谱检测系统与智能化平台建设稳步推进',
    summary: '围绕检测装置、分析流程和数据处理平台，课题组持续推进检测系统与分析软件的智能化研究，推动光谱检测技术在实际应用场景中的系统化落地。',
    keywords: ['检测系统', '分析平台', '应用落地'],
  },
  {
    title: '人工智能与优化算法应用不断拓展',
    summary: '课题组积极将机器学习、深度学习与智能优化算法引入复杂科研问题求解，在光谱分析、参数优化、组合建模和多任务学习等方向形成了一批具有代表性的研究成果。',
    keywords: ['机器学习', '优化建模', '算法应用'],
  },
  {
    title: '学生科研创新与交叉应用成果持续涌现',
    summary: '依托课题组的交叉研究平台，学生在智能检测、多模态交互、机器人、三维重建、创新竞赛和知识产权成果等方面持续取得进展，体现了课题组在科研训练和成果培育方面的特色。',
    keywords: ['学生科研', '交叉应用', '创新成果'],
  },
]

async function loadConfig() {
  try {
    const res = await fetch('/data/site-config.json')
    config.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load site config:', error)
  }
}

async function loadProgress() {
  try {
    const res = await fetch('/data/progress.json')
    updates.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load progress data:', error)
  }
}

onMounted(() => {
  loadConfig()
  loadProgress()
})
</script>

<template>
  <div>
    <Hero
      size="medium"
      :background="config?.heroImage"
      title="智能光谱分析与材料信息课题组"
      subtitle="Intelligent Spectral Analysis and Materials Informatics Group"
      description="聚焦光谱信号解析、材料信息建模与智能检测应用，开展交叉研究与人才培养。"
    />

    <div class="mx-auto px-4 py-12 max-w-6xl lg:px-8 sm:px-6">
      <section class="mb-10">
        <h1 class="text-3xl text-primary tracking-tight font-bold">
          研究进展
        </h1>
      </section>

      <section class="mb-16">
        <div class="mb-8">
          <h2 class="text-2xl text-gray-900 font-bold">
            研究进展概览
          </h2>
        </div>

        <div class="gap-6 grid lg:grid-cols-2">
          <article
            v-for="(item, index) in progressHighlights"
            :key="item.title"
            class="px-6 py-6 border border-gray-200 rounded-2xl bg-white shadow-sm"
          >
            <div class="mb-4 flex gap-3 items-center">
              <span class="text-[11px] text-secondary tracking-[0.2em] font-semibold">
                进展 {{ String(index + 1).padStart(2, '0') }}
              </span>
              <div class="bg-gray-200 flex-1 h-px" />
            </div>

            <h3 class="text-2xl text-gray-900 leading-8 font-semibold">
              {{ item.title }}
            </h3>

            <p class="text-gray-700 leading-8 mt-4">
              {{ item.summary }}
            </p>

            <div class="mt-6 pt-1 flex flex-wrap gap-2">
              <span
                v-for="keyword in item.keywords"
                :key="keyword"
                class="text-xs text-gray-700 px-3 py-1.5 border border-gray-200 rounded-full bg-gray-50"
              >
                {{ keyword }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <section class="pt-10 border-t border-gray-200">
        <div class="mb-8">
          <h2 class="text-2xl text-gray-900 font-bold">
            近期动态
          </h2>
          <p class="text-gray-600 mt-2">
            近期研究工作与成果简讯，仅作信息展示，不设置空详情页跳转。
          </p>
        </div>

        <div v-if="updates.length > 0" class="space-y-8">
          <article
            v-for="item in updates"
            :key="item.id"
            class="pb-8 border-b border-gray-100 gap-4 grid last:pb-0 last:border-b-0 md:grid-cols-[120px_1fr]"
          >
            <div class="text-sm text-gray-500 font-medium md:pt-1">
              {{ item.date }}
            </div>

            <div>
              <div class="flex flex-wrap gap-2 items-center">
                <span
                  v-if="item.category"
                  class="text-xs text-secondary px-2.5 py-1 rounded-full bg-secondary/10"
                >
                  {{ item.category }}
                </span>
              </div>

              <h3 class="text-lg text-gray-900 leading-7 font-semibold mt-3">
                {{ item.title }}
              </h3>

              <p v-if="item.summary" class="text-sm text-gray-600 leading-7 mt-2">
                {{ item.summary }}
              </p>
            </div>
          </article>
        </div>

        <div v-else py-12 text-center>
          <div i-carbon-calendar text-6xl text-gray-300 mb-4 />
          <p text-gray-500>
            暂无研究进展信息
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
