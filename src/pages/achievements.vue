<script setup lang="ts">
import type { Achievement, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

const config = ref<SiteConfig | null>(null)

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

const achievements = ref<Achievement[]>([])
const selectedType = ref<string>('all')
const selectedYear = ref<string | number>('all')

// Toast 提示状态
const showToast = ref(false)
const toastMessage = ref('')

function showTemporaryMessage(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)
}

// SEO Meta
useSeoMeta({
  title: '成果展示',
  description: '展示实验室的论文、获奖、项目和专利等科研成果',
})

// 成果类型映射
const typeMap: Record<Achievement['type'], { label: string, icon: string, color: string }> = {
  project: { label: '项目', icon: 'i-carbon-folder', color: 'bg-purple-100 text-purple-700' },
  patent: { label: '专利', icon: 'i-carbon-certificate', color: 'bg-emerald-100 text-emerald-700' },
  copyright: { label: '软著', icon: 'i-carbon-certificate', color: 'bg-green-100 text-green-700' },
  paper: { label: '论文', icon: 'i-carbon-document', color: 'bg-blue-100 text-blue-700' },
  competition: { label: '竞赛', icon: 'i-carbon-trophy', color: 'bg-yellow-100 text-yellow-700' },
  honor: { label: '荣誉', icon: 'i-carbon-trophy', color: 'bg-red-100 text-red-700' },
}

// 类型筛选选项
const typeFilterOptions = [
  { key: 'all', label: '全部', icon: 'i-carbon-filter' },
  { key: 'project', label: '项目', icon: 'i-carbon-folder' },
  { key: 'patent', label: '专利', icon: 'i-carbon-certificate' },
  { key: 'copyright', label: '软著', icon: 'i-carbon-certificate' },
  { key: 'paper', label: '论文', icon: 'i-carbon-document' },
  { key: 'competition', label: '竞赛', icon: 'i-carbon-trophy' },
  { key: 'honor', label: '荣誉', icon: 'i-carbon-trophy' },
]

// 加载成果数据
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

// 年份选项
const yearOptions = computed(() => {
  const years = achievements.value.map((ach) => {
    const date = new Date(ach.date)
    return date.getFullYear().toString()
  })
  const uniqueYears = [...new Set(years)].sort((a, b) => b.localeCompare(a))
  return [{ key: 'all', label: '全部年份' }, ...uniqueYears.map(year => ({ key: year, label: year }))]
})

// 按类型和年份筛选
const filteredAchievements = computed(() => {
  let result = achievements.value

  if (selectedType.value !== 'all') {
    result = result.filter(ach => ach.type === selectedType.value)
  }

  if (selectedYear.value !== 'all') {
    result = result.filter((ach) => {
      const date = new Date(ach.date)
      return date.getFullYear().toString() === selectedYear.value
    })
  }

  // 按日期降序排序
  return result.sort((a, b) => b.date.localeCompare(a.date))
})

// 分页相关
const currentPage = ref(1)
const pageSize = 10 // 每页显示 10 条

// 计算总页数
const totalPages = computed(() => {
  const total = filteredAchievements.value?.length || 0
  const size = pageSize || 10
  return Math.ceil(total / size)
})

// 当前页的数据
const currentPageData = computed(() => {
  const size = pageSize || 10
  const page = currentPage.value || 1

  const start = (page - 1) * size
  const end = start + size

  return filteredAchievements.value?.slice(start, end) || []
})

