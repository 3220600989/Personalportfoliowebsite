# AGENTS.md

> 本文件用于指导 AI 编码代理（Cursor / Claude Code / Codex / Copilot Agent 等）在本仓库中开发。  
> 所有代理在修改代码前必须先阅读本文件，并遵守其中的约定。  
> 关联文档：`docs/PRD.md`（产品需求）、`docs/TDD.md`（技术设计）。

---

## 1. 项目概述

个人作品集网站，单页锚点结构（Hero / About / Projects / Contact），深色主题，静态部署，无后端。

- **目标用户**：招聘方、面试官、合作方、同行。
- **核心目标**：5 秒内传达“我是谁、做什么、如何联系”；展示 3–6 个项目；移动端可用；Lighthouse ≥ 90。
- **非目标**：CMS、多语言、博客、登录、评论、表单后端（均不在 v1.0 范围）。

---

## 2. 技术栈（不可随意替换）

| 层级 | 选型 | 说明 |
|---|---|---|
| 框架 | Astro 5.x | SSG，禁止改为 SSR 或 Next.js，除非用户明确要求 |
| 样式 | Tailwind CSS 4.x | 通过 `@theme` 定义 token，禁止引入其他 CSS 框架 |
| 语言 | TypeScript | 禁止用 `any` 绕过类型；必要处用 `unknown` + 收窄 |
| 运行时 | Node.js 20+ | — |
| 包管理 | npm | 不混用 pnpm/yarn，除非用户要求 |
| 部署 | Vercel / Netlify / Cloudflare Pages | 静态输出 `dist/` |

**禁止引入的依赖**：GSAP、Framer Motion、jQuery、Bootstrap、MUI、大型 UI 库、动画库、状态管理库。动效一律用 CSS + 原生 IntersectionObserver。

---

## 3. 常用命令

```bash
npm install          # 安装依赖
npm run dev          # 本地开发，默认 http://localhost:4321
npm run build        # 生产构建，输出 dist/
npm run preview      # 预览构建产物
npx astro check      # 类型与 Astro 语法检查
```

提交前必须保证：

1. `npx astro check` 无错误。
2. `npm run build` 成功。
3. 本地 `npm run preview` 页面可正常浏览。

---

## 4. 目录结构与职责

```
src/
├── assets/          # 需构建优化的图片（头像、项目截图）
├── components/      # 展示组件，只接收 props，不直接读数据文件
├── data/            # 站点元信息、个人资料、项目数据
├── layouts/         # BaseLayout：head、导航、页脚、全局脚本
├── pages/           # 路由页面，只做组合
├── styles/          # global.css：Tailwind 引入 + 设计 token
└── types/           # 共享类型定义
public/              # 不参与构建处理的静态文件（favicon、robots、OG 图）
```

**硬性规则**：

- 页面（`pages/`）只组合组件，不写业务文案和硬编码数据。
- 组件（`components/`）不直接 import `data/`，数据由页面通过 props 传入。
- 所有对外链接、社交地址集中在 `src/data/site.ts`，禁止散落硬编码。
- 需要优化的图片放 `src/assets/`，用 Astro `<Image>`；`public/` 只放 favicon、robots、OG 图等。

---

## 5. 代码规范

### 5.1 通用
- 使用 2 空格缩进，单引号，语句结尾分号，由 Prettier 统一。
- 文件名：组件用 PascalCase（`ProjectCard.astro`），数据/工具用 kebab-case 或 camelCase（`projects.ts`）。
- 禁止提交 `console.log`、注释掉的死代码、未使用的 import。
- 禁止 `!important`，除非覆盖第三方样式且有注释说明。

### 5.2 TypeScript
- 所有数据结构在 `src/types/index.ts` 定义接口。
- 禁止 `any`；外部数据用 `unknown` 并做类型收窄。
- 可选字段用 `?`，组件中对可选字段做空值处理，不假设存在。

### 5.3 Astro 组件
- 组件顶部用 `---` 写导入与 props 解构，并声明 `interface Props`。
- 组件职责单一，超过约 150 行考虑拆分。
- 动态内容必须转义，禁止直接 `set:html` 渲染用户/外部内容。
- 外链统一：

```astro
<a href={url} target="_blank" rel="noopener noreferrer">
```

