# ESLint 代码规范检查错误修复方案

## 错误概述

在提交代码时，`lint-staged` 触发的 `pre-commit` 钩子执行 `eslint --fix` 失败，存在以下问题：

### 错误信息
```
G:\my-lab-website\my-lab-website\src\pages\team.vue
   83:7   error    'roleMap' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars
  639:60  warning  UnoCSS utilities are not ordered unocss/order

✖ 2 problems (1 error, 1 warning)
```

---

## 问题分析

### 问题 1：未使用的变量 `roleMap`（错误 - 必须修复）

**位置**：`src/pages/team.vue` 第 83 行

**错误类型**：`unused-imports/no-unused-vars`

**原因**：
- `roleMap` 变量被定义但从未在代码中使用
- ESLint 规则要求所有未使用的变量必须以 `_` 开头（如 `_roleMap`）
- 这是一个 **error** 级别的错误，会阻止代码提交

**代码位置**：
```typescript
// 第 83 行附近
const roleMap: Record<TeamMember['role'], { label: string, color: string }> = {
  pi: { label: 'PI', color: 'bg-primary text-white' },
  research_assistant: { label: '科研助理', color: 'bg-accent text-white' },
  master_student: { label: '硕士生', color: 'bg-purple-100 text-purple-700' },
  undergraduate: { label: '本科生', color: 'bg-indigo-100 text-indigo-700' },
  graduated_master: { label: '已毕业硕士', color: 'bg-gray-100 text-gray-700' },
  graduated_undergraduate: { label: '已毕业本科', color: 'bg-gray-100 text-gray-700' },
}
```

**为什么未使用**：
- 在之前的修改中，科研助理的展示界面从左右分栏布局改为垂直列表布局
- 原本在左右分栏布局中，`roleMap` 用于显示角色标签的颜色和文字
- 改为垂直列表布局后，不再需要显示角色标签，因此 `roleMap` 变成未使用的变量

---

### 问题 2：UnoCSS 工具类未排序（警告 - 建议修复）

**位置**：`src/pages/team.vue` 第 639 行

**错误类型**：`unocss/order`

**原因**：
- UnoCSS/ Tailwind CSS 的类名需要按照特定顺序排列
- 这是一个 **warning** 级别的提示，不会阻止提交，但建议修复

**可能的代码**：
```html
<!-- 第 639 行附近的某个元素 -->
<div class="... 工具类顺序不正确 ...">
```

---

## 修复方案

### 方案 1：删除未使用的 `roleMap` 变量（推荐）

**适用场景**：如果 `roleMap` 确实不再使用

**修改位置**：`src/pages/team.vue` 第 83-90 行

**操作**：
直接删除整个 `roleMap` 定义代码块：

```typescript
// 删除以下代码：
const roleMap: Record<TeamMember['role'], { label: string, color: string }> = {
  pi: { label: 'PI', color: 'bg-primary text-white' },
  research_assistant: { label: '科研助理', color: 'bg-accent text-white' },
  master_student: { label: '硕士生', color: 'bg-purple-100 text-purple-700' },
  undergraduate: { label: '本科生', color: 'bg-indigo-100 text-indigo-700' },
  graduated_master: { label: '已毕业硕士', color: 'bg-gray-100 text-gray-700' },
  graduated_undergraduate: { label: '已毕业本科', color: 'bg-gray-100 text-gray-700' },
}
```

**验证方法**：
在文件中搜索 `roleMap`，确认没有任何地方使用它（除了定义处）

---

### 方案 2：重命名为 `_roleMap`（备用方案）

**适用场景**：如果未来可能会使用 `roleMap`，想保留代码

**修改位置**：`src/pages/team.vue` 第 83 行

**操作**：
将 `roleMap` 重命名为 `_roleMap`（添加下划线前缀）：

```typescript
// 修改前：
const roleMap: Record<TeamMember['role'], { label: string, color: string }> = {
  ...
}

// 修改后：
const _roleMap: Record<TeamMember['role'], { label: string, color: string }> = {
  ...
}
```

**说明**：
- ESLint 规则允许以 `_` 开头的未使用变量
- 这是一种常见的代码约定，表示"有意未使用"

---

### 方案 3：自动修复 UnoCSS 类名顺序（警告）

**修改位置**：`src/pages/team.vue` 第 639 行

**操作**：
运行以下命令自动修复：

```bash
pnpm eslint src/pages/team.vue --fix
```

**或者手动修复**：
找到第 639 行的元素，按照 UnoCSS 推荐顺序重新排列类名：

**推荐顺序**：
1. 布局相关：`flex`, `grid`, `block`, `inline` 等
2. 尺寸相关：`w-*`, `h-*`, `p-*`, `m-*` 等
3. 颜色相关：`text-*`, `bg-*`, `border-*` 等
4. 样式相关：`rounded-*`, `shadow-*`, `font-*` 等
5. 交互相关：`hover:*`, `focus:*`, `transition-*` 等

**示例**：
```html
<!-- 修改前（顺序可能不正确） -->
<div class="bg-white p-4 rounded-lg shadow-md flex items-center">

<!-- 修改后（正确顺序） -->
<div class="flex items-center p-4 bg-white rounded-lg shadow-md">
```

---

## 推荐修复步骤

### 步骤 1：删除未使用的 `roleMap`
```
文件：src/pages/team.vue
位置：第 83-90 行
操作：删除整个 roleMap 定义
```

### 步骤 2：自动修复 UnoCSS 顺序
```bash
# 运行 eslint 自动修复
pnpm eslint src/pages/team.vue --fix
```

### 步骤 3：验证修复结果
```bash
# 再次运行 eslint 检查
pnpm eslint src/pages/team.vue
```

**预期输出**：
```
✓ 0 problems (0 errors, 0 warnings)
```

### 步骤 4：重新提交代码
```bash
git add src/pages/team.vue
git commit -m "fix: 修复 ESLint 代码规范检查错误"
```

---

## 修改文件清单

| 文件 | 修改类型 | 修改内容 |
|------|---------|---------|
| `src/pages/team.vue` | 删除代码 | 删除第 83-90 行的 `roleMap` 定义 |
| `src/pages/team.vue` | 自动修复 | UnoCSS 类名顺序（运行 `--fix`） |

**总计：1 个文件，2 处修改**

---

## 预防措施

### 1. 提交前检查
在提交代码前，先运行 lint 检查：
```bash
pnpm lint
```

### 2. 配置 IDE
在 VS Code 中安装以下扩展：
- ESLint
- UnoCSS
- Vue - Official

配置 `settings.json`：
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.unocss": true
  }
}
```

### 3. 删除无用代码
- 修改功能后，及时删除不再使用的变量和函数
- 避免保留"可能以后会用"的代码

---

## 常见问题

### Q1：为什么 ESLint 会阻止提交？
**A**：项目配置了 `lint-staged` 和 `pre-commit` 钩子，在提交前自动运行 `eslint --fix`。如果存在 error 级别的错误，提交会失败。

### Q2：可以跳过 lint 检查吗？
**A**：不推荐。但紧急情况下可以使用：
```bash
git commit --no-verify -m "commit message"
```

### Q3：如何查看完整的 ESLint 规则？
**A**：查看配置文件：
```bash
cat eslint.config.js
```

---

**创建时间**: 2026年4月4日  
**版本**: v1.0
