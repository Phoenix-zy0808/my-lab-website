<script setup lang="ts">
import type { SiteConfig, TeamMember, TeamRole } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'TeamPage',
})

useSeoMeta({
  title: '团队成员',
  description: '介绍课题组教师、科研助理与学生团队。',
})

const config = ref<SiteConfig | null>(null)

async function loadConfig() {
  try {
    const res = await fetch('/data/site-config.json')
    config.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load site config:', error)
  }
}

const teamData = ref<Record<string, TeamMember[]>>({
  pi: [],
  research_assistant: [],
  master_student: [],
  undergraduate: [],
  graduated_master: [],
  graduated_undergraduate: [],
})

const selectedRole = ref<TeamRole>('pi')
const selectedMember = ref<TeamMember | null>(null)

const roleCategories = [
  { key: 'pi', label: 'PI 介绍' },
  { key: 'research_assistant', label: '科研助理' },
  { key: 'master_student', label: '硕士生' },
  { key: 'undergraduate', label: '本科生' },
  { key: 'graduated_master', label: '已毕业硕士生' },
  { key: 'graduated_undergraduate', label: '已毕业本科生' },
]

async function loadTeam() {
  try {
    const res = await fetch('/data/team.json')
    teamData.value = await res.json()

    const firstRole = roleCategories.find(role => teamData.value[role.key as TeamRole]?.length > 0)
    if (firstRole) {
      selectedRole.value = firstRole.key as TeamRole
      selectMember(teamData.value[firstRole.key as TeamRole][0])
    }
  }
  catch (error) {
    console.error('Failed to load team members:', error)
  }
}

function selectMember(member: TeamMember) {
  selectedMember.value = member
}

onMounted(() => {
  loadConfig()
  loadTeam()
})

const currentMembers = computed(() => teamData.value[selectedRole.value] || [])

const selectedGrade = ref<string>('all')

const gradeOptions = computed(() => {
  if (selectedRole.value !== 'undergraduate' && selectedRole.value !== 'graduated_undergraduate')
    return []

  const grades = currentMembers.value.map(member => member.grade || '未知年级')
  const uniqueGrades = [...new Set(grades)].sort((a, b) => {
    const yearA = Number.parseInt(a.replace('级', ''))
    const yearB = Number.parseInt(b.replace('级', ''))
    return yearB - yearA
  })

  return [{ key: 'all', label: '全部年级' }, ...uniqueGrades.map(grade => ({ key: grade, label: grade }))]
})

const filteredByGrade = computed(() => {
  let result = currentMembers.value

  if (selectedGrade.value !== 'all')
    result = result.filter(member => member.grade === selectedGrade.value)

  return result
})

const currentPage = ref(1)
const pageSize = 12

const totalPages = computed(() => {
  const total = filteredByGrade.value.length
  return Math.ceil(total / pageSize)
})

const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredByGrade.value.slice(start, end)
})

const currentMasterPageData = computed(() => {
  if (selectedRole.value !== 'master_student' && selectedRole.value !== 'graduated_master')
    return currentMembers.value

  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return currentMembers.value.slice(start, end)
})

