<script setup lang="ts">
import type { SiteConfig } from '~/types'

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
  <footer text-white mt-16 bg-primary>
    <div class="mx-auto px-4 py-12 max-w-7xl lg:px-8 sm:px-6">
      <!-- 修改：改为 4 列布局，第一列更宽 -->
      <div gap-8 grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2>
        <!-- 实验室信息 - 占用 2 列 (更宽) -->
        <div class="lg:col-span-2">
          <div mb-4 flex items-center space-x-3>
            <div i-carbon-microscope text-2xl />
            <div>
              <h3 text-lg font-bold>
                {{ config?.labName || '智能光谱分析实验室' }}
              </h3>
              <p text-sm op="75">
                {{ config?.labNameEn || 'Laboratory for Intelligent Spectral Analysis' }}
              </p>
            </div>
          </div>
          <!-- 修改：只加宽模块，字体保持 text-sm 不变 -->
          <p op="80" text-sm leading-relaxed mb-6 max-w-3xl>
            {{ config?.description || '致力于拉曼与红外光谱技术的智能化创新及其在多领域的精准应用' }}
          </p>
        </div>

        <!-- 联系方式 - 左移四个文字长度 (约 4rem = 64px) -->
        <div class="lg:col-span-1 lg:-ml-16">
          <h4 text-base font-semibold mb-4>
            联系方式
          </h4>
          <ul text-sm space-y-2 op="75">
            <li flex gap-2 items-start>
              <div i-carbon-location class="mt-0.5 flex-shrink-0" />
              <span>{{ config?.address || '浙江省杭州市钱塘区学源街 258 号' }}</span>
            </li>
            <li flex gap-2 items-center>
              <div i-carbon-email class="flex-shrink-0" />
              <a :href="`mailto:${config?.email}`" class="transition-colors hover:text-white">
                {{ config?.email || 'contact@raman-lab.edu.cn' }}
              </a>
            </li>
            <li flex gap-2 items-center>
              <div i-carbon-phone class="flex-shrink-0" />
              <span>{{ config?.phone || '+86-XXX-XXXXXXXX' }}</span>
            </li>
          </ul>
        </div>

        <!-- 友情链接 - 右移一个文字长度 (修改：从 -ml-8 改为 ml-4) -->
        <div class="lg:ml-4 lg:col-span-1">
          <h4 text-base font-semibold mb-4>
            友情链接
          </h4>
          <ul text-sm space-y-2>
            <li v-for="link in friendLinks" :key="link.name">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="op-75 flex gap-2 transition-colors items-center hover:text-white"
              >
                <div i-carbon-launch text-xs class="flex-shrink-0" />
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="text-sm mt-8 px-4 pt-8 text-center border-t border-white/10 opacity-75 -mx-4 lg:px-8 sm:px-6 lg:-mx-8 sm:-mx-6">
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
