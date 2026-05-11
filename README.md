# 智能光谱分析与材料信息课题组官网

Intelligent Spectral Analysis and Materials Informatics Group

本项目是中国计量大学智能光谱分析与材料信息课题组官网，主要展示课题组介绍、研究方向、团队成员、科研成果、研究进展、仪器设备、课题组生活和联系方式。

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

## 目录说明

```text
my-lab-website/
├─ public/
│  ├─ data/                 # 网站内容数据
│  │  ├─ site-config.json   # 课题组名称、学校学院、联系方式等
│  │  ├─ team.json          # 团队成员
│  │  ├─ research.json      # 研究方向
│  │  ├─ progress.json      # 研究进展
│  │  ├─ achievements.json  # 论文、专利、软著、竞赛、项目等成果
│  │  └─ equipment.json     # 仪器设备
│  ├─ images/
│  │  ├─ logo/              # 网站 logo
│  │  ├─ team/              # 成员照片
│  │  └─ life/              # 课题组生活照片
│  └─ pdfs/                 # 成果附件
│     ├─ paper/
│     ├─ patent/
│     ├─ copyright/
│     ├─ competition/
│     └─ project/
├─ src/
│  ├─ components/           # 公共组件
│  ├─ pages/                # 页面
│  ├─ composables/          # 组合函数
│  └─ types/                # TypeScript 类型
└─ docs/
   └─ project-notes/        # 历史修改方案、数据更新说明等文档
```

## 内容维护

常用内容优先修改 `public/data` 下的 JSON 文件：

- 修改课题组名称、英文名、联系方式：`public/data/site-config.json`
- 修改团队成员：`public/data/team.json`
- 修改研究方向：`public/data/research.json`
- 修改研究进展：`public/data/progress.json`
- 修改成果展示：`public/data/achievements.json`
- 修改仪器设备：`public/data/equipment.json`

静态资源放置位置：

- Logo：`public/images/logo/`
- 成员照片：`public/images/team/`
- 课题组生活照片：`public/images/life/`
- 论文附件：`public/pdfs/paper/`
- 专利附件：`public/pdfs/patent/`
- 软著附件：`public/pdfs/copyright/`
- 竞赛/获奖附件：`public/pdfs/competition/`
- 项目附件：`public/pdfs/project/`

## 上传到 GitHub

查看改动：

```bash
git status
```

暂存改动：

```bash
git add -A
```

如果存在 `~$` 开头的 Office 临时文件，不要提交，先删除或保持未跟踪状态。

提交：

```bash
git commit -m "Update lab website content and images"
```

推送：

```bash
git push origin main
```

## 注意事项

- 不要把 Office 临时文件提交到仓库，例如 `~$xxx.pptx`。
- 图片和 PDF 文件名可以使用中文，但应避免过长、空格过多或特殊符号过多。
- 成果附件目前采用新标签页打开，不做站内 PDF 预览。
- 修改数据文件后建议执行 `pnpm build`，确认 JSON 和页面构建正常。
