<script setup lang="ts">
import type { TeamMember, TeamRole, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TeamPage',
})

// SEO Meta
useSeoMeta({
  title: '团队成员',
  description: '介绍实验室的教授、研究人员和学生团队',
})

const router = useRouter()
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

// 角色分类
const roleCategories = [
  { key: 'pi', label: 'PI 介绍' },
  { key: 'research_assistant', label: '科研助理' },
  { key: 'master_student', label: '硕士生' },
  { key: 'undergraduate', label: '本科生' },
  { key: 'graduated_master', label: '已毕业硕士生' },
  { key: 'graduated_undergraduate', label: '已毕业本科生' },
]

// 加载团队成员数据
async function loadTeam() {
  try {
    const res = await fetch('/data/team.json')
    teamData.value = await res.json()
    
    // 默认选中第一个成员
    const firstRole = roleCategories.find(r => teamData.value[r.key as TeamRole]?.length > 0)
    if (firstRole) {
      selectedRole.value = firstRole.key as TeamRole
      selectMember(teamData.value[firstRole.key as TeamRole][0])
    }
  } catch (error) {
    console.error('Failed to load team members:', error)
  }
}

function selectMember(member: TeamMember) {
  selectedMember.value = member
}

// 跳转到成员详情页
function goToMemberDetail(memberId: string, role?: string) {
  // 所有角色都跳转到 [id].vue
  router.push(`/team/${memberId}`)
}

onMounted(() => {
  loadConfig()
  loadTeam()
})

// 当前角色下的成员列表
const currentMembers = computed(() => {
  return teamData.value[selectedRole.value] || []
})

// 角色映射
const roleMap: Record<TeamMember['role'], { label: string; color: string }> = {
  pi: { label: 'PI', color: 'bg-primary text-white' },
  research_assistant: { label: '科研助理', color: 'bg-accent text-white' },
  master_student: { label: '硕士生', color: 'bg-purple-100 text-purple-700' },
  undergraduate: { label: '本科生', color: 'bg-indigo-100 text-indigo-700' },
  graduated_master: { label: '已毕业硕士', color: 'bg-gray-100 text-gray-700' },
  graduated_undergraduate: { label: '已毕业本科', color: 'bg-gray-100 text-gray-700' },
}

// 年级筛选（仅对本科生和已毕业本科生显示）
const selectedGrade = ref<string>('all')

// 年级选项
const gradeOptions = computed(() => {
  if (selectedRole.value !== 'undergraduate' && selectedRole.value !== 'graduated_undergraduate') {
    return []
  }

  const grades = currentMembers.value.map(member => member.grade || '未知年级')
  const uniqueGrades = [...new Set(grades)].sort((a, b) => {
    const yearA = parseInt(a.replace('级', ''))
    const yearB = parseInt(b.replace('级', ''))
    return yearB - yearA
  })

  return [{ key: 'all', label: '全部年级' }, ...uniqueGrades.map(grade => ({ key: grade, label: grade }))]
})

// 按年级筛选
const filteredByGrade = computed(() => {
  let result = currentMembers.value

  if (selectedGrade.value !== 'all') {
    result = result.filter(member => member.grade === selectedGrade.value)
  }

  return result
})

// 分页相关
const currentPage = ref(1)
const pageSize = 12 // 每页显示 12 人

// 计算总页数
const totalPages = computed(() => {
  const total = filteredByGrade.value?.length || 0
  return Math.ceil(total / pageSize)
})

// 当前页的数据
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredByGrade.value?.slice(start, end) || []
})

