<script setup lang="ts">
import type { SiteConfig } from '~/types'
import { useScroll } from '~/composables/useScroll'

const route = useRoute()
const config = ref<SiteConfig | null>(null)
const loadingError = ref<string | null>(null)
const isLoading = ref(true)

// 使用滚动 Hook
const { isScrolled } = useScroll(100)

// 加载站点配置
async function loadConfig() {
  isLoading.value = true
  loadingError.value = null

  try {
    const res = await fetch('/data/site-config.json')
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    config.value = await res.json()
  }
  catch (error) {
    loadingError.value = '加载配置失败，请刷新页面重试'
    console.error('Failed to load site config:', error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadConfig()
})

// 导航链接
const navLinks = [
  { name: '首页', path: '/' },
  { name: '团队成员', path: '/team' },
  { name: '研究方向', path: '/research' },
  { name: '成果展示', path: '/achievements' },
  { name: '仪器设备', path: '/equipment' },
  { name: '课题组生活', path: '/life' },
  { name: '研究进展', path: '/progress' },
  { name: '联系我们', path: '/contact' },
]

// 判断当前激活的导航
function isActive(path: string) {
  return route.path === path
}

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 监听菜单开关，控制 body 滚动
watch(isMobileMenuOpen, (val) => {
  if (val) {
    // 保存当前滚动位置
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    document.body.classList.add('menu-open')
  }
  else {
    // 恢复滚动位置
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    document.body.classList.remove('menu-open')
    // 恢复到之前的滚动位置
    const scrollY = Number.parseInt(document.body.style.top || '0')
    if (scrollY) {
      window.scrollTo(0, Math.abs(scrollY))
    }
  }
}, { immediate: true })

// 组件卸载时清理
onUnmounted(() => {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open')
})

/**
 * 切换移动端菜单
 */
function toggleMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/**
 * 关闭移动端菜单
 */
function closeMenu() {
  isMobileMenuOpen.value = false
}

// ESC 关闭菜单
function handleEscape() {
  if (isMobileMenuOpen.value) {
    closeMenu()
  }
}
</script>

<template>
  <header
    role="banner"

    transition-all duration-300 left-0 right-0 top-0 fixed z-50
    :class="[
      isScrolled ? 'bg-primary/95 backdrop-blur-sm shadow-lg' : 'bg-transparent',
    ]"
  >
    <!-- 错误提示 -->
    <div
      v-if="loadingError"

      text-sm text-white px-4 py-2 text-center bg-red-600 left-0 right-0 top-full absolute
    >
      {{ loadingError }}
    </div>

    <div class="mx-auto px-4 max-w-7xl lg:px-8 sm:px-6">
      <!-- 单行布局：Logo 和导航在同一行 -->
      <div flex h-18 items-center justify-between>
        <!-- Logo / 实验室名称 -->
        <RouterLink
          to="/"

          flex gap-3 items-center
          class="group nav-link"
          aria-label="返回首页"
        >
          <!-- Logo 图标 -->
          <div

            bg="rgb(255 255 255 / 0.2)"

            text-xl text-white rounded-full flex h-10 w-10 transition duration-300 items-center justify-center
            group-hover:bg="rgb(255 255 255 / 0.3)"
            aria-hidden="true"
          >
            <div v-if="!isLoading" i-carbon-microscope />
            <div v-else class="i-carbon-circle-dash animate-spin" text-xl />
          </div>

          <!-- 实验室名称 -->
          <div>
            <h1 text-lg text-white font-bold whitespace-nowrap>
              {{ config?.labName || (isLoading ? '加载中...' : '智能光谱分析实验室') }}
            </h1>
            <p
              v-if="config?.labNameEn || isLoading"

              text-xs hidden whitespace-nowrap sm:block
              :style="{ color: 'rgba(255,255,255,0.6)' }"
            >
              {{ config?.labNameEn || '' }}
            </p>
          </div>
        </RouterLink>

        <!-- 桌面端导航 - 舒适间距 -->
        <nav
          class="hidden md:flex"

          flex-shrink-0 gap-2 items-center
          role="navigation"
          aria-label="主导航"
        >
          <template v-for="link in navLinks" :key="link.path">
            <RouterLink
              :to="link.path"
              class="nav-link"
              :class="{ 'nav-link-active': isActive(link.path) }"
              :aria-current="isActive(link.path) ? 'page' : undefined"
            >
              {{ link.name }}
            </RouterLink>
          </template>
        </nav>

        <!-- 移动端菜单按钮 -->
        <button
          class="md:hidden"
          type="button"

          bg="rgb(255 255 255 / 0.1)"

          hover:bg="rgb(255 255 255 / 0.2)"

          text-white rounded-lg flex h-10 w-10 transition duration-200 items-center justify-center
          aria-label="切换导航菜单"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          @click="toggleMenu"
        >
          <div
            :class="isMobileMenuOpen ? 'i-carbon-close' : 'i-carbon-menu'"
            text-xl
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <!-- 移动端菜单 - 从右侧滑入的全屏菜单 -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu"

        bg="rgb(10 58 82 / 0.98)"

        inset-0 fixed z-60 backdrop-blur-sm lg:hidden
        role="menu"
        @touchmove.prevent
      >
        <!-- 关闭按钮 -->
        <button

          bg="rgb(255 255 255 / 0.1)"

          hover:bg="rgb(255 255 255 / 0.2)"

          text-white rounded-lg flex h-10 w-10 transition duration-200 items-center right-4 top-4 justify-center absolute
          aria-label="关闭菜单"
          @click="closeMenu"
        >
          <div i-carbon-close text-xl aria-hidden="true" />
        </button>

        <!-- 菜单内容 -->
        <div

          v-keyboard-navigation="{
            selector: 'a[role=menuitem]',
            onEscape: handleEscape,
          }" px-4 py-8 flex flex-col gap-4 h-full items-center
          justify-center
        >
          <!-- Logo 区域 -->
          <div mb-8 text-center>
            <div

              bg="rgb(255 255 255 / 0.2)"

              text-3xl text-white mx-auto mb-4 rounded-full flex h-16 w-16 items-center justify-center
              aria-hidden="true"
            >
              <div i-carbon-microscope />
            </div>
            <h2 text-xl text-white font-bold>
              {{ config?.labName || '拉曼光谱实验室' }}
            </h2>
            <p text-sm :style="{ color: 'rgba(255,255,255,0.6)' }">
              {{ config?.labNameEn || 'Raman Spectroscopy Laboratory' }}
            </p>
          </div>

          <!-- 导航链接 -->
          <template v-for="link in navLinks" :key="link.path">
            <RouterLink
              :to="link.path"
              role="menuitem"
              :style="{ color: 'rgba(255,255,255,0.8)' }"
              class="hover:text-white!"

              text-xl font-medium px-6 py-3 rounded-lg transition duration-200
              :class="[
                isActive(link.path)
                  ? 'bg-white/25 text-white font-bold border-b-2 border-white rounded-t-lg'
                  : 'hover:bg-white/10',
              ]"
              :aria-current="isActive(link.path) ? 'page' : undefined"
              @click="closeMenu"
            >
              {{ link.name }}
            </RouterLink>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>
