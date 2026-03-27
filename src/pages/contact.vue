<script setup lang="ts">
import type { SiteConfig } from '~/types'
import { useSeoMeta } from '~/composables/useSeoMeta'

defineOptions({
  name: 'ContactPage',
})

// SEO Meta
useSeoMeta({
  title: '联系我们',
  description: '联系拉曼光谱实验室，获取更多信息或合作咨询',
})

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

// 地图配置（可选）
const mapConfig = {
  // 这里可以嵌入高德/百度/Google 地图 iframe
  // 例如：<iframe src="https://uri.amap.com/..." ...></iframe>
  url: '',
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
      <div grid grid-cols-1 lg:grid-cols-2 gap-12>
        <!-- 联系方式 -->
        <div>
          <h2 text-2xl font-bold text-primary mb-6>
            联系方式
          </h2>

          <div space-y-6>
            <!-- 地址 -->
            <div flex items-start gap-4>
              <div
                w-12
                h-12
                rounded-lg
                bg="oklch(56% 0.062 207.6)/10"
                flex
                items-center
                justify-center
                text-primary
                text-xl
                flex-shrink-0
              >
                <div i-carbon-location />
              </div>
              <div>
                <h3 text-lg font-semibold text-gray-800 mb-1>
                  地址
                </h3>
                <p text-gray-600>
                  {{ config?.address || 'XX 省 XX 市 XX 路 XX 号' }}
                </p>
              </div>
            </div>

            <!-- 邮箱 -->
            <div flex items-start gap-4>
              <div
                w-12
                h-12
                rounded-lg
                bg="oklch(56% 0.062 207.6)/10"
                flex
                items-center
                justify-center
                text-primary
                text-xl
                flex-shrink-0
              >
                <div i-carbon-email />
              </div>
              <div>
                <h3 text-lg font-semibold text-gray-800 mb-1>
                  邮箱
                </h3>
                <a
                  :href="`mailto:${config?.email}`"
                  text-secondary
                  hover:underline
                >
                  {{ config?.email || 'contact@raman-lab.edu.cn' }}
                </a>
              </div>
            </div>

            <!-- 电话 -->
            <div flex items-start gap-4>
              <div
                w-12
                h-12
                rounded-lg
                bg="oklch(56% 0.062 207.6)/10"
                flex
                items-center
                justify-center
                text-primary
                text-xl
                flex-shrink-0
              >
                <div i-carbon-phone />
              </div>
              <div>
                <h3 text-lg font-semibold text-gray-800 mb-1>
                  电话
                </h3>
                <p text-gray-600>
                  {{ config?.phone || '+86-XXX-XXXXXXXX' }}
                </p>
              </div>
            </div>

            <!-- 社交媒体 -->
            <div v-if="config?.socialLinks?.length">
              <h3 text-lg font-semibold text-gray-800 mb-4>
                关注我们
              </h3>
              <div flex gap-4>
                <a
                  v-for="link in config.socialLinks"
                  :key="link.platform"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  w-10
                  h-10
                  rounded-lg
                  bg="oklch(56% 0.062 207.6)/10"
                  flex
                  items-center
                  justify-center
                  text-primary
                  text-xl
                  hover:bg-primary
                  hover:text-white
                  transition
                  duration-200
                  :class="link.icon"
                  :title="link.platform"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 地图（可选） -->
        <div>
          <h2 text-2xl font-bold text-primary mb-6>
            位置地图
          </h2>
          <div
            w-full
            h-80
            rounded-lg
            overflow-hidden
            bg-gray-100
            flex
            items-center
            justify-center
          >
            <!-- 如果有地图 URL，嵌入 iframe -->
            <iframe
              v-if="mapConfig.url"
              :src="mapConfig.url"
              w-full
              h-full
              border-0
            />
            <!-- 占位图 -->
            <div v-else text-center text-gray-400>
              <div i-carbon-map text-4xl mb-2 />
              <p>地图加载中...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 留言表单（可选） -->
      <div mt-16>
        <h2 text-2xl font-bold text-primary mb-6>
          在线留言
        </h2>
        <div card>
          <form space-y-4>
            <div grid grid-cols-1 md:grid-cols-2 gap-4>
              <div>
                <label block text-sm font-medium text-gray-700 mb-2>
                  姓名
                </label>
                <input
                  type="text"
                  w-full
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  focus:ring-2
                  focus:ring-primary
                  focus:border-transparent
                />
              </div>
              <div>
                <label block text-sm font-medium text-gray-700 mb-2>
                  邮箱
                </label>
                <input
                  type="email"
                  w-full
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  focus:ring-2
                  focus:ring-primary
                  focus:border-transparent
                />
              </div>
            </div>
            <div>
              <label block text-sm font-medium text-gray-700 mb-2>
                  主题
                </label>
              <input
                type="text"
                w-full
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:ring-2
                focus:ring-primary
                focus:border-transparent
              />
            </div>
            <div>
              <label block text-sm font-medium text-gray-700 mb-2>
                留言内容
              </label>
              <textarea
                rows="5"
                w-full
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:ring-2
                focus:ring-primary
                focus:border-transparent
              />
            </div>
            <div>
              <button type="submit" btn>
                提交留言
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
