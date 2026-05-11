<script setup lang="ts">
import type { Achievement, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

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

const achievements = ref<Achievement[]>([])
const selectedType = ref<string>('all')
const selectedYear = ref<string | number>('all')

const showToast = ref(false)
const toastMessage = ref('')

function showTemporaryMessage(message: string) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

useSeoMeta({
  title: '成果展示',
  description: '展示课题组的论文、专利、软著、项目与竞赛荣誉等成果信息。',
})

const typeMap: Record<Achievement['type'], { label: string, icon: string, color: string }> = {
  project: { label: '项目', icon: 'i-carbon-folder', color: 'bg-purple-100 text-purple-700' },
  patent: { label: '专利', icon: 'i-carbon-certificate', color: 'bg-emerald-100 text-emerald-700' },
  copyright: { label: '软著', icon: 'i-carbon-certificate', color: 'bg-green-100 text-green-700' },
  paper: { label: '论文', icon: 'i-carbon-document', color: 'bg-blue-100 text-blue-700' },
  competition: { label: '竞赛', icon: 'i-carbon-trophy', color: 'bg-yellow-100 text-yellow-700' },
  honor: { label: '荣誉', icon: 'i-carbon-trophy', color: 'bg-red-100 text-red-700' },
}

const typeFilterOptions = [
  { key: 'all', label: '全部', icon: 'i-carbon-filter' },
  { key: 'paper', label: '论文', icon: 'i-carbon-document' },
  { key: 'patent', label: '专利', icon: 'i-carbon-certificate' },
  { key: 'copyright', label: '软著', icon: 'i-carbon-certificate' },
  { key: 'project', label: '项目', icon: 'i-carbon-folder' },
  { key: 'competition', label: '竞赛', icon: 'i-carbon-trophy' },
  { key: 'honor', label: '荣誉', icon: 'i-carbon-trophy' },
]

const schoolLevelCompetitionPattern = /校特等奖|校一等奖|校二等奖|校三等奖|校级|校\b|挑战杯校/

async function loadAchievements() {
  try {
    const res = await fetch('/data/achievements.json')
    achievements.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load achievements:', error)
  }
}

onMounted(() => {
  loadConfig()
  loadAchievements()
})

function isSchoolLevelCompetition(achievement: Achievement) {
  if (achievement.type !== 'competition')
    return false

  const text = `${achievement.title} ${achievement.description || ''}`
  return schoolLevelCompetitionPattern.test(text)
}

function getDisplayYear(achievement: Achievement) {
  const source = achievement.type === 'paper' && achievement.year
    ? String(achievement.year)
    : achievement.date

  const date = new Date(source)
  if (!Number.isNaN(date.getTime()))
    return String(date.getFullYear())

  return String(achievement.year || source).slice(0, 4)
}

const yearOptions = computed(() => {
  const years = achievements.value
    .filter(achievement => !isSchoolLevelCompetition(achievement))
    .map(achievement => getDisplayYear(achievement))
    .filter(Boolean)

  const uniqueYears = [...new Set(years)].sort((a, b) => b.localeCompare(a))
  return [{ key: 'all', label: '全部年份' }, ...uniqueYears.map(year => ({ key: year, label: year }))]
})

const filteredAchievements = computed(() => {
  let result = achievements.value.filter(achievement => !isSchoolLevelCompetition(achievement))

  if (selectedType.value !== 'all')
    result = result.filter(achievement => achievement.type === selectedType.value)

  if (selectedYear.value !== 'all')
    result = result.filter(achievement => getDisplayYear(achievement) === selectedYear.value)

  return result.sort((a, b) => b.date.localeCompare(a.date))
})

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => {
  const total = filteredAchievements.value.length
  return Math.max(1, Math.ceil(total / pageSize))
})

const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredAchievements.value.slice(start, end)
})

