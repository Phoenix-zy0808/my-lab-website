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
    fixed
    top-0
    left-0
    right-0
    z-50
    transition-all
    duration-300
    :class="[
      isScrolled ? 'bg-primary/95 backdrop-blur-sm shadow-lg' : 'bg-transparent',
    ]"
  >
    <!-- 错误提示 -->
    <div
      v-if="loadingError"
      absolute
      top-full
      left-0
      right-0
      bg-red-600
      text-white
      text-sm
      py-2
      px-4
      text-center
    >
      {{ loadingError }}
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 单行布局：Logo 和导航在同一行 -->
      <div flex items-center justify-between h-18>
        <!-- Logo / 实验室名称 -->
        <RouterLink
          to="/"
          flex
          items-center
          gap-3
          class="nav-link group"
          aria-label="返回首页"
        >
          <!-- Logo 图标 -->
          <div
            w-10
            h-10
            rounded-full
            bg="rgb(255 255 255 / 0.2)"
            flex
            items-center
            justify-center
            text-white
            text-xl
            transition
            duration-300
            group-hover:bg="rgb(255 255 255 / 0.3)"
            aria-hidden="true"
          >
            <div v-if="!isLoading" i-carbon-microscope />
            <div v-else class="i-carbon-circle-dash animate-spin" text-xl />
          </div>

          <!-- 实验室名称 -->
          <div>
            <h1 text-white text-lg font-bold whitespace-nowrap>
              {{ config?.labName || (isLoading ? '加载中...' : '智能光谱分析实验室') }}
            </h1>
            <p
              v-if="config?.labNameEn || isLoading"
              text-xs
              hidden
              sm:block
              whitespace-nowrap
              :style="{ color: 'rgba(255,255,255,0.6)' }"
            >
              {{ config?.labNameEn || '' }}
            </p>
          </div>
        </RouterLink>

        <!-- 桌面端导航 - 舒适间距 -->
        <nav
          class="hidden md:flex"
          items-center
          gap-2
          flex-shrink-0
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
          w-10
          h-10
          rounded-lg
          bg="rgb(255 255 255 / 0.1)"
          flex
          items-center
          justify-center
          text-white
          hover:bg="rgb(255 255 255 / 0.2)"
          transition
          duration-200
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
        fixed
        inset-0
        z-40
        bg="rgb(10 58 82 / 0.98)"
        backdrop-blur-sm
        lg:hidden
        role="menu"
      >
        <!-- 关闭按钮 -->
        <button
          absolute
          top-4
          right-4
          w-10
          h-10
          rounded-lg
          bg="rgb(255 255 255 / 0.1)"
          flex
          items-center
          justify-center
          text-white
          hover:bg="rgb(255 255 255 / 0.2)"
          transition
          duration-200
          aria-label="关闭菜单"
          @click="closeMenu"
        >
          <div i-carbon-close text-xl aria-hidden="true" />
        </button>

        <!-- 菜单内容 -->
        <div
          flex
          flex-col
          items-center
          justify-center
          h-full
          gap-4
          v-keyboard-navigation="{
            selector: 'a[role=menuitem]',
            onEscape: handleEscape,
          }"
        >
          <!-- Logo 区域 -->
          <div text-center mb-8>
            <div
              w-16
              h-16
              mx-auto
              rounded-full
              bg="rgb(255 255 255 / 0.2)"
              flex
              items-center
              justify-center
              text-white
              text-3xl
              mb-4
              aria-hidden="true"
            >
              <div i-carbon-microscope />
            </div>
            <h2 text-white text-xl font-bold>
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
              text-xl
              font-medium
              py-3
              px-6
              rounded-lg
              transition
              duration-200
              :class="[
                isActive(link.path)
                  ? 'bg-white/20 text-white'
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
