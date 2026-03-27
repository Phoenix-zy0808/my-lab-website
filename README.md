# 拉曼光谱实验室官网

<div align="center">

[![Vue 3](https://img.shields.io/badge/Vue_3-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-f58543?logo=unocss&logoColor=white)](https://unocss.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-f69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Netlify](https://img.shields.io/badge/Netlify-00c7b7?logo=netlify&logoColor=white)](https://www.netlify.com/)

</div>

---

## 📖 项目简介

本项目是**拉曼光谱实验室**的官方网站，致力于展示实验室的研究方向、团队成员、科研成果及仪器设备。网站采用现代化的前端技术栈构建，提供流畅的用户体验和响应式设计。

### 核心功能

- 🏠 **首页** - 实验室概览、最新研究进展
- 👥 **团队成员** - 教授、研究员、学生介绍
- 🔬 **研究方向** - 拉曼光谱技术的基础研究与应用开发
- 📄 **成果展示** - 论文、专利、科研项目
- 🧪 **仪器设备** - 实验室先进设备展示
- 📰 **研究进展** - 实验室动态与最新资讯
- 📞 **联系我们** - 联系方式与地址信息

---

## 🚀 技术栈

| 技术 | 版本 | 描述 |
|------|------|------|
| [Vue 3](https://vuejs.org/) | Latest | 渐进式 JavaScript 框架 |
| [Vite](https://vitejs.dev/) | Latest | 下一代前端构建工具 |
| [TypeScript](https://www.typescriptlang.org/) | Latest | JavaScript 的超集 |
| [Vue Router](https://router.vuejs.org/) | v4 | 官方路由管理器 |
| [UnoCSS](https://unocss.dev/) | Latest | 即时原子化 CSS 引擎 |
| [VueUse](https://vueuse.org/) | Latest | Composition API 工具集 |
| [Vitest](https://vitest.dev/) | Latest | 单元测试框架 |
| [ESLint](https://eslint.org/) | Latest | 代码检查工具 |

### 核心插件

- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - 自动导入 Vue Composition API
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) - 组件自动注册
- [`unplugin-vue-macros`](https://github.com/sxzz/unplugin-vue-macros) - Vue 宏语法扩展
- [`@iconify-json/carbon`](https://iconify.design/) - Carbon 图标集

---

## 📦 快速开始

### 环境要求

- Node.js >= 20.x
- pnpm >= 9.x

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:3333` 预览效果。

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
pnpm preview
```

### 代码检查

```bash
# ESLint 检查
pnpm lint

# TypeScript 类型检查
pnpm typecheck
```

---

## 📁 项目结构

```
my-lab-website/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Card.vue         # 卡片组件
│   │   ├── Header.vue       # 导航栏
│   │   ├── Hero.vue         # 首屏展示
│   │   ├── TeamCard.vue     # 团队成员卡片
│   │   ├── Timeline.vue     # 时间轴组件
│   │   └── ...
│   ├── composables/         # Composition API 组合函数
│   │   ├── useScroll.ts     # 滚动检测
│   │   ├── useSeoMeta.ts    # SEO 元数据
│   │   ├── useFetchData.ts  # 数据获取
│   │   └── ...
│   ├── pages/               # 页面组件（文件路由）
│   │   ├── index.vue        # 首页
│   │   ├── team.vue         # 团队页面
│   │   ├── research.vue     # 研究方向
│   │   ├── achievements.vue # 成果展示
│   │   ├── equipment.vue    # 仪器设备
│   │   ├── progress.vue     # 研究进展
│   │   ├── life.vue         # 课题组生活
│   │   └── contact.vue      # 联系我们
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   ├── styles/              # 全局样式
│   ├── directives/          # 自定义指令
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── public/
│   ├── data/                # JSON 数据文件
│   │   ├── site-config.json # 站点配置
│   │   ├── news.json        # 新闻数据
│   │   └── ...
│   └── images/              # 静态图片资源
├── uno.config.ts            # UnoCSS 配置
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖配置
```

---

## 🎨 设计规范

### 主题色

| 颜色 | 色值 | 用途 |
|------|------|------|
| Primary | `#0a3a52` | 主色调，用于导航栏、标题 |
| Primary Light | `#0f5a7a` | 悬停状态 |
| Primary Dark | `#062838` | 深色背景 |
| Secondary | `#578b9e` | 辅助色，用于强调 |
| Accent | `#7ab8c9` | 点缀色 |

### 快捷样式（Shortcuts）

UnoCSS 预定义了以下常用样式类：

```ts
'btn'              // 基础按钮
'btn-secondary'    // 辅助按钮
'btn-outline'      // 描边按钮
'card'             // 卡片样式
'card-hover'       // 悬停卡片
'navbar'           // 导航栏
'hero-section'     // 首屏区域
'section-title'    // 章节标题
'page-container'   // 页面容器
```

---

## 📝 数据配置

### 站点配置

编辑 `public/data/site-config.json` 修改站点基本信息：

```json
{
  "labName": "拉曼光谱实验室",
  "labNameEn": "Raman Spectroscopy Laboratory",
  "description": "致力于拉曼光谱技术的基础研究与应用开发",
  "university": "XX 大学",
  "department": "XX 学院",
  "address": "XX 省 XX 市 XX 路 XX 号",
  "email": "contact@lab.edu.cn",
  "phone": "+86-XXX-XXXXXXXX",
  "socialLinks": []
}
```

### 添加新闻

编辑 `public/data/news.json`：

```json
[
  {
    "id": "1",
    "title": "实验室在 Nature 发表最新研究成果",
    "summary": "研究团队在拉曼光谱成像领域取得突破性进展...",
    "date": "2026-03-20",
    "category": "实验室动态"
  }
]
```

---

## 🔧 开发指南

### 添加新页面

在 `src/pages/` 目录下创建新的 `.vue` 文件，路由将自动生成：

```vue
<script setup lang="ts">
defineOptions({ name: 'NewPage' })
</script>

<template>
  <div>新页面内容</div>
</template>
```

### 添加新组件

在 `src/components/` 目录下创建组件，组件将自动注册：

```vue
<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="card">{{ title }}</div>
</template>
```

### 使用 Composition API

```ts
// src/composables/useCustom.ts
export function useCustom() {
  const state = ref(0)
  const action = () => state.value++
  return { state, action }
}

// 在组件中使用（自动导入）
const { state, action } = useCustom()
```

### 使用图标

```vue
<template>
  <div i-carbon-home />
  <div i-carbon-microscope />
</template>
```

搜索更多图标：[🔍 Icônes](https://icones.netlify.app/)

---

## 🚢 部署

### Netlify 部署

项目已配置 `netlify.toml`，连接 GitHub 仓库后即可自动部署。

```toml
[build]
publish = "dist"
command = "pnpm run build"
```

### 手动部署

```bash
pnpm build
# 将 dist 目录上传至任意静态托管服务
```

---

## ✅ 可用脚本

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | ESLint 代码检查 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm test` | 运行单元测试 |
| `pnpm up` | 更新依赖至最新版本 |

---

## 📄 许可证

[MIT License](./LICENSE)

---

## 🙏 致谢

本项目基于 [Vitesse Lite](https://github.com/antfu-collective/vitesse-lite) 模板构建。

感谢以下开源项目：

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [UnoCSS](https://unocss.dev/)
- [VueUse](https://vueuse.org/)
- [Iconify](https://iconify.design/)

---

<div align="center">

**拉曼光谱实验室** | Raman Spectroscopy Laboratory

</div>