function changePage(page: number) {
  if (page < 1 || page > totalPages.value)
    return

  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch([selectedType, selectedYear], () => {
  currentPage.value = 1
})

function formatPaperAuthors(authors: string[]) {
  return authors.map((author) => {
    const isCoFirst = author.includes('†') || author.includes('*')
    const isCorresponding = author.includes('#')

    return {
      name: author.replace(/[†*#]/g, '').trim(),
      isCoFirst,
      isCorresponding,
    }
  })
}

function formatDateLabel(achievement: Achievement) {
  if (achievement.type === 'paper') {
    if (achievement.date)
      return achievement.date.replace('-', '.')
    if (achievement.year)
      return String(achievement.year)
  }

  return achievement.date ? achievement.date.replace('-', '.') : ''
}

function getTimePrefix(achievement: Achievement) {
  switch (achievement.type) {
    case 'patent':
      return '受理/授权时间'
    case 'copyright':
      return '登记时间'
    case 'project':
      return '立项时间'
    case 'competition':
      return '获奖时间'
    case 'honor':
      return '时间'
    default:
      return ''
  }
}

function openAttachment(attachmentUrl: string) {
  const normalizedUrl = attachmentUrl.startsWith('/') ? attachmentUrl : `/${attachmentUrl}`
  showTemporaryMessage('附件将以新标签页打开。')
  window.open(encodeURI(normalizedUrl), '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div>
    <Hero
      size="medium"
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析与材料信息课题组'"
      :subtitle="config?.labNameEn || 'Intelligent Spectral Analysis and Materials Informatics Group'"
      :description="config?.description || '聚焦光谱信号解析、材料信息建模与智能检测应用，开展交叉研究与人才培养。'"
    />

    <div page-container py-12>
      <div class="mb-8">
        <div class="mb-4 overflow-x-auto overflow-y-hidden">
          <div class="flex flex-nowrap gap-2 min-w-max justify-center">
            <button
              v-for="filter in typeFilterOptions"
              :key="filter.key"
              class="font-medium px-5 py-2.5 rounded-lg flex gap-2 whitespace-nowrap transition-all duration-300 items-center"
              :class="[
                selectedType === filter.key
                  ? 'bg-primary text-white border border-primary shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-secondary/60 hover:text-secondary',
              ]"
              @click="selectedType = filter.key"
            >
              <div :class="filter.icon" />
              <span>{{ filter.label }}</span>
            </button>
          </div>
        </div>

        <div class="overflow-x-auto overflow-y-hidden">
          <div class="flex flex-nowrap gap-2 min-w-max justify-center">
            <button
              v-for="year in yearOptions"
              :key="year.key"
              class="font-medium px-5 py-2.5 rounded-lg whitespace-nowrap transition-all duration-300"
              :class="[
                selectedYear === year.key
                  ? 'bg-secondary text-white border border-secondary shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-secondary/60 hover:text-secondary',
              ]"
              @click="selectedYear = year.key"
            >
              {{ year.label }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="currentPageData.length > 0" space-y-8>
        <div
          v-for="ach in currentPageData"
          :key="ach.id"
          class="pb-8 border-b border-gray-100 last:border-0"
        >
          <template v-if="ach.type === 'paper' && ach.authors?.length">
            <div class="flex gap-3">
              <span class="text-sm text-gray-500 flex-shrink-0 w-8">
                ({{ currentPageData.indexOf(ach) + 1 }})
              </span>

              <div class="flex-1">
                <div class="mb-2 flex flex-wrap gap-2 items-center">
                  <span
                    class="text-xs text-blue-700 px-2.5 py-1 border border-blue-100 rounded-full bg-blue-50"
                  >
                    论文
                  </span>
                  <span
                    v-if="formatDateLabel(ach)"
                    class="text-xs text-gray-600 px-2.5 py-1 border border-gray-200 rounded-full bg-gray-50"
                  >
                    {{ formatDateLabel(ach) }}
                  </span>
                </div>

                <p class="text-sm text-gray-700 leading-relaxed">
                  <template v-for="(author, idx) in formatPaperAuthors(ach.authors)" :key="`${ach.id}-${idx}`">
                    <span :class="author.isCoFirst ? 'font-bold' : ''">
                      {{ author.name }}
                    </span>
                    <sup v-if="author.isCoFirst" text-xs text-secondary>*</sup>
                    <sup v-if="author.isCorresponding" text-xs text-secondary>#</sup>
                    <span v-if="idx < ach.authors.length - 1">, </span>
                  </template>
                </p>

                <h3 class="text-lg text-primary leading-8 font-semibold mt-2">
                  {{ ach.title }}
                </h3>

                <p class="text-sm text-gray-600 leading-relaxed mt-2">
                  <span v-if="ach.journal" class="italic">{{ ach.journal }}</span>
                  <template v-if="ach.year">
                    <span v-if="ach.journal">, </span>{{ ach.year }}
                  </template>
                  <template v-if="ach.volume">
                    <span>, {{ ach.volume }}</span>
                    <template v-if="ach.issue">
                      ({{ ach.issue }})
                    </template>
                  </template>
                  <template v-if="ach.pages">
                    <span>: {{ ach.pages }}</span>
                  </template>
                </p>

                <p v-if="ach.description" class="text-sm text-gray-600 leading-relaxed mt-3">
                  {{ ach.description }}
                </p>

                <div class="mt-4 flex flex-wrap gap-3">
                  <a
                    v-if="ach.doi"
                    :href="`https://doi.org/${ach.doi}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-secondary flex gap-1 items-center hover:underline"
                  >
                    <div i-carbon-link />
                    DOI
                  </a>
                  <a
                    v-if="ach.link"
                    :href="ach.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-secondary flex gap-1 items-center hover:underline"
                  >
                    <div i-carbon-launch text-xs />
                    相关链接
                  </a>
                  <button
                    v-if="ach.pdf"
                    class="text-sm text-secondary flex gap-1 items-center hover:underline"
                    @click="openAttachment(ach.pdf)"
                  >
                    <div i-carbon-launch text-xs />
                    查看附件
                  </button>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="mb-3 flex flex-wrap gap-2 items-center">
              <span text-sm px-2.5 py-1 rounded-full flex gap-1 items-center :class="typeMap[ach.type].color">
                <div :class="typeMap[ach.type].icon" />
                {{ typeMap[ach.type].label }}
              </span>
              <span
                v-if="formatDateLabel(ach)"
                class="text-xs text-gray-600 px-2.5 py-1 border border-gray-200 rounded-full bg-gray-50"
              >
                <template v-if="getTimePrefix(ach)">
                  {{ getTimePrefix(ach) }}：
                </template>
                {{ formatDateLabel(ach) }}
              </span>
            </div>

            <h3 text-lg text-primary leading-8 font-semibold mb-2>
              {{ ach.title }}
            </h3>

            <p text-sm text-gray-600 leading-relaxed mb-4>
              {{ ach.description }}
            </p>

            <div flex flex-wrap gap-3>
              <button
                v-if="ach.pdf"
                class="text-sm text-secondary flex gap-1 items-center hover:underline"
                @click="openAttachment(ach.pdf)"
              >
                <div i-carbon-launch text-xs />
                查看附件
              </button>
              <a
                v-if="ach.link"
                :href="ach.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-secondary flex gap-1 items-center hover:underline"
              >
                <div i-carbon-launch text-xs />
                相关链接
              </a>
            </div>
          </template>
        </div>
      </div>

      <div v-else py-12 text-center>
        <div i-carbon-document text-6xl text-gray-300 mb-4 />
        <p text-gray-500>
          暂无成果信息
        </p>
      </div>

      <div v-if="totalPages > 1" class="mt-8 flex gap-2 justify-center">
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
    </div>

    <transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showToast"
        class="text-sm text-white px-6 py-3 rounded-lg bg-black/80 shadow-lg bottom-8 left-1/2 fixed z-50 -translate-x-1/2"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>
