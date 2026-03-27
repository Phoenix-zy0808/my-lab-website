<script setup lang="ts">
import type { Achievement, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

const config = ref<SiteConfig | null>(null)

// 加载站点配置
async function loadConfig() {
  try {
    const res = await fetch('/data/site-config.json')
    config.value = await res.json()
  } catch (error) {
    console.error('Failed to load site config:', error)
  }
}

const achievements = ref<Achievement[]>([])
const selectedType = ref<string>('all')
const selectedYear = ref<string | number>('all')
const showPdfModal = ref(false)
const currentPdfUrl = ref<string>('')
const currentPdfTitle = ref<string>('')

// SEO Meta
useSeoMeta({
  title: '成果展示',
  description: '展示实验室的论文、获奖、项目和专利等科研成果',
})

// 成果类型映射
const typeMap: Record<Achievement['type'], { label: string; icon: string; color: string }> = {
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
    const data = await res.json()
    console.log('=== 成果数据加载 ===')
    console.log('原始数据前 3 条:', data.slice(0, 3))
    console.log('加载的成果数量:', data.length)

    // 检查 PDF 路径
    const itemsWithPdf = data.filter(item => item.pdf)
    console.log('包含 PDF 的数量:', itemsWithPdf.length)
    console.log('前 3 个 PDF 路径:', itemsWithPdf.slice(0, 3).map(item => ({
      title: item.title,
      pdf: item.pdf
    })))

    achievements.value = data
    console.log('achievements.value 长度:', achievements.value.length)
  } catch (error) {
    console.error('Failed to load achievements:', error)
  }
}

onMounted(() => {
  loadConfig()
  loadAchievements()
})

// 年份选项
const yearOptions = computed(() => {
  const years = achievements.value.map(ach => {
    const date = new Date(ach.date)
    return date.getFullYear().toString()
  })
  const uniqueYears = [...new Set(years)].sort((a, b) => b.localeCompare(a))
  return [{ key: 'all', label: '全部年份' }, ...uniqueYears.map(year => ({ key: year, label: year }))]
})

// 按类型和年份筛选
const filteredAchievements = computed(() => {
  let result = achievements.value

  console.log('筛选前数量:', result.length)
  console.log('当前类型:', selectedType.value)

  if (selectedType.value !== 'all') {
    result = result.filter(ach => ach.type === selectedType.value)
    console.log('类型筛选后数量:', result.length)
  }

  if (selectedYear.value !== 'all') {
    result = result.filter(ach => {
      const date = new Date(ach.date)
      return date.getFullYear().toString() === selectedYear.value
    })
    console.log('年份筛选后数量:', result.length)
  }

  // 按日期降序排序
  const sorted = result.sort((a, b) => b.date.localeCompare(a.date))
  console.log('最终筛选数量:', sorted.length)
  return sorted
})

// 分页相关
const currentPage = ref(1)
const pageSize = 10 // 每页显示 10 条

// 计算总页数
const totalPages = computed(() => {
  const total = filteredAchievements.value?.length || 0
  const size = pageSize || 10
  const pages = Math.ceil(total / size)
  console.log('总页数计算:', { total, size, pages })
  return pages
})

// 当前页的数据
const currentPageData = computed(() => {
  const total = filteredAchievements.value?.length || 0
  const size = pageSize || 10
  const page = currentPage.value || 1

  const start = (page - 1) * size
  const end = start + size

  console.log('分页计算:', { total, size, page, start, end })

  return filteredAchievements.value?.slice(start, end) || []
})

