<script setup lang="ts">
import type { SiteConfig, TeamMember } from '~/types'
import { useRouter } from 'vue-router'
import { useSeoMeta } from '~/composables/useSeoMeta'

const route = useRoute('/team/[id]')
const router = useRouter()

// SEO Meta
useSeoMeta({
  title: '团队成员详情',
  description: '团队成员详细信息',
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

    // 在所有角色中查找
    const allMembers = [
      ...(data.pi || []),
      ...(data.research_assistant || []),
      ...(data.master_student || []),
      ...(data.undergraduate || []),
      ...(data.graduated_master || []),
      ...(data.graduated_undergraduate || []),
    ]

    member.value = allMembers.find((m: TeamMember) => m.id === route.params.id) || null

    if (!member.value) {
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

// 返回按钮
function goBack() {
  router.back()
}

// 角色映射
const roleMap: Record<TeamMember['role'], { label: string, color: string }> = {
  pi: { label: 'PI', color: 'bg-primary text-white' },
  research_assistant: { label: '科研助理', color: 'bg-accent text-white' },
  master_student: { label: '硕士生', color: 'bg-purple-100 text-purple-700' },
  undergraduate: { label: '本科生', color: 'bg-indigo-100 text-indigo-700' },
  graduated_master: { label: '已毕业硕士', color: 'bg-gray-100 text-gray-700' },
  graduated_undergraduate: { label: '已毕业本科', color: 'bg-gray-50 text-gray-600' },
}
</script>

<template>
  <div>
    <!-- 页面头部 -->
    <Hero
      size="medium"
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析实验室'"
      :subtitle="config?.labNameEn || 'Laboratory for Intelligent Spectral Analysis'"
    />

    <!-- 主要内容 -->
    <div page-container py-12>
      <!-- 返回按钮 -->
      <button btn mb-6 @click="goBack">
        <div i-carbon-arrow-left mr-2 />
        返回
      </button>

      <div v-if="isLoading" py-12 text-center>
        <div i-carbon-circle-dash text-4xl mb-4 animate-spin />
        <p text-gray-500>
          加载中...
        </p>
      </div>

      <div v-else-if="member" class="mx-auto max-w-5xl">
        <div card>
          <!-- 头像和基本信息 -->
          <div class="mb-8 flex flex-col gap-6 items-center sm:flex-row sm:items-start">
            <!-- 头像 -->
            <div

              text-6xl text-white font-bold rounded-lg flex flex-shrink-0 h-64 w-64 shadow-lg items-center justify-center overflow-hidden from-primary to-secondary bg-gradient-to-br
            >
              <OptimizedImage
                v-if="member.photo"
                :src="member.photo"
                :alt="member.name"
                loading="lazy"
                decoding="async"

                h-full w-full object-cover
              />
              <span v-else>
                {{ member.name.charAt(0) }}
              </span>
            </div>

            <!-- 基本信息 -->
            <div class="text-center flex-1 sm:text-left">
              <h2 class="text-3xl text-primary font-bold mb-2">
                {{ member.name }}
              </h2>
              <p class="text-xl text-secondary mb-4">
                {{ member.title }}
              </p>

              <!-- 角色标签 -->
              <div class="mb-4">
                <span
                  text-sm
                  px-3
                  py-1
                  rounded-full
                  :class="roleMap[member.role].color"
                >
                  {{ roleMap[member.role].label }}
                </span>
              </div>

              <!-- 联系方式 -->
              <div text-base text-gray-600 space-y-3>
                <div v-if="member.email" flex gap-3 items-center justify-center sm:justify-start>
                  <div i-carbon-email text-xl />
                  <a :href="`mailto:${member.email}`" class="hover:text-primary">
                    {{ member.email }}
                  </a>
                </div>
                <div v-if="member.phone" flex gap-3 items-center justify-center sm:justify-start>
                  <div i-carbon-phone text-xl />
                  <span>{{ member.phone }}</span>
                </div>
                <div v-if="member.office" flex gap-3 items-center justify-center sm:justify-start>
                  <div i-carbon-location text-xl />
                  <span>{{ member.office }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 个人简介 -->
          <div v-if="member.bio" class="mb-8">
            <h3 class="text-2xl text-primary font-semibold mb-4">
              个人简介
            </h3>
            <p class="text-lg text-gray-700 leading-relaxed">
              {{ member.bio }}
            </p>
          </div>

          <!-- 荣誉 -->
          <div v-if="member.honors?.length" class="mb-8">
            <ul class="list-disc list-inside space-y-1.5">
              <li v-for="(honor, index) in member.honors" :key="index" class="text-sm text-gray-600 leading-normal">
                {{ honor }}
              </li>
            </ul>
          </div>

          <!-- 教育经历 -->
          <div v-if="member.education?.length" class="mb-8">
            <h3 class="text-2xl text-primary font-semibold mb-4">
              教育经历
            </h3>
            <div class="space-y-4">
              <div
                v-for="(edu, index) in member.education"
                :key="index"
                class="flex flex-col gap-2 sm:flex-row sm:gap-3"
              >
                <!-- 时间标签（加宽区域） -->
                <div class="flex-shrink-0 sm:w-48">
                  <span class="text-sm text-primary font-medium px-3 py-1 rounded-md bg-primary/10 inline-block whitespace-nowrap">
                    {{ edu.time }}
                  </span>
                </div>
                <!-- 学校和专业 -->
                <div class="flex-1 min-w-0">
                  <p class="text-gray-800 font-medium">
                    {{ edu.school }} - {{ edu.major }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ edu.degree }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 工作经历 -->
          <div v-if="member.workExperience?.length" class="mb-8">
            <h3 class="text-2xl text-primary font-semibold mb-4">
              工作经历
            </h3>
            <div class="space-y-4">
              <div
                v-for="(work, index) in member.workExperience"
                :key="index"
                class="flex flex-col gap-2 sm:flex-row sm:gap-3"
              >
                <!-- 时间标签（加宽区域） -->
                <div class="flex-shrink-0 sm:w-48">
                  <span class="text-sm text-secondary font-medium px-3 py-1 rounded-md bg-secondary/10 inline-block whitespace-nowrap">
                    {{ work.time }}
                  </span>
                </div>
                <!-- 组织和职位 -->
                <div class="flex-1 min-w-0">
                  <p class="text-gray-800 font-medium">
                    {{ work.organization }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ work.position }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 研究兴趣 -->
          <div v-if="member.researchInterests?.length" class="mb-8">
            <h3 class="text-2xl text-primary font-semibold mb-4">
              研究兴趣
            </h3>
            <div flex flex-wrap gap-2>
              <span
                v-for="(interest, index) in member.researchInterests"
                :key="index"
                class="text-sm text-primary px-3 py-1 rounded-full bg-primary/10"
              >
                {{ interest }}
              </span>
            </div>
          </div>

          <!-- 代表性论文 -->
          <div v-if="member.publications?.length" class="mb-8">
            <h3 class="text-2xl text-primary font-semibold mb-4">
              代表性论文
            </h3>
            <div space-y-3>
              <p
                v-for="(pub, index) in member.publications"
                :key="index"
                class="text-gray-700 leading-relaxed"
              >
                <span class="text-sm text-gray-500 mr-2">[{{ index + 1 }}]</span>
                {{ pub }}
              </p>
            </div>
          </div>

          <!-- 科研项目 -->
          <div v-if="member.researchProjects?.length" class="mb-8">
            <h3 class="text-2xl text-primary font-semibold mb-4">
              科研项目
            </h3>
            <div class="space-y-3">
              <div
                v-for="(project, index) in member.researchProjects"
                :key="index"
                class="text-gray-700 leading-relaxed"
              >
                <span class="text-xs text-white font-bold mr-2 rounded-full bg-primary inline-flex h-6 w-6 items-center justify-center">
                  {{ index + 1 }}
                </span>
                <span class="font-medium">{{ project.name }}</span>，
                <span class="text-gray-600">{{ project.type }}</span>，
                <span class="text-sm text-gray-500">{{ project.role }}</span>
                <span v-if="project.grantNumber">，批号：{{ project.grantNumber }}</span>
                <span v-if="project.funding">，经费：{{ project.funding }}</span>
                <span class="text-gray-500">（{{ project.period }}）</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else py-12 text-center>
        <div i-carbon-user text-6xl text-gray-300 mb-4 />
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
