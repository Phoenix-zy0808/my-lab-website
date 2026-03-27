import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind4,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#0a3a52',
      'primary-light': '#0f5a7a',
      'primary-dark': '#062838',
      secondary: '#578b9e',
      'secondary-light': '#7aa3b5',
      'secondary-dark': '#3d6f82',
      accent: '#7ab8c9',
    },
  },
  shortcuts: {
    // 基础按钮
    'btn': 'px-4 py-2 rounded inline-block bg-primary text-white cursor-pointer transition duration-200 hover:bg-primary-light disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    'btn-secondary': 'px-4 py-2 rounded inline-block bg-secondary text-white cursor-pointer transition duration-200 hover:bg-secondary-light disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    'btn-outline': 'px-4 py-2 rounded inline-block border-2 border-primary text-primary cursor-pointer transition duration-200 hover:bg-primary hover:text-white',
    'btn-resume': 'bg-primary text-white px-4 py-2 rounded hover:bg-primary-light transition duration-200 inline-flex items-center gap-1',
    'icon-btn': 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary',

    // 团队成员头像
    'member-photo': 'w-40 h-52 rounded-lg overflow-hidden shadow-lg bg-white',
    'member-photo-placeholder': 'w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold',

    // 卡片样式
    'card': 'bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl',
    'card-hover': 'bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-2xl hover:-translate-y-1',
    'card-border': 'bg-white rounded-lg border border-gray-200 p-6 transition duration-300 hover:shadow-lg',

    // 导航栏样式
    'navbar': 'bg-primary/95 backdrop-blur-sm text-white shadow-lg',
    'nav-link': 'text-white/80 hover:text-white transition duration-200 cursor-pointer relative py-3 px-4 text-base',
    'nav-link-active': 'text-white font-semibold bg-white/15 rounded-lg',

    // Hero 区域
    'hero-section': 'relative h-[60vh] min-h-[500px] bg-cover bg-center bg-no-repeat',
    'hero-section-md': 'relative h-[45vh] min-h-[350px] bg-cover bg-center bg-no-repeat',
    'hero-section-sm': 'relative h-[30vh] min-h-[200px] bg-cover bg-center bg-no-repeat',
    'hero-overlay': 'absolute inset-0 bg-black/40',
    'hero-content': 'relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4',
    'hero-title': 'text-4xl sm:text-5xl md:text-6xl font-bold mb-4',
    'hero-subtitle': 'text-xl sm:text-2xl op-90 mb-2',
    'hero-description': 'text-base sm:text-lg op-75 max-w-2xl',

    // 悬浮卡片
    'floating-cards': 'grid grid-cols-1 md:grid-cols-3 gap-6 floating-card',
    'floating-card': 'card bg-white/95 backdrop-blur-sm -mt-20 z-10 shadow-2xl',

    // 页面容器
    'page-container': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
    'content-card': 'page-container py-12',

    // 标题样式
    'section-title': 'text-3xl font-bold text-primary text-center mb-8',
    'section-subtitle': 'text-lg text-secondary text-center mb-12',
    'page-header': 'bg-secondary py-16',
    'page-title': 'text-4xl font-bold text-white text-center mb-4',
    'page-subtitle': 'text-lg text-white/80 text-center max-w-3xl mx-auto',

    // Tabs 样式
    'tabs': 'flex flex-wrap gap-2 mb-8',
    'tab-btn': 'px-4 py-2 rounded-lg transition-all duration-200',
    'tab-btn-active': 'bg-primary text-white shadow-lg',
    'tab-btn-inactive': 'bg-gray-100 text-gray-600 hover:bg-gray-200',

    // 列表样式
    'list-item': 'flex items-start gap-4 py-4 border-b border-gray-100 last:border-0',
    'list-item-hover': 'transition duration-200 hover:bg-gray-50 rounded-lg px-4 -mx-4',

    // 时间轴样式
    'timeline-item': 'flex gap-4 mb-6',
    'timeline-dot': 'w-3 h-3 rounded-full bg-secondary mt-1.5 flex-shrink-0',
    'timeline-content': 'flex-1',

    // 论文条目
    'publication-item': 'mb-6 last:mb-0 pb-6 last:pb-0 border-b border-gray-100 last:border-0',
    'publication-authors': 'text-sm text-gray-700',
    'publication-title': 'text-base font-semibold text-primary',
    'publication-journal': 'text-sm italic text-gray-600',
    'publication-link': 'text-sm text-secondary hover:underline cursor-pointer',
  },
  rules: [
    // 细胞结构背景效果
    ['cell-pattern', {
      'background-image': `radial-gradient(circle at 50% 50%, rgba(87, 139, 158, 0.1) 1px, transparent 1px)`,
      'background-size': '20px 20px',
    }],
  ],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
})