// 切换页码
function changePage(page: number) {
  if (page < 1 || page > totalPages.value)
    return
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 当筛选条件改变时，重置页码到第一页
watch([selectedType, selectedYear], () => {
  currentPage.value = 1
})

// 格式化论文引用（标准学术格式）
function formatPaperCitation(ach: Achievement) {
  if (ach.type !== 'paper' || !ach.authors)
    return null

  const authors = ach.authors.map((author, _index) => {
    const isCoFirst = author.includes('†')
    const isCorresponding = author.includes('#')
    return {
      name: author.replace(/[†#]/g, ''),
      isCoFirst,
      isCorresponding,
    }
  })

  const journalInfo = [
    ach.journal,
    ach.year,
    ach.volume && `${ach.volume}${ach.issue ? `(${ach.issue})` : ''}`,
    ach.pages,
  ].filter(Boolean).join(', ')

  return { authors, journalInfo }
}

// 打开 PDF - 修复路径编码
function openPdf(pdfUrl: string, _title: string) {
  showTemporaryMessage('正在打开 PDF...')
  // 确保路径以/开头
  const normalizedUrl = pdfUrl.startsWith('/') ? pdfUrl : `/${pdfUrl}`
  // 使用 encodeURI 编码中文路径
  const encodedUrl = encodeURI(normalizedUrl)
  // 直接在新窗口打开
  window.open(encodedUrl, '_blank', 'noopener,noreferrer')
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
      :description="config?.description"
    />

    <!-- 主要内容 -->
    <div page-container py-12>
      <!-- 筛选器 -->
      <div class="mb-8">
        <!-- 类型筛选 -->
        <div class="mb-4 overflow-x-auto overflow-y-hidden">
          <div class="flex flex-nowrap gap-2 min-w-max justify-center">
            <button
              v-for="filter in typeFilterOptions"
              :key="filter.key"
              class="font-medium px-5 py-2.5 rounded-lg flex gap-2 whitespace-nowrap transition-all duration-300 items-center" :class="[
                selectedType === filter.key
                  ? 'bg-white text-primary border-2 border-primary shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-secondary hover:text-secondary',
              ]"
              @click="selectedType = filter.key"
            >
              <div :class="filter.icon" />
              <span>{{ filter.label }}</span>
            </button>
          </div>
        </div>

        <!-- 年份筛选 -->
        <div class="overflow-x-auto overflow-y-hidden">
          <div class="flex flex-nowrap gap-2 min-w-max justify-center">
            <button
              v-for="year in yearOptions"
              :key="year.key"
              class="font-medium px-5 py-2.5 rounded-lg whitespace-nowrap transition-all duration-300" :class="[
                selectedYear === year.key
                  ? 'bg-white text-secondary border-2 border-secondary shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-secondary hover:text-secondary',
              ]"
              @click="selectedYear = year.key"
            >
              {{ year.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- 成果列表 -->
      <div v-if="currentPageData.length > 0" space-y-6>
        <div
          v-for="ach in currentPageData"
          :key="ach.id"
          class="pb-6 border-b border-gray-100 last:border-0"
        >
          <!-- 论文类型特殊格式 -->
          <template v-if="ach.type === 'paper' && ach.authors">
            <div class="flex gap-3">
              <!-- 序号 -->
              <span class="text-sm text-gray-500 flex-shrink-0 w-8">
                ({{ currentPageData.indexOf(ach) + 1 }})
              </span>

              <!-- 内容 -->
              <div class="flex-1">
                <!-- 作者列表 -->
                <p class="text-sm text-gray-700 leading-relaxed">
                  <template v-for="(authorObj, idx) in formatPaperCitation(ach)?.authors" :key="idx">
                    <span :class="authorObj.isCoFirst ? 'font-bold' : ''">
                      {{ authorObj.name }}
                    </span>
                    <sup v-if="authorObj.isCoFirst" text-xs text-secondary>†</sup>
                    <sup v-if="authorObj.isCorresponding" text-xs text-secondary>#</sup>
                    <span v-if="idx < ach.authors!.length - 1">, </span>
                  </template>
                  <span class="mx-1">.</span>

                  <!-- 标题 -->
                  <span class="text-primary font-semibold">{{ ach.title }}</span>
                  <span class="mx-1">.</span>

                  <!-- 期刊名（斜体） -->
                  <span class="text-gray-600 italic">{{ ach.journal }}</span>

                  <!-- 年份卷期页码 -->
                  <template v-if="ach.year">
                    <span class="mx-1">, </span>
                    <span class="text-sm">{{ ach.year }}</span>
                  </template>

                  <template v-if="ach.volume">
                    <span class="mx-1">, </span>
                    <span class="text-sm">
                      {{ ach.volume }}
                      <template v-if="ach.issue">({{ ach.issue }})</template>
                      <template v-if="ach.pages">: {{ ach.pages }}</template>
                    </span>
                  </template>
                  <span class="mx-1">.</span>
                </p>

                <!-- 链接 -->
                <div class="mt-2 flex gap-3">
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
                    链接
                  </a>
                  <button
                    v-if="ach.pdf"
                    class="text-sm text-secondary flex gap-1 items-center hover:underline"
                    @click="openPdf(ach.pdf!, ach.title)"
                  >
                    <div i-carbon-pdf />
                    PDF
                  </button>
                </div>

                <!-- 描述 -->
                <p v-if="ach.description" class="text-sm text-gray-600 leading-relaxed mt-2">
                  {{ ach.description }}
                </p>
              </div>
            </div>
          </template>

          <!-- 其他类型成果（获奖、项目、专利、活动） -->
          <template v-else>
            <!-- 类型标签和日期 -->
            <div mb-3 flex items-start justify-between>
              <span

                text-sm px-2 py-1 rounded flex gap-1 items-center
                :class="typeMap[ach.type].color"
              >
                <div :class="typeMap[ach.type].icon" />
                {{ typeMap[ach.type].label }}
              </span>
              <span text-sm text-gray-500>{{ ach.date }}</span>
            </div>

            <!-- 标题 -->
            <h3 text-lg text-primary font-semibold mb-2>
              {{ ach.title }}
            </h3>

            <!-- 描述 -->
            <p text-sm text-gray-600 leading-relaxed mb-4>
              {{ ach.description }}
            </p>

            <!-- 操作按钮 -->
            <div flex gap-2>
              <button
                v-if="ach.pdf"

                text-sm btn-secondary py-1 flex gap-1 items-center
                @click="openPdf(ach.pdf!, ach.title)"
              >
                <div i-carbon-pdf />
                查看
              </button>
              <a
                v-if="ach.link"
                :href="ach.link"
                target="_blank"
                rel="noopener noreferrer"

                text-sm btn py-1 flex gap-1 items-center
              >
                链接
                <div i-carbon-launch text-xs />
              </a>
            </div>
          </template>
        </div>
      </div>

      <!-- 分页控件 -->
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
          class="px-3 py-1.5 rounded-lg transition-all duration-200" :class="[
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

    <!-- Toast 提示 -->
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
