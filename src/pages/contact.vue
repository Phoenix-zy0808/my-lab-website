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
  }
  catch (error) {
    console.error('Failed to load site config:', error)
  }
}

onMounted(() => {
  loadConfig()
})

// 地图配置（使用图片）
const mapImage = '/images/contact/map.jpg'
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
      <div gap-12 grid grid-cols-1 lg:grid-cols-2>
        <!-- 联系方式 -->
        <div>
          <h2 text-2xl text-primary font-bold mb-6>
            联系方式
          </h2>

          <div space-y-6>
            <!-- 地址 -->
            <div flex gap-4 items-start>
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
                  {{ config?.address || '浙江省杭州市 XX 路 XX 号' }}
                </p>
              </div>
            </div>

            <!-- 邮箱 -->
            <div flex gap-4 items-start>
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
            <div flex gap-4 items-start>
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
                <p text-gray-600>
                  {{ config?.phone || '+86-XXX-XXXXXXXX' }}
                </p>
              </div>
            </div>

            <!-- 社交媒体 -->
            <div v-if="config?.socialLinks?.length">
              <h3 text-lg text-gray-800 font-semibold mb-4>
                关注我们
              </h3>
              <div flex gap-4>
                <a
                  v-for="link in config.socialLinks"
                  :key="link.platform"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"

                  bg="oklch(56% 0.062 207.6)/10"

                  text-xl text-primary rounded-lg flex h-10 w-10 transition duration-200 items-center justify-center hover:text-white hover:bg-primary
                  :class="link.icon"
                  :title="link.platform"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 地图（图片） -->
        <div>
          <h2 text-2xl text-primary font-bold mb-6>
            位置地图
          </h2>
          <div

            rounded-lg bg-gray-100 h-80 w-full overflow-hidden
          >
            <img
              :src="mapImage"
              alt="位置地图"

              h-full w-full object-cover
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            >
          </div>
          <!-- 地图链接（可选） -->
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

      <!-- 留言表单（可选） -->
      <div mt-16>
        <h2 text-2xl text-primary font-bold mb-6>
          在线留言
        </h2>
        <div card>
          <form space-y-4>
            <div gap-4 grid grid-cols-1 md:grid-cols-2>
              <div>
                <label text-sm text-gray-700 font-medium mb-2 block>
                  姓名
                </label>
                <input
                  type="text"

                  px-4 py-2 border border-gray-300 rounded-lg w-full focus:border-transparent focus:ring-2 focus:ring-primary
                >
              </div>
              <div>
                <label text-sm text-gray-700 font-medium mb-2 block>
                  邮箱
                </label>
                <input
                  type="email"

                  px-4 py-2 border border-gray-300 rounded-lg w-full focus:border-transparent focus:ring-2 focus:ring-primary
                >
              </div>
            </div>
            <div>
              <label text-sm text-gray-700 font-medium mb-2 block>
                主题
              </label>
              <input
                type="text"

                px-4 py-2 border border-gray-300 rounded-lg w-full focus:border-transparent focus:ring-2 focus:ring-primary
              >
            </div>
            <div>
              <label text-sm text-gray-700 font-medium mb-2 block>
                留言内容
              </label>
              <textarea
                rows="5"

                px-4 py-2 border border-gray-300 rounded-lg w-full focus:border-transparent focus:ring-2 focus:ring-primary
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
