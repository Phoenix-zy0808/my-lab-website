<script setup lang="ts">
import type { SiteConfig, TeamMember } from '~/types'
import { useRouter } from 'vue-router'
import { useSeoMeta } from '~/composables/useSeoMeta'

const route = useRoute()
const router = useRouter()

// SEO Meta
useSeoMeta({
  title: '本科生简历',
  description: '本科生详细信息',
})

const config = ref<SiteConfig | null>(null)
const member = ref<TeamMember | null>(null)
const isLoading = ref(true)

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

// 加载成员数据
async function loadMember() {
  isLoading.value = true
  try {
    const res = await fetch('/data/team.json')
    const data = await res.json()

    // 从 undergraduate 数组中查找
    const undergraduates = data.undergraduate || []

    // 提取实际 id（去掉 'undergraduate-' 前缀）
    const id = (route.params.id as string).replace('undergraduate-', '')

    console.warn('加载本科生:', { fullId: route.params.id, id })

    member.value = undergraduates.find((m: TeamMember) => m.id === id) || null

    if (!member.value) {
      console.error('未找到成员:', id)
      router.push('/team')
    }
  }
  catch (error) {
    console.error('Failed to load member:', error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadConfig()
  loadMember()
})

// 返回团队页面
function goBack() {
  router.back()
}
</script>

<template>
  <div>
    <!-- Hero 区域 - 显示实验室名称 -->
    <Hero
      size="medium"
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析实验室'"
      :subtitle="config?.labNameEn || 'Laboratory for Intelligent Spectral Analysis'"
    />

    <!-- 主要内容 -->
    <div class="mx-auto px-4 py-12 max-w-5xl lg:px-8 sm:px-6">
      <div v-if="isLoading" py-12 text-center>
        <div i-carbon-circle-dash text-4xl mb-4 animate-spin />
        <p text-gray-500>
          加载中...
        </p>
      </div>

      <div v-else-if="member" class="p-8 rounded-lg bg-white shadow-lg sm:p-12">
        <!-- 姓名和日期（居中） -->
        <div class="mb-12 text-center">
          <h1 class="text-3xl text-primary font-bold mb-3">
            {{ member.name }}
          </h1>
          <p class="text-sm text-gray-500">
            {{ member.joinDate }}
          </p>
        </div>

        <!-- 教育背景 -->
        <div v-if="member.education?.length" class="mb-10">
          <h2 class="text-lg text-gray-800 font-bold mb-4">
            教育背景：
          </h2>
          <div class="space-y-2">
            <div
              v-for="(edu, index) in member.education"
              :key="index"
              class="flex gap-4 items-start"
            >
              <div class="text-sm text-gray-600 flex-shrink-0 w-36">
                {{ edu.time }}
              </div>
              <div class="text-gray-700">
                <span class="font-medium">{{ edu.school }}</span>
                <span class="text-gray-600 ml-2">
                  （{{ edu.degree }}{{ edu.major ? ` - ${edu.major}` : '' }}）
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 个人简介 -->
        <div v-if="member.bio" class="mb-10">
          <h2 class="text-lg text-gray-800 font-bold mb-4">
            个人简介：
          </h2>
          <p class="text-gray-700 leading-relaxed">
            {{ member.bio }}
          </p>
        </div>

        <!-- 研究兴趣 -->
        <div v-if="member.researchInterests?.length" class="mb-10">
          <h2 class="text-lg text-gray-800 font-bold mb-4">
            研究兴趣：
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(interest, index) in member.researchInterests"
              :key="index"
              class="text-sm text-gray-700 px-3 py-1 rounded bg-gray-100"
            >
              {{ interest }}
            </span>
          </div>
        </div>

        <!-- 联系方式 -->
        <div v-if="member.email" class="mt-6 pt-6 border-t border-gray-200">
          <h2 class="text-lg text-gray-800 font-bold mb-3">
            联系方式：
          </h2>
          <div class="text-sm text-gray-600 space-y-2">
            <div>
              邮箱：
              <a :href="`mailto:${member.email}`" class="text-primary hover:underline">
                {{ member.email }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-else py-12 text-center>
        <div i-carbon-account-off text-6xl text-gray-300 mb-4 />
        <p text-gray-500>
          未找到成员信息
        </p>
        <button btn mt-4 @click="goBack">
          返回团队页面
        </button>
      </div>
    </div>
  </div>
</template>