// 切换页码
function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
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
  if (ach.type !== 'paper' || !ach.authors) return null

  const authors = ach.authors.map((author, index) => {
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

// 打开 PDF
function openPdf(pdfUrl: string, title: string) {
  // 对路径进行中文字符编码
  const encodedUrl = encodeURI(pdfUrl)
  currentPdfUrl.value = encodedUrl
  currentPdfTitle.value = title
  showPdfModal.value = true
  console.log('打开 PDF:', { title, originalUrl: pdfUrl, encodedUrl })
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
        <div flex flex-wrap justify-center gap-2 mb-4>
          <button
            v-for="filter in typeFilterOptions"
            :key="filter.key"
            :class="[
              'px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2',
              selectedType === filter.key
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            @click="selectedType = filter.key"
          >
            <div :class="filter.icon" />
            <span>{{ filter.label }}</span>
          </button>
        </div>

        <!-- 年份筛选 -->
        <div flex flex-wrap justify-center gap-2>
          <button
            v-for="year in yearOptions"
            :key="year.key"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
              selectedYear === year.key
                ? 'bg-secondary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            @click="selectedYear = year.key"
          >
            {{ year.label }}
          </button>
        </div>
      </div>

      <!-- 调试信息 -->
      <div class="bg-yellow-100 p-4 mb-4 text-sm">
        <p>总成果数：{{ achievements.length }}</p>
        <p>筛选后数量：{{ filteredAchievements.length }}</p>
        <p>当前页数据：{{ currentPageData.length }}</p>
        <p>当前页码：{{ currentPage }} / {{ totalPages }}</p>
        <p>pageSize: {{ pageSize }} (typeof: {{ typeof pageSize }})</p>
        <p>当前类型：{{ selectedType }}</p>
        <p>当前年份：{{ selectedYear }}</p>
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
                  <span class="font-semibold text-primary">{{ ach.title }}</span>
                  <span class="mx-1">.</span>

                  <!-- 期刊名（斜体） -->
                  <span class="italic text-gray-600">{{ ach.journal }}</span>

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
                <div class="flex gap-3 mt-2">
                  <a
                    v-if="ach.doi"
                    :href="`https://doi.org/${ach.doi}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-secondary hover:underline flex items-center gap-1"
                  >
                    <div i-carbon-link />
                    DOI
                  </a>
                  <a
                    v-if="ach.link"
                    :href="ach.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-secondary hover:underline flex items-center gap-1"
                  >
                    <div i-carbon-launch text-xs />
                    链接
                  </a>
                  <button
                    v-if="ach.pdf"
                    class="text-sm text-secondary hover:underline flex items-center gap-1"
                    @click="openPdf(ach.pdf!, ach.title)"
                  >
                    <div i-carbon-pdf />
                    PDF
                  </button>
                </div>

                <!-- 描述 -->
                <p v-if="ach.description" class="text-sm text-gray-600 mt-2 leading-relaxed">
                  {{ ach.description }}
                </p>
              </div>
            </div>
          </template>

          <!-- 其他类型成果（获奖、项目、专利、活动） -->
          <template v-else>
            <!-- 类型标签和日期 -->
            <div flex items-start justify-between mb-3>
              <span
                flex
                items-center
                gap-1
                text-sm
                px-2
                py-1
                rounded
                :class="typeMap[ach.type].color"
              >
                <div :class="typeMap[ach.type].icon" />
                {{ typeMap[ach.type].label }}
              </span>
              <span text-sm text-gray-500>{{ ach.date }}</span>
            </div>

            <!-- 标题 -->
            <h3 text-lg font-semibold text-primary mb-2>
              {{ ach.title }}
            </h3>

            <!-- 描述 -->
            <p text-gray-600 text-sm leading-relaxed mb-4>
              {{ ach.description }}
            </p>

            <!-- 操作按钮 -->
            <div flex gap-2>
              <button
                v-if="ach.pdf"
                btn-secondary
                text-sm
                py-1
                flex
                items-center
                gap-1
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
                btn
                text-sm
                py-1
                flex
                items-center
                gap-1
              >
                链接
                <div i-carbon-launch text-xs />
              </a>
            </div>
          </template>
        </div>
      </div>

      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button
          class="px-3 py-1.5 rounded-lg transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          :class="[
            'px-3 py-1.5 rounded-lg transition-all duration-200',
            currentPage === page
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button
          class="px-3 py-1.5 rounded-lg transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- PDF 预览模态框 -->
    <PdfModal
      v-model="showPdfModal"
      :pdf-url="currentPdfUrl"
      :title="currentPdfTitle"
    />
  </div>
</template>