- 无链接时不要渲染空 `href`，渲染禁用态文本（如“暂无公开链接”）。

### 5.4 脚本
- 客户端脚本尽量内联在组件或 layout 中，使用 `is:inline` 仅在必要时。
- 脚本必须幂等，不依赖执行顺序；元素不存在时直接返回，不报错。
- 禁止全局变量污染，使用 IIFE 或模块作用域。

---

## 6. 样式规范

### 6.1 设计 Token（`src/styles/global.css`）

```css
@import "tailwindcss";

@theme {
  --color-bg: #0B0F17;
  --color-card: #121826;
  --color-text: #E5E7EB;
  --color-muted: #9CA3AF;
  --color-accent: #3B82F6;
  --color-border: rgba(255, 255, 255, 0.08);
  --radius-card: 12px;
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

### 6.2 使用规则
- 颜色一律使用 token 对应的 Tailwind 类（`bg-bg`、`text-muted`、`border-border`），禁止在组件中写死十六进制。
- 新增颜色/圆角/间距必须先加到 `@theme`，再使用。
- 字体优先系统字体栈，禁止无必要引入自定义字体；如引入需子集化 + `font-display: swap`。
- 标题字号用 `clamp()` 实现流式缩放。
- 卡片阴影克制，用边框区分层级，禁止重阴影和发光滥用。
- 文字与背景对比度满足 WCAG AA（正文 ≥ 4.5:1，大字 ≥ 3:1）。

### 6.3 响应式
- 移动优先，断点：默认 < 768px，`md` ≥ 768px，`lg` ≥ 1024px。
- 项目卡片：移动单列，`md` 双列，`lg` 三列。
- 内容容器：`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8`。
- 区块间距：`py-20 md:py-28`。
- 禁止固定宽度导致横向滚动；图片 `max-w-full h-auto`。
- 触控目标最小 44×44px。

---

## 7. 动效规范（强约束）

### 7.1 渐进增强（最重要）
**内容默认必须可见。** 禁止在无 JS 时让内容 `opacity: 0`。

正确做法：

1. 内联脚本在 `<html>` 上添加 `js` 类。
2. CSS 仅对 `.js [data-reveal]` 设置初始隐藏。
3. IntersectionObserver 添加 `.is-visible` 显示。
4. 无 JS 或 `prefers-reduced-motion: reduce` 时内容直接可见。

```css
.js [data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 400ms ease, transform 400ms ease;
}
.js [data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .js [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
  html { scroll-behavior: auto; }
}
```

### 7.2 其他规则
- 动画时长 200–500ms，只动 `opacity` 和 `transform`，不动布局属性。
- 滚动显现使用 IntersectionObserver，元素进入视口后 `unobserve`，禁止监听 `scroll` 做计算。
- 锚点平滑滚动用 CSS `scroll-behavior: smooth`，目标元素设置 `scroll-margin-top`。
- 卡片 hover 只做轻微上浮 + 边框/图片缩放，触屏不依赖 hover 传达信息。
- 必须尊重 `prefers-reduced-motion`。
- 禁止引入动画库。

---

## 8. 可访问性（强制）

- 语义化标签：`header`、`nav`、`main`、`section`、`footer`，每页只有一个 `h1`。
- 所有图片必须有 `alt`；装饰图 `alt=""`。
- 交互元素用原生 `a` / `button`，禁止用 `div` 加点击事件替代。
- 焦点样式必须可见，使用 `focus-visible`，禁止 `outline: none` 无替代。
- 移动端菜单：`aria-expanded`、`aria-controls`、Esc 关闭、打开锁 body 滚动、关闭后焦点归还触发按钮。
- 提供“跳到主要内容” skip link。
- 复制成功等状态提示使用 `aria-live="polite"`。
- 颜色对比度达标，新增颜色需校验。

---

## 9. SEO 与元信息

- `BaseLayout` 必须接收并渲染：`title`、`description`、`ogImage`、`canonical`。
- 每页独立 `title` 和 `description`，禁止所有页面共用同一描述。
- `astro.config.mjs` 的 `site` 必须是正式域名，用于 sitemap 和绝对 URL。
- 首页注入 Person JSON-LD。
- 404 页设置 `noindex`。
- `public/robots.txt` 指向 sitemap。
- OG 图 1200×630，放 `public/og-image.png`。

---

## 10. 性能预算

| 指标 | 目标 |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Lighthouse 性能/可访问性/SEO | ≥ 90 |

规则：

- 首屏头像 `loading="eager"` + `fetchpriority="high"`。
- 非首屏图片 `loading="lazy"` + `decoding="async"`。
- 所有图片提供宽高或 `aspect-ratio`，避免 CLS。
- 使用 Astro `<Image>` 输出 WebP/AVIF 和响应式尺寸。
- 不引入框架运行时和大型库。
- 不接入第三方统计，不加载统计脚本，不设置埋点属性。

---

## 11. 内容与数据规范

- 项目数据放 `src/data/projects.ts`，类型为 `Project`。
- 每个项目必填：`slug`、`name`、`description`、`techStack`、`image`；链接字段可选。
- 新增/修改项目必须同步更新类型和示例，保证 `astro check` 通过。
- 文案避免空洞形容词，项目描述写清“解决什么问题 + 个人贡献”。
- 技能分组用 `SkillGroup`，熟练度只用“熟练/熟悉/了解”，禁止百分比进度条。
- 社交链接集中 `site.ts`，新增链接需同时配置 label、href、icon、external。

---

## 12. 测试与验收

提交前自查：

- [ ] `npx astro check` 通过
- [ ] `npm run build` 通过
- [ ] 375 / 768 / 1024 / 1440 宽度无横向滚动、无错位
- [ ] 禁用 JS 时内容仍完整可见
- [ ] 开启“减少动态效果”后无位移动画
- [ ] 键盘可完成导航、CTA、项目链接、联系方式访问
- [ ] 所有图片有 alt，加载无明显布局偏移
- [ ] 内外链无 404，外链带 `rel="noopener noreferrer"`
- [ ] 移动端菜单可开关，Esc 可关闭
- [ ] Lighthouse 移动端与桌面端 ≥ 90

---

## 13. Git 与提交规范

- 分支：`main` 保持可部署；功能分支 `feat/xxx`，修复 `fix/xxx`。
- 提交信息使用 Conventional Commits：

```
feat: 新增项目卡片 hover 效果
fix: 修复移动端菜单焦点丢失
style: 调整 section 间距
docs: 更新 AGENTS.md
chore: 升级 astro 依赖
```

- 一次提交只做一件事，禁止混合重构与功能。
- 禁止提交 `node_modules/`、`dist/`、`.env`、本地截图草稿。
- 提交前必须跑通第 12 节自查项。

---

## 14. 代理工作流程

1. **先读文档**：PRD、TDD、本文件。
2. **先看现状**：读相关组件、数据文件、类型，禁止凭空假设。
3. **小步修改**：一次只改一个组件或一个功能点。
4. **保持一致性**：复用已有组件、token、工具函数，不重复造轮子。
5. **改完自检**：按第 12 节逐项检查，报告结果。
6. **不确定就问**：涉及技术选型变更、新增依赖、删除功能时，先向用户确认。

---

## 15. 禁止事项（红线）

- ❌ 引入新框架、UI 库、动画库、状态管理库
- ❌ 改为 SSR 或引入后端接口
- ❌ 在组件中写死颜色、链接、文案数据
- ❌ 让内容默认 `opacity: 0` 依赖 JS 显示
- ❌ 用 `div` 模拟按钮/链接
- ❌ 删除或绕过 `prefers-reduced-motion`
- ❌ 提交空 `href` 或死链
- ❌ 使用 `any` 绕过类型
- ❌ 提交未通过 `astro check` 和 `build` 的代码
- ❌ 未经确认修改技术栈或目录结构

---

## 16. 待确认事项

以下问题在开发中如遇歧义，先询问用户，不自行决定：

1. 部署平台最终选型。
2. 是否启用项目详情页（决定是否引入 Content Collections）。
3. 是否接入统计工具及选型。
4. 项目数量、筛选标签是否需要。
5. 域名、备案信息。

---

**一句话总结**：Astro + Tailwind 静态站，数据与展示分离，动效渐进增强，可访问性与性能优先，不引入重型依赖，所有改动先读文档、小步提交、自查后交付。