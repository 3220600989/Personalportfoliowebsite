# 个人作品集网站 技术设计文档（TDD v1.0）

> 对应文档：个人作品集网站 PRD v1.0  
> 设计范围：P0 核心单页 + P1 项目详情页预留  
> 文档状态：待评审

---

## 1. 文档信息

| 项目 | 内容 |
|---|---|
| 项目名称 | 个人作品集网站 |
| 版本 | v1.0 |
| 关联 PRD | 个人作品集网站 PRD v1.0 |
| 技术负责人 | 待填写 |
| 目标上线 | 待填写 |
| 文档用途 | 指导开发、测试、部署与后续迭代 |

---

## 2. 技术目标与约束

### 2.1 技术目标
1. 输出**静态站点**，无后端依赖，部署即可访问。
2. 首屏 LCP < 2.5s，Lighthouse 性能 / 可访问性 / SEO ≥ 90。
3. 默认零/极少客户端 JS，动效渐进增强。
4. 内容与展示分离，项目数据可维护、可扩展。
5. 移动端优先，支持深色主题，满足 WCAG AA 对比度。

### 2.2 技术约束
- 不开发 CMS、登录、评论、表单后端。
- 不支持 IE。
- 单页锚点为主，P1 预留 `/projects/[slug]` 详情页。
- 社交链接、项目数据集中配置，禁止散落硬编码。

---

## 3. 技术选型与决策

### 3.1 选型结论

| 层级 | 选型 | 版本建议 |
|---|---|---|
| 框架 | **Astro** | 5.x |
| 样式 | **Tailwind CSS** | 4.x |
| 语言 | TypeScript | 5.x |
| 运行时 | Node.js LTS | 20+ |
| 部署 | Vercel / Netlify / Cloudflare Pages | 三选一 |
| 包管理 | npm（或 pnpm） | 最新稳定版 |

### 3.2 为什么选 Astro 而不是 Next.js

| 维度 | Astro | Next.js |
|---|---|---|
| 内容型静态站 | 默认输出静态 HTML，零 JS | 需配置静态导出 |
| 性能 | 天然轻量，岛屿架构按需加载 JS | 默认带 React 运行时 |
| SEO | 语义化 HTML 直接输出 | 可做，但需注意 hydration |
| 复杂度 | 低，适合作品集 | 偏高，适合动态应用 |
| 扩展 | 支持 React/Vue/Svelte 岛屿 | React 生态 |

**决策**：作品集是内容展示型站点，无动态交互和后端需求，Astro 在性能、SEO、部署简单度上更优。若后续需要复杂交互，可在 Astro 中按岛屿引入 React 组件。

### 3.3 关键依赖

| 依赖 | 用途 | 优先级 |
|---|---|---|
| `astro` | 框架 | P0 |
| `tailwindcss` + `@tailwindcss/vite` | 样式 | P0 |
| `@astrojs/sitemap` | 生成 sitemap | P0 |
| `@astrojs/check` + `typescript` | 类型检查 | P0 |
| `sharp` | 图片优化（Astro 默认） | P0 |
| `@astrojs/partytown` 或轻量统计脚本 | 统计（可选） | P2 |
| `playwright` | 冒烟测试（可选） | P1 |

---

## 4. 系统架构

### 4.1 架构概述

```
┌─────────────────────────────────────────┐
│              浏览器 / 访客                │
└──────────────────┬──────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────┐
│        CDN / 静态托管（Vercel 等）        │
│  dist/ 静态 HTML + CSS + 优化后图片       │
└──────────────────┬──────────────────────┘
                   │ 构建时生成
┌──────────────────▼──────────────────────┐
│              Astro 构建                   │
│  Layout + 页面 + 组件 + 数据源             │
│  src/data/projects.ts / content/         │
└─────────────────────────────────────────┘
```

- **构建时**：Astro 读取项目数据、渲染 HTML、压缩 CSS、优化图片。
- **运行时**：仅加载少量内联脚本（导航高亮、滚动动效、复制邮箱），无服务端。
- **数据流**：`src/data/*` 或 `src/content/*` → 组件 props → 静态 HTML。

### 4.2 渲染策略
- P0 全站 **SSG**（静态生成）。
- P1 项目详情页同样 SSG，通过 `getStaticPaths()` 生成。
- 不使用 SSR，不引入数据库。

---

## 5. 目录结构