// 切换页码
function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 当筛选条件改变时，重置页码
watch([selectedRole, selectedGrade], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- 页面头部 -->
    <Hero
      size="medium"
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析实验室'"
      :subtitle="config?.labNameEn || 'Laboratory for Intelligent Spectral Analysis'"
      :description="config?.description"
    />

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Tabs 切换 -->
      <div class="mb-8">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="role in roleCategories"
            :key="role.key"
            :class="[
              'px-4 py-2 rounded-lg transition-all duration-200',
              selectedRole === role.key
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            @click="selectedRole = role.key as TeamRole"
          >
            {{ role.label }}
          </button>
        </div>
      </div>

      <!-- 年级筛选（仅本科生和已毕业本科生显示） -->
      <div v-if="selectedRole === 'undergraduate' || selectedRole === 'graduated_undergraduate'"
           class="flex flex-wrap justify-center gap-2 mt-4">
        <button
          v-for="grade in gradeOptions"
          :key="grade.key"
          :class="[
            'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
            selectedGrade === grade.key
              ? 'bg-secondary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          @click="selectedGrade = grade.key"
        >
          {{ grade.label }}
        </button>
      </div>

      <!-- 主要内容 -->
      <div v-if="currentMembers.length > 0">
        <!-- PI 介绍 - 单栏布局 -->
        <template v-if="selectedRole === 'pi'">
          <!-- 白色卡片容器 -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="max-w-5xl mx-auto">
              <div v-if="selectedMember" card>
              <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <!-- 头像 -->
                <div
                  w-48
                  h-48
                  rounded-lg
                  bg-gradient-to-br
                  from-primary
                  to-secondary
                  flex
                  items-center
                  justify-center
                  text-white
                  text-5xl
                  font-bold
                  overflow-hidden
                  shadow-lg
                  flex-shrink-0
                >
                  <img
                    v-if="selectedMember.photo"
                    :src="selectedMember.photo"
                    :alt="selectedMember.name"
                    w-full
                    h-full
                    object-cover
                    @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                  />
                  <span v-else>
                    {{ selectedMember.name.charAt(0) }}
                  </span>
                </div>

                <!-- 基本信息 -->
                <div class="flex-1 text-center sm:text-left">
                  <h2 class="text-2xl font-bold text-primary mb-2">
                    {{ selectedMember.name }}
                  </h2>
                  <p class="text-lg text-secondary mb-4">
                    {{ selectedMember.title }}
                  </p>

                  <!-- 联系方式 -->
                  <div space-y-2 text-sm text-gray-600>
                    <div v-if="selectedMember.email" flex items-center gap-2 justify-center sm:justify-start>
                      <div i-carbon-email text-lg />
                      <a :href="`mailto:${selectedMember.email}`" class="hover:text-primary">
                        {{ selectedMember.email }}
                      </a>
                    </div>
                    <div v-if="selectedMember.office" flex items-center gap-2 justify-center sm:justify-start>
                      <div i-carbon-location text-lg />
                      <span>{{ selectedMember.office }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 个人简介 -->
              <div class="mt-8">
                <h3 class="text-xl font-semibold text-primary mb-4">
                  个人简介
                </h3>
                <p class="text-gray-700 leading-relaxed">
                  {{ selectedMember.bio }}
                </p>
              </div>

              <!-- 教育经历 -->
              <div v-if="selectedMember.education?.length" class="mt-8">
                <h3 class="text-xl font-semibold text-primary mb-4">
                  教育经历
                </h3>
                <div space-y-4>
                  <div
                    v-for="(edu, index) in selectedMember.education"
                    :key="index"
                    class="flex gap-4"
                  >
                    <div class="text-sm text-secondary w-32 flex-shrink-0">
                      {{ edu.time }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">
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
              <div v-if="selectedMember.workExperience?.length" class="mt-8">
                <h3 class="text-xl font-semibold text-primary mb-4">
                  工作经历
                </h3>
                <div space-y-4>
                  <div
                    v-for="(work, index) in selectedMember.workExperience"
                    :key="index"
                    class="flex gap-4"
                  >
                    <div class="text-sm text-secondary w-32 flex-shrink-0">
                      {{ work.time }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">
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
              <div v-if="selectedMember.researchInterests?.length" class="mt-8">
                <h3 class="text-xl font-semibold text-primary mb-4">
                  研究兴趣
                </h3>
                <div flex flex-wrap gap-2>
                  <span
                    v-for="interest in selectedMember.researchInterests"
                    :key="interest"
                    class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {{ interest }}
                  </span>
                </div>
              </div>

              <!-- 代表性论文 -->
              <div v-if="selectedMember.publications?.length" class="mt-8">
                <h3 class="text-xl font-semibold text-primary mb-4">
                  代表性论文
                </h3>
                <ol class="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                  <li
                    v-for="(pub, index) in selectedMember.publications"
                    :key="index"
                    class="leading-relaxed"
                  >
                    {{ pub }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        </template>

        <!-- 本科生和已毕业本科生 - 05 样式（垂直列表） -->
        <template v-else-if="selectedRole === 'undergraduate' || selectedRole === 'graduated_undergraduate'">
          <!-- 白色卡片容器 -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="space-y-8">
              <div
                v-for="member in currentPageData"
                :key="member.id"
                class="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <!-- 左侧头像（竖长方形） -->
                <div class="sm:w-40 flex-shrink-0">
                  <div class="w-40 h-52 rounded-lg overflow-hidden shadow-md bg-white">
                    <img
                      v-if="member.photo"
                      :src="member.photo"
                      :alt="member.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold"
                    >
                      {{ member.name.charAt(0) }}
                    </div>
                  </div>
                </div>

                <!-- 右侧信息 -->
                <div class="flex-1">
                  <!-- 姓名 + 下划线 -->
                  <div class="mb-4">
                    <h3 class="text-xl font-bold text-gray-800 border-b-2 border-primary pb-2 inline-block">
                      {{ member.name }}
                    </h3>
                  </div>

                  <!-- 简介 + 邮箱 -->
                  <div class="text-gray-700 leading-relaxed mb-4">
                    <p v-if="member.bio" class="mb-3">{{ member.bio }}</p>
                    <p v-if="member.email" class="text-sm">
                      邮箱：
                      <a :href="`mailto:${member.email}`" class="text-secondary hover:underline">
                        {{ member.email }}
                      </a>
                    </p>
                  </div>

                  <!-- 查看简历按钮 -->
                  <button class="btn-resume" @click="goToMemberDetail(member.id, member.role)">
                    查看简历
                    <div i-carbon-arrow-right />
                  </button>
                </div>
              </div>
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
        </template>

        <!-- 硕士生和已毕业硕士生 - 05 样式（垂直列表） -->
        <template v-else-if="selectedRole === 'master_student' || selectedRole === 'graduated_master'">
          <!-- 白色卡片容器 -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="space-y-8">
              <div
                v-for="member in currentMembers"
                :key="member.id"
                class="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <!-- 左侧头像（竖长方形） -->
                <div class="sm:w-40 flex-shrink-0">
                  <div class="w-40 h-52 rounded-lg overflow-hidden shadow-md bg-white">
                    <img
                      v-if="member.photo"
                      :src="member.photo"
                      :alt="member.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold"
                    >
                      {{ member.name.charAt(0) }}
                    </div>
                  </div>
                </div>

                <!-- 右侧信息 -->
                <div class="flex-1">
                  <!-- 姓名 + 下划线 -->
                  <div class="mb-4">
                    <h3 class="text-xl font-bold text-gray-800 border-b-2 border-primary pb-2 inline-block">
                      {{ member.name }}
                    </h3>
                  </div>

                  <!-- 简介 + 邮箱 -->
                  <div class="text-gray-700 leading-relaxed mb-4">
                    <p v-if="member.bio" class="mb-3">{{ member.bio }}</p>
                    <p v-if="member.email" class="text-sm">
                      邮箱：
                      <a :href="`mailto:${member.email}`" class="text-secondary hover:underline">
                        {{ member.email }}
                      </a>
                    </p>
                  </div>

                  <!-- 查看简历按钮 -->
                  <button class="btn-resume" @click="goToMemberDetail(member.id, member.role)">
                    查看简历
                    <div i-carbon-arrow-right />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 其他角色（副教授、科研助理）- 保留左右分栏布局 -->
        <template v-else>
          <!-- 白色卡片容器 -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div grid grid-cols-1 lg:grid-cols-4 gap-6>
            <!-- 左侧成员列表 -->
            <div class="lg:col-span-1">
              <div class="space-y-2">
                <button
                  v-for="member in currentMembers"
                  :key="member.id"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3',
                    selectedMember?.id === member.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
                  ]"
                  @click="selectMember(member)"
                >
                  <!-- 小头像 -->
                  <div
                    w-10
                    h-10
                    rounded-full
                    bg-gradient-to-br
                    from-primary
                    to-secondary
                    flex
                    items-center
                    justify-center
                    text-white
                    text-sm
                    font-bold
                    flex-shrink-0
                  >
                    <span>{{ member.name.charAt(0) }}</span>
                  </div>
                  <div flex-1 min-w-0>
                    <div text-sm font-medium truncate>{{ member.name }}</div>
                    <div text-xs op="75" truncate>{{ member.title }}</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- 右侧成员详情 -->
            <div class="lg:col-span-3">
              <div v-if="selectedMember" card>
                <div class="flex flex-col sm:flex-row gap-6">
                  <!-- 头像区域 -->
                  <div class="sm:w-48 flex-shrink-0">
                    <div
                      w-48
                      h-48
                      rounded-lg
                      bg-gradient-to-br
                      from-primary
                      to-secondary
                      flex
                      items-center
                      justify-center
                      text-white
                      text-5xl
                      font-bold
                      overflow-hidden
                      shadow-lg
                      mx-auto sm:mx-0
                    >
                      <img
                        v-if="selectedMember.photo"
                        :src="selectedMember.photo"
                        :alt="selectedMember.name"
                        w-full
                        h-full
                        object-cover
                        @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                      />
                      <span v-else>
                        {{ selectedMember.name.charAt(0) }}
                      </span>
                    </div>

                    <!-- 角色标签 -->
                    <div class="mt-4 text-center sm:text-left">
                      <span
                        text-sm
                        px-3
                        py-1
                        rounded-full
                        :class="roleMap[selectedMember.role].color"
                      >
                        {{ roleMap[selectedMember.role].label }}
                      </span>
                    </div>
                  </div>

              <!-- 信息区域 -->
              <div class="flex-1">
                <!-- 姓名和标题 -->
                <div class="mb-6">
                  <h2 class="text-2xl font-bold text-primary mb-2">
                    {{ selectedMember.name }}
                  </h2>
                  <p class="text-secondary">
                    {{ selectedMember.title }}
                  </p>
                </div>

                <!-- 联系方式 -->
                <div class="mb-6 space-y-2 text-sm text-gray-600">
                  <div v-if="selectedMember.email" flex items-center gap-2>
                    <div i-carbon-email text-lg />
                    <a :href="`mailto:${selectedMember.email}`" class="hover:text-primary">
                      {{ selectedMember.email }}
                    </a>
                  </div>
                  <div v-if="selectedMember.phone" flex items-center gap-2>
                    <div i-carbon-phone text-lg />
                    <span>{{ selectedMember.phone }}</span>
                  </div>
                  <div v-if="selectedMember.office" flex items-center gap-2>
                    <div i-carbon-location text-lg />
                    <span>{{ selectedMember.office }}</span>
                  </div>
                </div>

                <!-- 个人简介 -->
                <div v-if="selectedMember.bio" class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <div i-carbon-user text-lg />
                    个人简介
                  </h3>
                  <p class="text-gray-600 leading-relaxed">
                    {{ selectedMember.bio }}
                  </p>
                </div>

                <!-- 研究兴趣 -->
                <div v-if="selectedMember.researchInterests?.length" class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div i-carbon-microscope text-lg />
                    研究兴趣
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="interest in selectedMember.researchInterests"
                      :key="interest"
                      text-xs
                      px-3
                      py-1
                      rounded-full
                      bg="oklch(65% 0.045 200.5)/10"
                      text-secondary
                    >
                      {{ interest }}
                    </span>
                  </div>
                </div>

                <!-- 教育经历 -->
                <div v-if="selectedMember.education?.length" class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div i-carbon-education text-lg />
                    教育经历
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="(edu, index) in selectedMember.education"
                      :key="index"
                      class="flex gap-3"
                    >
                      <div class="text-sm text-gray-500 w-32 flex-shrink-0">
                        {{ edu.time }}
                      </div>
                      <div class="text-gray-700">
                        <div class="font-medium">{{ edu.school }}</div>
                        <div class="text-sm text-gray-500">
                          {{ edu.major }} {{ edu.degree }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 工作经历 -->
                <div v-if="selectedMember.workExperience?.length" class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div i-carbon-id-management text-lg />
                    工作经历
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="(work, index) in selectedMember.workExperience"
                      :key="index"
                      class="flex gap-3"
                    >
                      <div class="text-sm text-gray-500 w-32 flex-shrink-0">
                        {{ work.time }}
                      </div>
                      <div class="text-gray-700">
                        <div class="font-medium">{{ work.organization }}</div>
                        <div class="text-sm text-gray-500">
                          {{ work.position }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 代表性论文 -->
                <div v-if="selectedMember.publications?.length" class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div i-carbon-document text-lg />
                    代表性论文
                  </h3>
                  <ol class="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                    <li
                      v-for="(pub, index) in selectedMember.publications"
                      :key="index"
                      class="leading-relaxed"
                    >
                      {{ pub }}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
        </template>
      </div>

      <!-- 空状态 -->
      <div v-if="currentMembers.length === 0" text-center py-12>
        <div i-carbon-account text-6xl text-gray-300 mb-4 />
        <p text-gray-500>暂无成员信息</p>
      </div>
    </div>
  </div>
</template>
