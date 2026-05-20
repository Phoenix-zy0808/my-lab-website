<script setup lang="ts">
import type { EquipmentItem, SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'EquipmentPage',
})

// SEO Meta
useSeoMeta({
  title: '仪器设备',
  description: '实验室拥有的先进科研设备，包括共聚焦拉曼光谱仪、时间分辨拉曼光谱系统等',
})

const config = ref<SiteConfig | null>(null)
const equipmentList = ref<EquipmentItem[]>([])

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

// 加载仪器设备数据
async function loadEquipment() {
  try {
    const res = await fetch('/data/equipment.json')
    equipmentList.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load equipment:', error)
  }
}

onMounted(() => {
  loadConfig()
  loadEquipment()
})
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
      <!-- 设备列表 -->
      <div v-if="equipmentList.length > 0" gap-8 grid grid-cols-1 md:grid-cols-2>
        <div
          v-for="item in equipmentList"
          :key="item.id"
          card
          class="group"
        >
          <!-- 设备图片 -->
          <div
            v-if="item.image"

            mb-4 rounded-lg bg-gray-100 aspect-video relative overflow-hidden
          >
            <OptimizedImage
              :src="item.image"
              :alt="item.name"

              h-full w-full transition duration-300 object-cover group-hover:scale-105
              @error="(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22225%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22225%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E暂无图片%3C/text%3E%3C/svg%3E'
              }"
            />
          </div>

          <!-- 设备名称 -->
          <h3 text-xl text-primary font-bold mb-2>
            {{ item.name }}
          </h3>

          <!-- 设备型号 -->
          <p v-if="item.model" text-sm text-gray-500 mb-3>
            型号：{{ item.model }}
          </p>

          <!-- 设备描述 -->
          <p text-sm text-gray-600 leading-relaxed mb-4>
            {{ item.description }}
          </p>

          <!-- 技术参数 -->
          <div v-if="item.specifications?.length" bg="oklch(56% 0.062 207.6)/10" mb-4 p-4 rounded-lg>
            <h4 text-sm text-primary font-semibold mb-2 flex gap-2 items-center>
              <div i-carbon-list text-lg />
              技术参数
            </h4>
            <ul text-sm text-gray-600 space-y-1>
              <li v-for="spec in item.specifications" :key="spec">
                {{ spec }}
              </li>
            </ul>
          </div>

          <!-- 位置和使用状态 -->
          <div text-sm flex flex-wrap gap-4>
            <div v-if="item.location" text-gray-500 flex gap-2 items-center>
              <div i-carbon-location text-lg />
              <span>{{ item.location }}</span>
            </div>
            <div v-if="item.status" flex gap-2 items-center>
              <span
                class="rounded-full h-2 w-2" :class="[
                  item.status === '可用' ? 'bg-green-500'
                  : item.status === '使用中' ? 'bg-yellow-500'
                    : item.status === '维修中' ? 'bg-red-500' : 'bg-gray-500',
                ]"
              />
              <span
                :class="item.status === '可用' ? 'text-green-600'
                  : item.status === '使用中' ? 'text-yellow-600'
                    : item.status === '维修中' ? 'text-red-600' : 'text-gray-600'"
              >
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else py-12 text-center>
        <div i-carbon-microscope text-6xl text-gray-300 mb-4 />
        <p text-gray-500>
          暂无设备信息
        </p>
      </div>
    </div>
  </div>
</template>