```
my-portfolio/
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── robots.txt
│   └── resume.pdf（可选）
├── src/
│   ├── assets/
│   │   ├── avatar.webp
│   │   └── projects/
│   │       ├── project-a.webp
│   │       └── project-b.webp
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Section.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── SkillGroup.astro
│   │   ├── Projects.astro
│   │   ├── ProjectCard.astro
│   │   ├── Contact.astro
│   │   ├── SocialLinks.astro
│   │   └── Reveal.astro
│   ├── data/
│   │   ├── site.ts          # 站点元信息、社交链接
│   │   ├── profile.ts       # 姓名、简介、技能
│   │   └── projects.ts      # 项目列表
│   ├── layouts/
│   │   └── BaseLayout.astro # head、nav、footer、全局脚本
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── projects/
│   │       └── [slug].astro # P1
│   ├── styles/
│   │   └── global.css       # Tailwind 引入 + 设计 token
│   └── types/
│       └── index.ts         # Project、Profile 类型
├── astro.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

**约定**：
- 页面只做组合，业务内容放 `data/`，展示逻辑放 `components/`。
- 图片放 `src/assets/` 以走 Astro 图片优化；`public/` 只放无需处理的静态文件（favicon、robots、OG 图）。
- 所有对外链接集中在 `data/site.ts`。

---

## 6. 数据模型与内容管理

### 6.1 类型定义（`src/types/index.ts`）

```ts
export interface SocialLink {
  label: string;
  href: string;
  icon: string;
  external: boolean;
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level?: '熟练' | '熟悉' | '了解' }[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  avatar: ImageMetadata;
  status?: string;
  bio: string[];
  skills: SkillGroup[];
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  image: ImageMetadata;
  imageAlt?: string;
  liveUrl?: string;
  repoUrl?: string;
  role?: string;
  period?: string;
  highlights?: string[];
  featured?: boolean;
}
```

### 6.2 数据文件示例（`src/data/projects.ts`）

```ts
import type { Project } from '../types';
import projectA from '../assets/projects/project-a.webp';

