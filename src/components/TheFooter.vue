<script setup lang="ts">
import type { SiteConfig } from '~/types'

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

onMounted(loadConfig)

const currentYear = new Date().getFullYear()

const friendLinks = [
  { name: '中国计量大学', url: 'https://www.cjlu.edu.cn/index.htm' },
  { name: '量新学院', url: 'https://liangxin.cjlu.edu.cn/' },
  { name: '材料与化学学院', url: 'https://clxy.cjlu.edu.cn/index.htm' },
]

const departments = computed(() => {
  if (config.value?.departments?.length)
    return config.value.departments

  if (config.value?.department)
    return config.value.department.split('/').map(item => item.trim()).filter(Boolean)

  return []
})

const phones = computed(() => {
  if (config.value?.phones?.length)
    return config.value.phones

  if (config.value?.phone)
    return config.value.phone.split('/').map(item => item.trim()).filter(Boolean)

  return []
})

const phoneText = computed(() => phones.value.join(' / '))
const departmentText = computed(() => departments.value.join(' / '))
</script>

<template>
  <footer text-white mt-16 bg-primary>
    <div class="mx-auto px-4 py-12 max-w-7xl lg:px-8 sm:px-6">
      <div gap-8 grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2>
        <div class="lg:col-span-2">
          <div mb-4 flex items-center space-x-3>
            <div i-carbon-microscope text-2xl />
            <div>
              <h3 text-lg font-bold>
                {{ config?.labName || '智能光谱分析与材料信息课题组' }}
              </h3>
              <p text-sm op="75">
                {{ config?.labNameEn || 'Intelligent Spectral Analysis and Materials Informatics Group' }}
              </p>
            </div>
          </div>
          <p op="80" text-sm leading-relaxed mb-6 max-w-3xl>
            {{ config?.description || '聚焦光谱信号解析、材料信息建模与智能检测应用，开展交叉研究与人才培养。' }}
          </p>
        </div>

        <div class="lg:col-span-1 lg:-ml-16">
          <h4 text-base font-semibold mb-4>
            联系方式
          </h4>
          <ul text-sm space-y-2 op="75">
            <li v-if="config?.address" flex gap-2 items-start>
              <div i-carbon-location class="mt-0.5 flex-shrink-0" />
              <span>{{ config.address }}</span>
            </li>
            <li v-if="config?.email" flex gap-2 items-center>
              <div i-carbon-email class="flex-shrink-0" />
              <a :href="`mailto:${config.email}`" class="transition-colors hover:text-white">
                {{ config.email }}
              </a>
            </li>
            <li v-if="phoneText" flex gap-2 items-center>
              <div i-carbon-phone class="flex-shrink-0" />
              <span>{{ phoneText }}</span>
            </li>
          </ul>
        </div>

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

      <div class="text-sm mt-8 px-4 pt-8 text-center border-t border-white/10 opacity-75 -mx-4 lg:px-8 sm:px-6 lg:-mx-8 sm:-mx-6">
        <p>
          &copy; {{ currentYear }} {{ config?.labName || '智能光谱分析与材料信息课题组' }}
        </p>
        <div class="mt-2 flex flex-wrap gap-x-6 gap-y-1 items-center justify-center">
          <span class="font-medium">
            {{ config?.university || '中国计量大学' }}
          </span>
          <span v-if="departmentText" class="opacity-85">
            {{ departmentText }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