function changePage(page: number) {
  if (page < 1 || page > totalPages.value)
    return

  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch([selectedRole, selectedGrade], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <Hero
      size="medium"
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析与材料信息课题组'"
      :subtitle="config?.labNameEn || 'Intelligent Spectral Analysis and Materials Informatics Group'"
      :description="config?.description"
    />

    <div class="mx-auto px-4 py-12 max-w-7xl lg:px-8 sm:px-6">
      <div class="mb-8">
        <div class="px-4 overflow-x-auto overflow-y-hidden -mx-4 sm:mx-0 sm:px-0">
          <div class="flex flex-nowrap gap-2 min-w-max justify-start sm:justify-center">
            <button
              v-for="role in roleCategories"
              :key="role.key"
              class="font-medium px-5 py-2.5 rounded-lg whitespace-nowrap transition-all duration-300"
              :class="[
                selectedRole === role.key
                  ? 'bg-white text-primary border-2 border-primary shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-secondary hover:text-secondary',
              ]"
              @click="selectedRole = role.key as TeamRole"
            >
              {{ role.label }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="selectedRole === 'undergraduate' || selectedRole === 'graduated_undergraduate'"
        class="mb-4 px-4 overflow-x-auto overflow-y-hidden -mx-4 sm:mx-0 sm:px-0"
      >
        <div class="flex flex-nowrap gap-2 min-w-max justify-start sm:justify-center">
          <button
            v-for="grade in gradeOptions"
            :key="grade.key"
            class="text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200"
            :class="[
              selectedGrade === grade.key
                ? 'bg-secondary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            @click="selectedGrade = grade.key"
          >
            {{ grade.label }}
          </button>
        </div>
      </div>

      <div v-if="currentMembers.length > 0">
        <template v-if="selectedRole === 'pi'">
          <div class="p-4 rounded-xl bg-white shadow-lg sm:p-8">
            <div class="mx-auto max-w-5xl">
              <div v-if="selectedMember" card>
                <div class="flex flex-col gap-6 items-center sm:flex-row sm:items-start">
                  <div
                    text-5xl text-white font-bold rounded-lg flex flex-shrink-0 h-48 w-48 shadow-lg items-center justify-center overflow-hidden from-primary to-secondary bg-gradient-to-br
                  >
                    <OptimizedImage
                      v-if="selectedMember.photo"
                      :src="selectedMember.photo"
                      :alt="selectedMember.name"
                      loading="lazy"
                      decoding="async"
                      h-full w-full object-cover
                      @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                    />
                    <span v-else>
                      {{ selectedMember.name.charAt(0) }}
                    </span>
                  </div>

                  <div class="text-center flex-1 sm:text-left">
                    <h2 class="text-2xl text-primary font-bold mb-2">
                      {{ selectedMember.name }}
                    </h2>
                    <p class="text-lg text-secondary mb-4">
                      {{ selectedMember.title }}
                    </p>

                    <div text-sm text-gray-600 space-y-2>
                      <div v-if="selectedMember.email" flex gap-2 items-center justify-center sm:justify-start>
                        <div i-carbon-email text-lg />
                        <a :href="`mailto:${selectedMember.email}`" class="hover:text-primary">
                          {{ selectedMember.email }}
                        </a>
                      </div>
                      <div v-if="selectedMember.office" flex gap-2 items-center justify-center sm:justify-start>
                        <div i-carbon-location text-lg />
                        <span>{{ selectedMember.office }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-8">
                  <h3 class="text-xl text-primary font-semibold mb-4">
                    个人简介
                  </h3>
                  <p class="text-gray-700 leading-relaxed">
                    {{ selectedMember.bio }}
                  </p>
                </div>

                <div v-if="selectedMember.education?.length" class="mt-8">
                  <h3 class="text-xl text-primary font-semibold mb-4">
                    教育经历
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="(edu, index) in selectedMember.education"
                      :key="index"
                      class="flex flex-col gap-2 sm:flex-row sm:gap-4"
                    >
                      <div class="flex-shrink-0 sm:w-56">
                        <span class="text-base text-gray-700 font-medium whitespace-nowrap">
                          {{ edu.time }}：
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-gray-800">
                          {{ edu.school }} - {{ edu.major }}
                          <span class="text-sm text-gray-600 ml-2">
                            {{ edu.degree }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="selectedMember.workExperience?.length" class="mt-8">
                  <h3 class="text-xl text-primary font-semibold mb-4">
                    工作经历
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="(work, index) in selectedMember.workExperience"
                      :key="index"
                      class="flex flex-col gap-2 sm:flex-row sm:gap-4"
                    >
                      <div class="flex-shrink-0 sm:w-56">
                        <span class="text-base text-gray-700 font-medium whitespace-nowrap">
                          {{ work.time }}：
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-gray-800">
                          {{ work.organization }}
                          <span v-if="work.position" class="text-sm text-gray-600 ml-2">
                            {{ work.position }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="selectedMember.researchInterests?.length" class="mt-8">
                  <h3 class="text-xl text-primary font-semibold mb-4">
                    研究兴趣
                  </h3>
                  <div class="space-y-2">
                    <div
                      v-for="(interest, index) in selectedMember.researchInterests"
                      :key="index"
                      class="text-gray-700 leading-relaxed"
                    >
                      {{ interest }}
                    </div>
                  </div>
                </div>

                <div v-if="selectedMember.publications?.length" class="mt-8">
                  <h3 class="text-xl text-primary font-semibold mb-4">
                    代表论文
                  </h3>
                  <ol class="text-sm text-gray-600 list-decimal list-inside space-y-2">
                    <li
                      v-for="(publication, index) in selectedMember.publications"
                      :key="index"
                      class="leading-relaxed"
                    >
                      {{ publication }}
                    </li>
                  </ol>
                </div>

                <div v-if="selectedMember.researchProjects?.length" class="mt-8">
                  <h3 class="text-xl text-primary font-semibold mb-4">
                    科研项目
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="(project, index) in selectedMember.researchProjects"
                      :key="index"
                      class="leading-relaxed"
                    >
                      <span class="text-xs text-white font-bold mr-2 rounded-full bg-primary inline-flex h-6 w-6 items-center justify-center">
                        {{ index + 1 }}
                      </span>
                      <span class="text-gray-800 font-medium">{{ project.name }}</span>
                      <span class="text-gray-600">，{{ project.type }}</span>
                      <span class="text-gray-500">，{{ project.role }}</span>
                      <span v-if="project.grantNumber">，批准号：{{ project.grantNumber }}</span>
                      <span v-if="project.funding">，经费：{{ project.funding }}</span>
                      <span class="text-gray-500">，{{ project.period }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="selectedRole === 'undergraduate' || selectedRole === 'graduated_undergraduate'">
          <div class="p-4 rounded-xl bg-white shadow-lg sm:p-8">
            <div class="space-y-8">
              <div
                v-for="member in currentPageData"
                :key="member.id"
                class="pb-8 border-b border-gray-200 flex flex-col gap-6 last:pb-0 last:border-0 sm:flex-row"
              >
                <div class="flex-shrink-0 sm:w-40">
                  <div class="mx-auto rounded-lg bg-white h-44 w-32 shadow-md overflow-hidden sm:mx-0 sm:h-52 sm:w-40">
                    <OptimizedImage
                      v-if="member.photo"
                      :src="member.photo"
                      :alt="`${member.name} - ${member.title}`"
                      class="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      v-else
                      class="text-3xl text-white font-bold flex h-full w-full items-center justify-center from-primary to-secondary bg-gradient-to-br sm:text-4xl"
                    >
                      {{ member.name.charAt(0) }}
                    </div>
                  </div>
                </div>

                <div class="flex-1">
                  <div class="mb-4 text-center sm:text-left">
                    <h3 class="text-xl text-gray-800 font-bold pb-2 border-b-2 border-primary inline-block">
                      {{ member.name }}
                    </h3>
                  </div>

                  <div class="text-gray-700 leading-relaxed">
                    <p v-if="member.bio" class="mb-3">
                      {{ member.bio }}
                    </p>
                    <p v-if="member.email" class="text-sm">
                      邮箱：
                      <a :href="`mailto:${member.email}`" class="text-secondary hover:underline">
                        {{ member.email }}
                      </a>
                    </p>
                    <ul v-if="member.honors?.length" class="mt-4 list-disc list-inside space-y-1.5">
                      <li v-for="(honor, index) in member.honors" :key="index" class="text-sm text-gray-600 leading-normal">
                        {{ honor }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="mt-8 flex flex-wrap gap-2 justify-center">
            <button
              class="text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100 transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              上一页
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              class="px-3 py-1.5 rounded-lg transition-all duration-200"
              :class="[
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>

            <button
              class="text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100 transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              下一页
            </button>
          </div>
        </template>

        <template v-else-if="selectedRole === 'master_student' || selectedRole === 'graduated_master'">
          <div class="p-4 rounded-xl bg-white shadow-lg sm:p-8">
            <div class="space-y-8">
              <div
                v-for="member in currentMasterPageData"
                :key="member.id"
                class="pb-8 border-b border-gray-200 flex flex-col gap-6 last:pb-0 last:border-0 sm:flex-row"
              >
                <div class="flex-shrink-0 sm:w-40">
                  <div class="mx-auto rounded-lg bg-white h-44 w-32 shadow-md overflow-hidden sm:mx-0 sm:h-52 sm:w-40">
                    <OptimizedImage
                      v-if="member.photo"
                      :src="member.photo"
                      :alt="`${member.name} - ${member.title}`"
                      loading="lazy"
                      decoding="async"
                      class="h-full w-full object-cover"
                    />
                    <div
                      v-else
                      class="text-3xl text-white font-bold flex h-full w-full items-center justify-center from-primary to-secondary bg-gradient-to-br sm:text-4xl"
                    >
                      {{ member.name.charAt(0) }}
                    </div>
                  </div>
                </div>

                <div class="flex-1">
                  <div class="mb-4 text-center sm:text-left">
                    <h3 class="text-xl text-gray-800 font-bold pb-2 border-b-2 border-primary inline-block">
                      {{ member.name }}
                    </h3>
                  </div>

                  <div class="text-gray-700 leading-relaxed">
                    <p v-if="member.bio" class="mb-3">
                      {{ member.bio }}
                    </p>
                    <p v-if="member.email" class="text-sm">
                      邮箱：
                      <a :href="`mailto:${member.email}`" class="text-secondary hover:underline">
                        {{ member.email }}
                      </a>
                    </p>
                    <ul v-if="member.honors?.length" class="mt-4 list-disc list-inside space-y-1.5">
                      <li v-for="(honor, index) in member.honors" :key="index" class="text-sm text-gray-600 leading-normal">
                        {{ honor }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="mt-8 flex flex-wrap gap-2 justify-center">
            <button
              class="text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100 transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              上一页
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              class="px-3 py-1.5 rounded-lg transition-all duration-200"
              :class="[
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>

            <button
              class="text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100 transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              下一页
            </button>
          </div>
        </template>

        <template v-else-if="selectedRole === 'research_assistant'">
          <div class="p-4 rounded-xl bg-white shadow-lg sm:p-8">
            <div class="space-y-8">
              <div
                v-for="member in currentMembers"
                :key="member.id"
                class="pb-8 border-b border-gray-200 flex flex-col gap-6 last:pb-0 last:border-0 sm:flex-row"
              >
                <div class="flex-shrink-0 sm:w-40">
                  <div class="mx-auto rounded-lg bg-white h-44 w-32 shadow-md overflow-hidden sm:mx-0 sm:h-52 sm:w-40">
                    <OptimizedImage
                      v-if="member.photo"
                      :src="member.photo"
                      :alt="`${member.name} - ${member.title}`"
                      class="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      v-else
                      class="text-3xl text-white font-bold flex h-full w-full items-center justify-center from-primary to-secondary bg-gradient-to-br sm:text-4xl"
                    >
                      {{ member.name.charAt(0) }}
                    </div>
                  </div>
                </div>

                <div class="flex-1">
                  <div class="mb-4 text-center sm:text-left">
                    <h3 class="text-xl text-gray-800 font-bold pb-2 border-b-2 border-primary inline-block">
                      {{ member.name }}
                    </h3>
                  </div>

                  <div class="text-gray-700 leading-relaxed">
                    <p v-if="member.bio" class="mb-3">
                      {{ member.bio }}
                    </p>
                    <p v-if="member.email" class="text-sm">
                      邮箱：
                      <a :href="`mailto:${member.email}`" class="text-secondary hover:underline">
                        {{ member.email }}
                      </a>
                    </p>
                    <ul v-if="member.honors?.length" class="mt-4 list-disc list-inside space-y-1.5">
                      <li v-for="(honor, index) in member.honors" :key="index" class="text-sm text-gray-600 leading-normal">
                        {{ honor }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div v-if="currentMembers.length === 0" py-12 text-center>
        <div i-carbon-account text-6xl text-gray-300 mb-4 />
        <p text-gray-500>
          暂无成员信息
        </p>
      </div>
    </div>
  </div>
</template>
