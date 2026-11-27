# 骆涛涛 · 个人作品集

Astro 5 + Tailwind CSS 4 静态作品集，严格按 [PRD](docs/PRD.md)、[TECH_DESIGN.md](docs/TECH_DESIGN.md) 与 [AGENTS.md](docs/AGENTS.md) 的约定实现：深色主题、单页锚点、数据与展示分离、渐进增强动效、零后端。

## 快速开始

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # 类型与 Astro 语法检查
npm run build      # 输出 dist/
npm run preview    # 预览构建产物
```

环境变量可从 `.env.example` 复制为 `.env.local` 后填写。

## 当前配置状态

| 项目 | 状态 |
|---|---|
| 部署 | Cloudflare Pages，使用免费 `*.pages.dev` 域名 |
| 统计 | Umami Cloud（Hobby 免费档）；填入 Website ID 后才加载脚本 |
| 项目数据 | 暂无公开项目，首页显示“项目整理中”；`/projects/[slug]` 详情页路由保留 |
| 筛选标签 | 按你的决定暂不实现 |
| 社交链接 | 暂无真实地址，`site.ts` 中留空以避免死链 |

## 目录结构

```
.
├── docs/                   # PRD / TDD / AGENTS 三份约束文档
├── public/                 # 不参与构建处理的静态文件
│   ├── favicon.svg
│   ├── og-image.png        # 1200×630 分享图（当前为占位）
│   └── robots.txt          # 需与线上实际域名保持一致
├── src/
│   ├── assets/             # 需构建优化的图片（Astro <Image>）
│   │   ├── avatar.webp     # 当前为“骆”字占位图
│   │   └── projects/*.webp # 预留模板截图，暂无项目引用
│   ├── components/         # 只接收 props，不直接读 data/
│   │   ├── Header / Footer / Section / Reveal
│   │   ├── Hero / About / SkillGroup
│   │   ├── Projects / ProjectCard / Contact / SocialLinks
│   │   └── Analytics       # Umami 脚本（websiteId 为空时不渲染）
│   ├── data/               # site.ts / profile.ts / projects.ts
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro          # 首页（只做组合）
│   │   ├── 404.astro            # noindex
│   │   └── projects/[slug].astro # 项目详情页（SSG，随项目数据自动生成）
│   ├── styles/global.css   # Tailwind 引入 + @theme 设计 token
│   └── types/index.ts      # Profile / Project / SiteConfig / AnalyticsConfig 等
├── .env.example
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## 修改内容

1. **个人信息与技能**：`src/data/profile.ts` —— 姓名、头衔、简介、bio 段落、邮箱、技能分组。
2. **站点与社交链接**：`src/data/site.ts` —— 标题、描述、导航、社交地址、Umami 配置。拿到 GitHub / 掘金等真实主页后，按 `SocialLink` 类型往 `socials` 数组里补，避免死链。
3. **项目作品**：`src/data/projects.ts` —— 当前为空数组。新增 AI 编程项目时：
   - 把 16:9 截图（WebP 优先）放到 `src/assets/projects/`；
   - 在该文件 import 图片并按 `Project` 类型添加一条数据；
   - 首页卡片和 `/projects/[slug]` 详情页会在构建时自动生成，无需改组件。
4. **图片素材**：替换 `src/assets/avatar.webp`、`public/og-image.png`；项目截图按上面的方式走 Astro `<Image>` 优化。
5. **设计 token**：`src/styles/global.css` 的 `@theme` —— 颜色/圆角/字体先加 token，再在组件里用对应 Tailwind 类，禁止写死十六进制。

## 部署到 Cloudflare Pages

1. 仓库已推送到 GitHub，无需重复初始化。

2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → 选择 GitHub 并授权 → 选中仓库 `Personalportfoliowebsite`。

3. 构建配置：Framework preset 选 **Astro**，Build command `npm run build`，Build output directory `dist`。环境变量先留空，点 **Save and Deploy**。

4. Cloudflare 会免费分配一个 `<项目名>.pages.dev` 域名，实际地址**可能带随机后缀**，请在项目 **Deployments** 页复制生产域名。然后：
   - 项目 **Settings → Environment variables** 添加 `PUBLIC_SITE_URL=https://实际域名`（Production 必填），用于生成正确的 canonical / OG / sitemap；
   - 同步把 `public/robots.txt` 里的 `Sitemap:` 地址改成同一个域名（它是静态文件，读不到环境变量）；
   - 提交推送后 Cloudflare 会自动重新构建。

5. 重新部署后验证：`/sitemap-index.xml`、页面 canonical、OG 分享预览、`/404` 页面都指向新域名。

## 接入 Umami 统计

1. 注册 [Umami Cloud](https://cloud.umami.is/)，Hobby 档免费（每月 10 万事件、1 个网站、6 个月数据保留）。
2. 添加网站，域名填 Cloudflare 实际分配的 `*.pages.dev` 地址；进入网站设置复制 **Website ID**。
3. 在 Cloudflare 项目 **Settings → Environment variables** 添加 `PUBLIC_UMAMI_WEBSITE_ID=<Website ID>`（本地则写入 `.env.local`），重新部署。
4. `websiteId` 为空时统计脚本完全不输出；填入后以 `defer` 方式加载，不阻塞首屏。
5. 已埋的事件：`copy-email`、`email-link`、`social-*`、`projects-contact`；站点使用哈希锚点，脚本已设置 `data-exclude-hash`，不会把 `#about` 等计入路径。

## 上线前检查

- [ ] `npm run check` 与 `npm run build` 均通过。
- [ ] 375 / 768 / 1024 / 1440 宽度无横向滚动。
- [ ] 禁用 JS 内容仍完整可见；开启“减少动态效果”后无位移动画。
- [ ] 键盘可完成导航、CTA、邮箱复制与联系方式访问。
- [ ] 所有图片有 alt；外链无 404 且带 `rel="noopener noreferrer"`。
- [ ] `PUBLIC_SITE_URL` 与 `robots.txt` 域名一致；Lighthouse 三项 ≥ 90。
