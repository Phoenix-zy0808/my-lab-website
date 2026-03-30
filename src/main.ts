import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { usePerformance } from './composables/usePerformance'
import { setupDirectives } from './directives'

import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})

// 注册自定义指令
setupDirectives(app)

app.use(router)
app.mount('#app')

// 性能监控
const { reportPerformance } = usePerformance()
reportPerformance()