export const projects: Project[] = [
  {
    slug: 'project-a',
    name: '项目 A',
    description: '一句话说明项目解决的问题与个人贡献。',
    techStack: ['Astro', 'Tailwind', 'TypeScript'],
    image: projectA,
    imageAlt: '项目 A 首页截图',
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/xxx/project-a',
    role: '独立开发',
    period: '2025.01 – 2025.03',
    featured: true,
  },
];
```

### 6.3 内容管理策略
- **P0**：使用 TypeScript 数据文件，类型安全，构建时校验。
- **P1**：项目详情页需要长文时，迁移到 **Astro Content Collections**（`src/content/projects/*.md`），通过 schema 校验 frontmatter。
- 迁移不影响展示组件，只替换数据读取层。

### 6.4 数据校验
- 构建时通过 TypeScript 类型检查。
- 可选：在 `astro.config.mjs` 或脚本中校验必填字段（名称、描述、技术栈、图片）。
- 链接字段为空时组件渲染“暂无公开链接”，不渲染空 `href`。

---

## 7. 页面与路由设计

| 路由 | 页面 | 优先级 | 说明 |
|---|---|---|---|
| `/` | 首页 | P0 | Hero / About / Projects / Contact 单页锚点 |
| `/projects/[slug]` | 项目详情 | P1 | `getStaticPaths` 生成 |
| `/404` | 404 | P0 | 友好提示 + 返回首页 |

### 7.1 首页区块与锚点

| 区块 | id | 组件 |
|---|---|---|
| Hero | `home` | `Hero.astro` |
| 关于我 | `about` | `About.astro` |
| 项目展示 | `projects` | `Projects.astro` |
| 联系方式 | `contact` | `Contact.astro` |

- 导航链接使用 `/#about` 形式，保证从详情页也能跳回。
- 每个 `<section>` 设置 `scroll-margin-top` 等于导航高度 + 间距，避免锚点被吸顶导航遮挡。

---

## 8. 组件设计

### 8.1 组件清单

| 组件 | 职责 | 关键 props |
|---|---|---|
| `BaseLayout` | HTML 骨架、head、全局样式、脚本 | `title`、`description`、`ogImage` |
| `Header` | 吸顶导航、移动端菜单、当前区块高亮 | `navItems` |
| `Hero` | 首屏标题、简介、头像、CTA | `profile` |
| `About` | 介绍段落、技能分组 | `profile` |
| `SkillGroup` | 单个技能分类 | `group` |
| `Projects` | 项目列表容器 | `projects` |
| `ProjectCard` | 单个项目卡片 | `project` |
| `Contact` | 邮箱、社交链接、复制按钮 | `socials`、`email` |
| `SocialLinks` | 社交图标链接组 | `links` |
| `Footer` | 版权、返回顶部 | — |
| `Section` | 统一区块容器（标题、间距、id） | `id`、`title`、`slot` |
| `Reveal` | 滚动显现包装器 | `delay`、`slot` |

### 8.2 关键组件契约

**ProjectCard**
- 整卡可点击时用 `<a>` 包裹，避免嵌套链接；若同时有 live 和 repo 两个链接，卡片本身不做整卡链接，改为底部两个独立链接，防止嵌套 `<a>`。
- 图片使用 Astro `<Image>`，设置 `widths`、`sizes`、`loading="lazy"`、`decoding="async"`。
- 无链接时渲染禁用态文本，不渲染空 `href`。
- 外链统一 `target="_blank" rel="noopener noreferrer"`。

**Header**
- 桌面端横向导航；移动端汉堡按钮 + 抽屉菜单。
- 菜单打开时锁定 body 滚动，支持 `Esc` 关闭，焦点回到触发按钮。
- 使用 `aria-expanded`、`aria-controls` 标注状态。

**Contact**
- 邮箱 `mailto:` 链接；复制按钮使用 `navigator.clipboard.writeText`，失败时降级提示手动复制。
- toast 使用 `aria-live="polite"` 区域播报。

---

## 9. 样式系统

### 9.1 设计 Token（`src/styles/global.css`）

Tailwind v4 使用 CSS 变量定义主题：

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

- 组件内使用 `bg-bg`、`text-text`、`text-muted`、`border-border`、`bg-card`、`text-accent`。
- 不在组件中写死十六进制颜色。

### 9.2 字体策略
- 优先系统字体栈，避免字体加载阻塞和 FOIT。
- 若使用自定义字体：最多 1 款、2 个字重，`font-display: swap`，并做子集化。
- 标题字号使用 `clamp()`，例如 `clamp(2rem, 5vw, 4rem)`。

### 9.3 布局与间距
- 内容最大宽度 `max-w-5xl`（约 1024px），左右 `px-4 sm:px-6 lg:px-8`。
- 区块垂直间距 `py-20 md:py-28`。
- 卡片圆角 12px，阴影克制，使用边框区分层级。

### 9.4 响应式断点

| 断点 | 宽度 | 布局 |
|---|---|---|
| 默认 | < 768px | 单列，移动导航 |
| `md` | ≥ 768px | 双列项目卡片 |
| `lg` | ≥ 1024px | 三列项目卡片，桌面导航 |

- 全局 `overflow-x: hidden` 兜底，但需先排查溢出源。
- 图片 `max-w-full h-auto`，禁止固定宽度导致溢出。

---

## 10. 动效实现方案

### 10.1 渐进增强原则（关键）

**禁止**让内容默认 `opacity: 0`，否则 JS 失败时内容不可见。实现方式：

1. 在 `<html>` 上由内联脚本添加 `js` 类（仅当 JS 可用）。
2. CSS 仅对 `.js [data-reveal]` 设置初始隐藏。
3. IntersectionObserver 添加 `.is-visible` 恢复显示。
4. 无 JS 或减少动态偏好时，内容直接可见。

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

### 10.2 脚本实现（`Reveal` 或 BaseLayout 内联）

```js
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
);

document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
```

- 只观察一次，进入视口后取消观察。
- 动画时长 200–500ms，避免长动画。
- 不引入动画库（GSAP / Framer Motion），减少包体。

### 10.3 锚点平滑滚动
- CSS `html { scroll-behavior: smooth; }`，在 `prefers-reduced-motion: reduce` 下改为 `auto`。
- 锚点目标设置 `scroll-margin-top: 5rem`。
- 不依赖 JS 实现平滑滚动。

### 10.4 导航高亮
- 使用 IntersectionObserver 观察各 section，取可见比例最高者设置 `aria-current="true"` 或 `.active`。
- 避免 scroll 事件高频计算。

### 10.5 卡片 hover
- 仅用 CSS：`transform: translateY(-4px)`、`border-color` 变化、图片 `scale(1.03)`。
- 在 `prefers-reduced-motion: reduce` 下取消 transform，仅保留颜色变化。
- 触屏设备无 hover，不依赖 hover 传达关键信息。

---

## 11. SEO 实现

### 11.1 页面元信息
`BaseLayout` 接收并渲染：

```astro
<title>{title}</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(ogImage, Astro.site)} />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href={canonicalURL} />
```

- `astro.config.mjs` 设置 `site: 'https://your-domain.com'`，用于生成绝对 URL 和 sitemap。
- 每页独立 `title` / `description`。

### 11.2 结构化数据
首页注入 Person JSON-LD：

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "姓名",
  "jobTitle": "前端工程师",
  "url": "https://your-domain.com",
  "sameAs": ["GitHub", "LinkedIn"]
}
```

### 11.3 sitemap 与 robots
- 使用 `@astrojs/sitemap` 自动生成 `sitemap-index.xml`。
- `public/robots.txt` 指向 sitemap。
- 404 页设置 `noindex`。

### 11.4 语义化 HTML
- `header` / `nav` / `main` / `section` / `footer` 正确使用。
- 每个 section 有可见或 `sr-only` 的标题，形成合理标题层级（h1 仅一个）。
- 图片 `alt` 必填；装饰图 `alt=""`。

---

## 12. 性能优化

| 优化项 | 方案 |
|---|---|
| 首屏 LCP | 头像 `loading="eager"` + `fetchpriority="high"`；Hero 文本直接 HTML 输出 |
| 图片 | Astro `<Image>` 输出 WebP/AVIF，设置 `widths`/`sizes`，非首屏 `loading="lazy"` |
| CLS | 所有图片提供宽高或 `aspect-ratio`；字体使用系统栈 |
| JS 体积 | 仅内联少量脚本，不引入框架运行时 |
| CSS | Tailwind 按需生成，构建时压缩 |
| 缓存 | 静态资源带 hash，CDN 长缓存；HTML 短缓存 |
| 字体 | 系统字体优先；自定义字体子集化 + `swap` |
| 预加载 | 可选 `preconnect` 到统计域名，不滥用 |

**目标**：LCP < 2.5s，CLS < 0.1，INP < 200ms，Lighthouse ≥ 90。

---

## 13. 可访问性

| 要求 | 实现 |
|---|---|
| 键盘可访问 | 所有交互元素用原生 `a`/`button`；焦点样式 `focus-visible` 清晰可见 |
| 移动菜单 | `aria-expanded`、`aria-controls`、Esc 关闭、焦点管理 |
| 对比度 | 文字与背景满足 WCAG AA；`--color-muted` 需实测对比度 |
| 图片 alt | 项目图用项目名/截图说明；装饰图空 alt |
| 动效偏好 | `prefers-reduced-motion` 关闭位移和过渡 |
| 触控目标 | 移动端链接/按钮最小 44×44px |
| 跳转链接 | 提供“跳到主要内容” skip link |
| 状态播报 | 复制成功 toast 用 `aria-live="polite"` |

---

## 14. 图片与资源处理

- 头像：`src/assets/avatar.webp`，通过 `<Image>` 输出多尺寸，首屏 eager。
- 项目截图：统一 16:9，建议宽 1600px 源图，Astro 生成响应式尺寸。
- OG 图：`public/og-image.png`，1200×630，不参与构建优化。
- favicon：`public/favicon.svg`，提供 32×32 PNG 兜底可选。
- 所有资源命名使用小写短横线，避免中文和空格。

---

## 15. 分析与埋点（可选 P2）

- 选择 Plausible / Umami 等轻量、无 Cookie 方案，避免 GA4 体积和隐私合规负担。
- 事件：项目卡片点击、GitHub 点击、邮箱复制、社交链接点击。
- 使用 `data-event` 属性 + 统计脚本自定义事件，不引入重型 SDK。
- 未接入统计时，代码不预留冗余逻辑。

---

## 16. 部署与 CI/CD

### 16.1 构建
```bash
npm install
npm run build   # 输出 dist/
npm run preview # 本地预览构建产物
```

### 16.2 部署方案

| 平台 | 配置 |
|---|---|
| Vercel | 导入 GitHub 仓库，Framework 选 Astro，自动构建 |
| Netlify | Build command `npm run build`，Publish directory `dist` |
| Cloudflare Pages | 同上，构建命令与输出目录一致 |

### 16.3 上线检查
- 自定义域名 + HTTPS 自动证书。
- 配置 `site` 为正式域名，重新构建生成正确 sitemap 和 canonical。
- 验证 OG 图分享预览（Twitter Card Validator / 社交平台调试工具）。
- 配置 404 页面。
- 可选：GitHub Actions 跑 `astro check` 和 Lighthouse CI。

---

## 17. 测试策略

| 类型 | 内容 | 工具 |
|---|---|---|
| 类型检查 | `astro check`，数据字段完整 | Astro CLI |
| 构建验证 | `npm run build` 无报错 | CI |
| 链接检查 | 内外链无 404 | 手动 / lychee |
| 响应式 | 375 / 768 / 1024 / 1440 宽度 | 浏览器 DevTools |
| 可访问性 | 键盘走查、axe 扫描 | axe DevTools / Lighthouse |
| 性能 | Lighthouse 移动端与桌面端 | Lighthouse CI |
| 降级 | 禁用 JS 内容可见；减少动态模式无动画 | 手动 |
| 冒烟（可选 P1） | 导航、CTA、项目链接、复制邮箱 | Playwright |

---

## 18. PRD 验收标准映射

| PRD 验收项 | 技术实现 |
|---|---|
| 桌面/移动完整浏览四区块 | 单页 section + 响应式布局 |
| 项目字段完整、链接无死链 | `Project` 类型 + 构建校验 + 链接检查 |
| 移动端无横向滚动、菜单可开关 | `overflow-x` 排查 + Header 抽屉 + Esc |
| 动效流畅、低端不卡、减少动态生效 | IntersectionObserver + CSS 过渡 + reduced-motion |
| Lighthouse ≥ 90 | 静态输出 + 图片优化 + 系统字体 + 少量 JS |
| title/description/OG 完整 | BaseLayout props + `site` 配置 |
| 键盘可完成全部访问 | 原生元素 + focus-visible + skip link |
| 图片有 alt、无明显 CLS | Astro Image + 宽高/aspect-ratio |
| HTTPS 正常、404 友好 | 平台证书 + `404.astro` |

---

## 19. 风险与应对

| 风险 | 影响 | 应对 |
|---|---|---|
| 动画导致内容不可见 | 严重 | 渐进增强：默认可见，JS 加类才隐藏 |
| 深色主题对比度不足 | 可读性差 | 用对比度工具校验 token，muted 色不低于 4.5:1 |
| 项目截图缺失 | 视觉不完整 | 提供占位图 + 统一 16:9 容器 |
| 社交链接变更死链 | 体验差 | 链接集中 `site.ts`，上线前统一检查 |
| 移动端菜单焦点丢失 | 可访问性问题 | 打开锁滚动、Esc 关闭、焦点归还 |
| 第三方统计影响性能 | LCP 下降 | 使用轻量方案，脚本 `defer`，不阻塞首屏 |
| 内容迁移 CMS 成本 | 后续维护 | 数据层与组件解耦，P1 平滑迁移 Content Collections |

---

## 20. 开发里程碑

| 阶段 | 技术产出 |
|---|---|
| M1 脚手架 | Astro + Tailwind 初始化，目录结构、类型、数据文件 |
| M2 静态页面 | BaseLayout、Header、Hero、About、Projects、Contact、Footer |
| M3 样式与响应式 | 设计 token、移动端布局、导航抽屉 |
| M4 动效与交互 | Reveal、导航高亮、复制邮箱、平滑锚点 |
| M5 SEO 与性能 | 元信息、JSON-LD、sitemap、图片优化、Lighthouse 调优 |
| M6 测试与上线 | 多端走查、可访问性、链接检查、部署与域名 |

---

## 21. 待确认事项

1. 部署平台最终选 Vercel、Netlify 还是 Cloudflare Pages？
2. 是否使用自定义域名，是否需要备案？
3. 项目数量是否确定为 3–6 个，是否需要筛选标签（P1）？
4. 是否需要项目详情页（决定是否引入 Content Collections）？
5. 是否接入统计工具，选型为何？
6. 头像与项目截图素材是否已准备，是否统一 16:9？

---

**总结**：本方案以 Astro + Tailwind 静态生成为核心，零后端、少 JS、渐进增强动效，数据与展示分离，P0 单页即可上线，P1 通过 Content Collections 平滑扩展项目详情页。开发时按里程碑推进，验收直接对照第 18 节映射表执行。