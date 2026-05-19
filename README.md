# 智能光谱分析与材料信息课题组官网

Intelligent Spectral Analysis and Materials Informatics Group

本项目是中国计量大学“智能光谱分析与材料信息课题组”官方网站，用于展示课题组定位、研究方向、团队成员、科研成果、研究进展、仪器设备、课题组生活和联系方式。网站内容以静态 JSON 数据驱动，适合后续持续维护、补充成员信息、更新成果附件和发布研究进展。

## 项目概览

- 课题组中文名：智能光谱分析与材料信息课题组
- 英文名：Intelligent Spectral Analysis and Materials Informatics Group
- 所属单位：中国计量大学，量新学院 / 材料与化学学院
- 研究定位：聚焦光谱信号解析、材料信息建模与智能检测应用，开展交叉研究与人才培养。
- 当前主要栏目：首页、团队成员、研究方向、成果展示、仪器设备、课题组生活、研究进展、联系我们

## 技术栈

- Vue 3
- Vite
- TypeScript
- Vue Router
- UnoCSS
- pnpm

## 本地运行

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

默认访问地址：

```text
http://localhost:3333
```

生产构建：

```bash
pnpm build
```

本地预览构建结果：

```bash
pnpm preview
```

类型检查：

```bash
pnpm typecheck
```

说明：当前项目构建可以正常通过；`typecheck` 仍可能暴露历史遗留类型问题，主要集中在部分旧组件和自动路由类型上，不等同于页面无法运行。

## 目录结构

```text
my-lab-website/
├─ public/
│  ├─ data/                 # 网站主要内容数据
│  │  ├─ site-config.json   # 课题组名称、学校学院、联系方式、首页背景等
│  │  ├─ team.json          # 团队成员、导师、学生、毕业生信息
│  │  ├─ research.json      # 研究方向
│  │  ├─ progress.json      # 研究进展列表
│  │  ├─ news.json          # 首页最新动态
│  │  ├─ achievements.json  # 论文、专利、软著、竞赛、项目等成果
│  │  ├─ publications.json  # 论文数据补充
│  │  └─ equipment.json     # 仪器设备
│  ├─ images/
│  │  ├─ logo/              # 网站 Logo 和透明背景 Logo
│  │  ├─ team/              # 团队成员照片
│  │  ├─ life/              # 课题组生活照片
│  │  ├─ contact/           # 联系页地图图片
│  │  └─ cards/             # 首页卡片图片
│  └─ pdfs/                 # 成果附件
│     ├─ paper/             # 论文附件
│     ├─ patent/            # 专利附件
│     ├─ copyright/         # 软件著作权附件
│     ├─ competition/       # 竞赛/获奖附件
│     └─ project/           # 项目附件
├─ src/
│  ├─ components/           # 公共组件，例如 Header、Footer、Hero、Tabs
│  ├─ pages/                # 页面文件
│  ├─ composables/          # 组合函数
│  ├─ styles/               # 全局样式和移动端适配
│  └─ types/                # TypeScript 类型定义
├─ docs/
│  └─ project-notes/        # 历史修改方案、数据更新说明、维护记录
└─ reference/               # 参考资料
```

## 内容维护指南

常规内容优先修改 `public/data` 下的 JSON 文件，不建议直接把正文写死在页面组件里。

- 修改课题组名称、英文名、学校学院、地址、邮箱、电话：`public/data/site-config.json`
- 修改导师、科研助理、硕士生、本科生、毕业生信息：`public/data/team.json`
- 修改四个研究方向及关键词：`public/data/research.json`
- 修改研究进展：`public/data/progress.json`
- 修改首页最新动态：`public/data/news.json`
- 修改成果展示：`public/data/achievements.json`
- 修改仪器设备：`public/data/equipment.json`

修改 JSON 后建议执行：

```bash
pnpm build
```

如果构建失败，优先检查 JSON 逗号、引号、路径和数组结构是否正确。

## 图片与附件放置规则

- Logo 放在 `public/images/logo/`，网页当前优先使用透明背景版本。
- 成员照片放在 `public/images/team/`，建议使用清晰正面照片，文件体积尽量压缩。
- 课题组生活照放在 `public/images/life/`，页面只引用代表性图片，不建议一次性把所有原图都加入提交。
- 论文 PDF 放在 `public/pdfs/paper/`。
- 专利 PDF 放在 `public/pdfs/patent/`。
- 软件著作权 PDF 放在 `public/pdfs/copyright/`。
- 竞赛、获奖、证书类附件放在 `public/pdfs/competition/`。
- 项目附件放在 `public/pdfs/project/`。

附件路径在 JSON 中建议写成以 `/` 开头的站内路径，例如：

```json
"/pdfs/patent/example.pdf"
```

当前成果附件采用“新标签页打开”的方式，不做站内 PDF 预览。这种方案兼容性更高，也更适合当前项目阶段。

## 页面维护重点

- 首页：负责建立第一印象，内容来自站点配置、首页卡片和最新动态。
- 团队成员：重点维护 `team.json`，成员照片路径要与 `public/images/team/` 对应。
- 研究方向：重点维护 `research.json`，每个方向包含标题、亮点、简介、研究重点、应用场景和关键词。
- 成果展示：重点维护 `achievements.json`，建议统一日期格式，附件能打开再填写路径。
- 课题组生活：页面只展示精选图片，避免把大量重复照片全部展示。
- 联系我们：联系方式来自 `site-config.json`，没有真实信息时不要写占位内容。

## 移动端适配说明

项目已经针对手机端做过基础优化：

- 顶部导航在移动端使用深蓝半透明背景，避免和白色页面融合。
- 移动端菜单使用全屏深色抽屉。
- 团队、成果等筛选项在小屏幕上支持横向滑动。
- 生活照在移动端改为更适合浏览的单列展示，并直接显示图片说明。
- Hero、卡片、分页和长文本在手机端做了字号和间距收缩。

后续新增页面或组件时，需要优先检查 390px 左右宽度下是否存在横向溢出、按钮过小、文字被遮挡、图片比例异常等问题。

## GitHub 上传流程

查看当前改动：

```bash
git status
```

暂存需要提交的文件：

```bash
git add README.md
```

如果确认要提交全部有效改动：

```bash
git add -A
```

提交：

```bash
git commit -m "Update lab website documentation"
```

推送到 GitHub：

```bash
git push origin main
```

如果 `git status` 中出现大量 `?? public/images/life/...`，说明这些图片还没有被 Git 跟踪；它们不会被上传。确认页面没有引用这些图片时，可以保持未跟踪，或者后续再统一清理。

## 提交前检查清单

- 执行 `pnpm build`，确认项目能正常构建。
- 检查新增图片是否真的被页面引用。
- 检查 PDF/图片路径是否能在浏览器中打开。
- 不要提交 `~$` 开头的 Office 临时文件。
- 不要提交无用的大体积原图、重复生活照或未使用 PPT。
- 修改成员、成果、研究方向后，优先检查移动端显示效果。

## 已知注意事项

- 构建时可能出现 `Duplicated imports "useScroll"` 警告，这是自动导入和本地同名组合函数造成的历史警告，不影响页面构建和运行。
- `typecheck` 可能暴露旧组件中的历史类型问题，后续如果要做代码质量整理，可以单独处理。
- PowerShell 直接读取中文 Markdown 时偶尔会显示乱码，文件本身通常是 UTF-8，可用支持 UTF-8 的编辑器查看。
