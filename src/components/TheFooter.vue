<script setup lang="ts">
import type { SiteConfig } from '~/types'

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

onMounted(() => {
  loadConfig()
})

const currentYear = new Date().getFullYear()

// 友情链接
const friendLinks = [
  { name: '中国计量大学', url: 'https://www.cjlu.edu.cn/index.htm' },
  { name: '量新学院', url: 'https://lxxy.cjlu.edu.cn/index.htm' },
  { name: '材料与化学学院', url: 'https://clxy.cjlu.edu.cn/index.htm' },
]
</script>

<template>
  <footer bg-primary text-white mt-16>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div grid grid-cols-1 md:grid-cols-12 gap-8>
        <!-- 实验室信息 -->
        <div class="md:col-span-5">
          <div flex items-center space-x-3 mb-4>
            <div i-carbon-microscope text-2xl />
            <div>
              <h3 text-lg font-bold>{{ config?.labName || '智能光谱分析实验室' }}</h3>
              <p text-sm op="75">{{ config?.labNameEn || 'Laboratory for Intelligent Spectral Analysis' }}</p>
            </div>
          </div>
          <p text-sm op="75 mb-4">
            {{ config?.description || '致力于拉曼与红外光谱技术的智能化创新及其在多领域的精准应用' }}
          </p>
        </div>

        <!-- 联系方式 -->
        <div class="md:col-span-3 md:ml-8">
          <h4 text-sm font-semibold mb-4>联系方式</h4>
          <ul space-y-2 text-sm op="75">
            <li flex items-center gap-2>
              <div i-carbon-location />
              <span>{{ config?.address || '浙江省杭州市钱塘区学源街 258 号' }}</span>
            </li>
            <li flex items-center gap-2>
              <div i-carbon-email />
              <a :href="`mailto:${config?.email}`" class="hover:text-white">
                {{ config?.email || 'contact@raman-lab.edu.cn' }}
              </a>
            </li>
            <li flex items-center gap-2>
              <div i-carbon-phone />
              <span>{{ config?.phone || '+86-XXX-XXXXXXXX' }}</span>
            </li>
          </ul>
        </div>

        <!-- 友情链接 -->
        <div class="md:col-span-4" :style="{ marginLeft: '8rem' }">
          <h4 text-sm font-semibold mb-4>友情链接</h4>
          <ul space-y-2 text-sm>
            <li v-for="link in friendLinks" :key="link.name">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="op-75 hover:text-white transition-colors flex items-center gap-2"
              >
                <div i-carbon-launch text-xs />
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="border-t border-white/10 mt-8 pt-8 text-center text-sm opacity-75 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <p>
          &copy; {{ currentYear }} {{ config?.labName || '智能光谱分析实验室' }}. All rights reserved.
        </p>
        <p class="mt-2">
          {{ config?.university || '中国计量大学' }} {{ config?.department || '量新学院' }}
        </p>
      </div>
    </div>
  </footer>
</template>
