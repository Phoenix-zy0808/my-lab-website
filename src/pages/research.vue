<script setup lang="ts">
import type { ResearchDirection, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'ResearchPage',
})

useSeoMeta({
  title: '研究方向',
  description: '围绕智能光谱分析、光谱检测系统、算法建模与交叉智能应用，开展面向实际问题的研究。',
})

const config = ref<SiteConfig | null>(null)
const directions = ref<ResearchDirection[]>([])

async function loadConfig() {
  try {
    const res = await fetch('/data/site-config.json')
    config.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load site config:', error)
  }
}

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
    <Hero
      size="medium"
      :background="config?.heroImage"
      title="智能光谱分析与材料信息课题组"
      subtitle="Intelligent Spectral Analysis and Materials Informatics Group"
      description="聚焦光谱信号解析、材料信息建模与智能检测应用，开展交叉研究与人才培养。"
    />

    <div class="mx-auto px-4 py-12 max-w-6xl lg:px-8 sm:px-6">
      <section class="mb-12 flex flex-wrap gap-4 items-end justify-between">
        <h1 class="text-3xl text-primary tracking-tight font-bold">
          研究方向
        </h1>
        <p class="text-sm text-gray-600 max-w-xl md:text-right">
          四个方向分别对应方法研究、系统实现、算法建模与交叉应用。
        </p>
      </section>

      <section class="space-y-14">
        <article
          v-for="(direction, index) in directions"
          :key="direction.id"
          class="pb-12 border-b border-gray-200 relative last:pb-0 last:border-b-0"
        >
          <div class="mb-4 flex gap-3 items-center">
            <span class="text-[11px] text-secondary tracking-[0.24em] font-semibold">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div class="bg-gray-200 flex-1 h-px" />
          </div>

          <div
            class="max-w-4xl"
            :class="index % 2 === 1 ? 'ml-auto' : ''"
          >
            <h2 class="text-3xl text-gray-900 leading-tight font-bold">
              {{ direction.title }}
            </h2>

            <p
              v-if="direction.highlight"
              class="text-base text-secondary leading-7 font-medium mt-3"
            >
              {{ direction.highlight }}
            </p>

            <p class="text-gray-700 leading-8 mt-5">
              {{ direction.summary }}
            </p>
          </div>

          <div
            class="mt-8 gap-6 grid lg:grid-cols-2"
            :class="index % 2 === 1 ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''"
          >
            <div class="px-6 py-5 border border-gray-200 rounded-2xl bg-gray-50">
              <h3 class="text-lg text-gray-900 font-semibold mb-4">
                研究重点
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="item in direction.focus"
                  :key="item"
                  class="text-gray-700 leading-7 flex gap-3 items-start"
                >
                  <span class="mt-2 rounded-full bg-secondary flex-shrink-0 h-1.5 w-1.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="px-6 py-5 border border-gray-300 rounded-2xl bg-white shadow-sm">
              <h3 class="text-lg text-gray-900 font-semibold mb-4">
                应用场景
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="item in direction.applications"
                  :key="item"
                  class="text-gray-700 leading-7 flex gap-3 items-start"
                >
                  <span class="mt-2 rounded-full bg-primary flex-shrink-0 h-1.5 w-1.5" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="keyword in direction.keywords"
              :key="keyword"
              class="text-xs text-gray-700 px-3 py-1.5 border border-gray-200 rounded-full bg-white"
            >
              {{ keyword }}
            </span>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>
