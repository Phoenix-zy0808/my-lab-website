<script setup lang="ts">
import type { SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'ContactPage',
})

useSeoMeta({
  title: '联系我们',
  description: '联系智能光谱分析与材料信息课题组，获取研究合作、招生培养与学术交流相关信息。',
})

const config = ref<SiteConfig | null>(null)
const mapImage = '/images/contact/map.jpg'

async function loadConfig() {
  try {
    const res = await fetch('/data/site-config.json')
    config.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load site config:', error)
  }
}

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

onMounted(loadConfig)
</script>

<template>
  <div>
    <Hero
      size="medium"
      :background="config?.heroImage"
      :title="config?.labName || '智能光谱分析与材料信息课题组'"
      :subtitle="config?.labNameEn || 'Intelligent Spectral Analysis and Materials Informatics Group'"
      :description="config?.description || '聚焦光谱信号解析、材料信息建模与智能检测应用，开展交叉研究与人才培养。'"
    />

    <div page-container py-12>
      <div gap-12 grid grid-cols-1 lg:grid-cols-2>
        <div>
          <h2 text-2xl text-primary font-bold mb-6>
            联系方式
          </h2>

          <div space-y-6>
            <div flex gap-4 items-start>
              <div
                bg="oklch(56% 0.062 207.6)/10"
                text-xl text-primary rounded-lg flex flex-shrink-0 h-12 w-12 items-center justify-center
              >
                <div i-carbon-building />
              </div>
              <div>
                <h3 text-lg text-gray-800 font-semibold mb-1>
                  学校
                </h3>
                <p text-gray-600>
                  {{ config?.university }}
                </p>
              </div>
            </div>

            <div v-if="departments.length" flex gap-4 items-start>
              <div
                bg="oklch(56% 0.062 207.6)/10"
                text-xl text-primary rounded-lg flex flex-shrink-0 h-12 w-12 items-center justify-center
              >
                <div i-carbon-building />
              </div>
              <div>
                <h3 text-lg text-gray-800 font-semibold mb-1>
                  学院
                </h3>
                <p text-gray-600>
                  {{ departments.join('、') }}
                </p>
              </div>
            </div>

            <div v-if="config?.address" flex gap-4 items-start>
              <div
                bg="oklch(56% 0.062 207.6)/10"
                text-xl text-primary rounded-lg flex flex-shrink-0 h-12 w-12 items-center justify-center
              >
                <div i-carbon-location />
              </div>
              <div>
                <h3 text-lg text-gray-800 font-semibold mb-1>
                  地址
                </h3>
                <p text-gray-600>
                  {{ config.address }}
                </p>
              </div>
            </div>

            <div v-if="config?.email" flex gap-4 items-start>
              <div
                bg="oklch(56% 0.062 207.6)/10"
                text-xl text-primary rounded-lg flex flex-shrink-0 h-12 w-12 items-center justify-center
              >
                <div i-carbon-email />
              </div>
              <div>
                <h3 text-lg text-gray-800 font-semibold mb-1>
                  邮箱
                </h3>
                <a :href="`mailto:${config.email}`" text-secondary hover:underline>
                  {{ config.email }}
                </a>
              </div>
            </div>

            <div v-if="phones.length" flex gap-4 items-start>
              <div
                bg="oklch(56% 0.062 207.6)/10"
                text-xl text-primary rounded-lg flex flex-shrink-0 h-12 w-12 items-center justify-center
              >
                <div i-carbon-phone />
              </div>
              <div>
                <h3 text-lg text-gray-800 font-semibold mb-1>
                  电话
                </h3>
                <div text-gray-600 space-y-1>
                  <p v-for="phone in phones" :key="phone">
                    {{ phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 text-2xl text-primary font-bold mb-6>
            位置地图
          </h2>
          <div rounded-lg bg-gray-100 h-80 w-full overflow-hidden>
            <img
              :src="mapImage"
              alt="位置地图"
              h-full w-full object-cover
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            >
          </div>
          <div class="mt-4 text-center">
            <a
              href="https://uri.amap.com/marker?position=120.35071,30.30876&keyword=中国计量大学"
              target="_blank"
              rel="noopener noreferrer"
              btn-secondary inline-flex gap-2 items-center
            >
              <div i-carbon-map />
              在地图应用中打开
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
