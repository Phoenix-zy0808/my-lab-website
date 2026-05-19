<script setup lang="ts">
import type { SiteConfig } from '~/types'
import { useScroll } from '~/composables/useScroll'

const route = useRoute()
const config = ref<SiteConfig | null>(null)
const loadingError = ref<string | null>(null)
const isLoading = ref(true)
const isMobileMenuOpen = ref(false)

const { isScrolled } = useScroll(100)

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

async function loadConfig() {
  isLoading.value = true
  loadingError.value = null

  try {
    const res = await fetch('/data/site-config.json')
    if (!res.ok)
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)

    config.value = await res.json()
  }
  catch (error) {
    loadingError.value = '站点配置加载失败，请刷新页面后重试。'
    console.error('Failed to load site config:', error)
  }
  finally {
    isLoading.value = false
  }
}

function isActive(path: string) {
  return route.path === path
}

function toggleMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMenu() {
  isMobileMenuOpen.value = false
}

function handleEscape() {
  if (isMobileMenuOpen.value)
    closeMenu()
}

watch(isMobileMenuOpen, (value) => {
  if (value) {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    document.body.classList.add('menu-open')
  }
  else {
    const top = document.body.style.top
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    document.body.classList.remove('menu-open')
    const scrollY = Number.parseInt(top || '0')
    if (scrollY)
      window.scrollTo(0, Math.abs(scrollY))
  }
}, { immediate: true })

onMounted(loadConfig)

onUnmounted(() => {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open')
})
</script>

<template>
  <header
    role="banner"
    transition-all duration-300 left-0 right-0 top-0 fixed z-50
    class="bg-primary/88 shadow-sm backdrop-blur-md md:bg-transparent md:shadow-none md:backdrop-blur-0"
    :class="[
      isScrolled || isMobileMenuOpen ? 'md:bg-primary/78 md:backdrop-blur-md md:shadow-sm' : '',
    ]"
  >
    <div
      v-if="loadingError"
      text-sm text-white px-4 py-2 text-center bg-red-600 left-0 right-0 top-full absolute
    >
      {{ loadingError }}
    </div>

    <div class="mx-auto px-4 max-w-7xl lg:px-8 sm:px-6">
      <div flex h-18 items-center justify-between>
        <RouterLink
          to="/"
          flex flex-1 gap-3 min-w-0 items-center md:flex-none
          class="group nav-link"
          aria-label="返回首页"
        >
          <div
            class="rounded-xl flex h-11 w-11 transition duration-300 items-center justify-center overflow-hidden group-hover:scale-105"
            aria-hidden="true"
          >
            <img
              v-if="!isLoading"
              src="/images/logo/logo-transparent.png"
              alt=""
              class="h-full w-full object-contain"
            >
            <div v-else class="i-carbon-circle-dash animate-spin" text-xl />
          </div>

          <div class="min-w-0">
            <h1 text-lg text-white font-bold whitespace-nowrap truncate class="max-w-[calc(100vw-7rem)] lg:max-w-none md:max-w-[18rem] sm:max-w-[28rem]">
              {{ config?.labName || (isLoading ? '加载中...' : '智能光谱分析与材料信息课题组') }}
            </h1>
            <p
              v-if="config?.labNameEn || isLoading"
              text-xs hidden whitespace-nowrap truncate sm:block
              class="max-w-[28rem] lg:max-w-none md:max-w-[18rem]"
              :style="{ color: 'rgba(255,255,255,0.6)' }"
            >
              {{ config?.labNameEn || 'Intelligent Spectral Analysis and Materials Informatics Group' }}
            </p>
          </div>
        </RouterLink>

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

        <button
          class="border border-white/20 shadow-sm md:hidden"
          type="button"
          bg="rgb(255 255 255 / 0.18)"
          hover:bg="rgb(255 255 255 / 0.28)"
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
        class="bg-[#062838]/98 inset-0 fixed z-60 overflow-y-auto backdrop-blur-md lg:hidden"
        role="menu"
      >
        <button
          bg="rgb(255 255 255 / 0.18)"
          hover:bg="rgb(255 255 255 / 0.28)"
          text-white rounded-lg flex h-10 w-10 transition duration-200 items-center right-4 top-4 justify-center absolute
          class="border border-white/20 shadow-sm"
          aria-label="关闭菜单"
          @click="closeMenu"
        >
          <div i-carbon-close text-xl aria-hidden="true" />
        </button>

        <div
          v-keyboard-navigation="{
            selector: 'a[role=menuitem]',
            onEscape: handleEscape,
          }"
          class="px-4 py-16 flex flex-col gap-2 min-h-full items-center justify-start sm:justify-center"
        >
          <div class="mb-4 text-center max-w-full sm:mb-8">
            <div
              class="mx-auto mb-4 rounded-2xl flex h-18 w-18 items-center justify-center overflow-hidden"
              aria-hidden="true"
            >
              <img
                src="/images/logo/logo-transparent.png"
                alt=""
                class="h-full w-full object-contain"
              >
            </div>
            <h2 text-xl text-white leading-snug font-bold>
              {{ config?.labName || '智能光谱分析与材料信息课题组' }}
            </h2>
            <p text-sm leading-relaxed :style="{ color: 'rgba(255,255,255,0.6)' }">
              {{ config?.labNameEn || 'Intelligent Spectral Analysis and Materials Informatics Group' }}
            </p>
          </div>

          <template v-for="link in navLinks" :key="link.path">
            <RouterLink
              :to="link.path"
              role="menuitem"
              :style="{ color: 'rgba(255,255,255,0.8)' }"
              class="text-center border border-white/10 bg-white/8 max-w-xs w-full shadow-sm justify-center hover:text-white!"
              text-lg font-medium px-6 py-2.5 rounded-xl transition duration-200 sm:text-xl sm:py-3
              :class="[
                isActive(link.path)
                  ? 'bg-white/22 text-white font-bold border-white/35'
                  : 'hover:bg-white/14',
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
