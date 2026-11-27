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
| 部署 | 花生壳 file-hosting（免费、国内节点、微信可直开），线上地址 https://l20v6c.kicp.fun |
| 统计 | 不接入第三方统计 |
| 项目数据 | 已接入「心流 Flow」专注计时器，首页卡片自动生成，详情页为 `/projects/flow-focus-timer.html` |
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
│   │   └── projects/*.webp # 项目封面（含 flow-focus.webp）
│   ├── components/         # 只接收 props，不直接读 data/
│   │   ├── Header / Footer / Section / Reveal
│   │   ├── Hero / About / SkillGroup
│   │   └── Projects / ProjectCard / Contact / SocialLinks
│   ├── data/               # site.ts / profile.ts / projects.ts
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro          # 首页（只做组合）
│   │   ├── 404.astro            # noindex
│   │   └── projects/[slug].astro # 项目详情页（SSG，随项目数据自动生成）
│   ├── styles/global.css   # Tailwind 引入 + @theme 设计 token
│   └── types/index.ts      # Profile / Project / SiteConfig 等类型
├── .env.example
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## 修改内容

1. **个人信息与技能**：`src/data/profile.ts` —— 姓名、头衔、简介、bio 段落、邮箱、技能分组。
2. **站点与社交链接**：`src/data/site.ts` —— 标题、描述、导航、社交地址。拿到 GitHub / 掘金等真实主页后，按 `SocialLink` 类型往 `socials` 数组里补，避免死链。
3. **项目作品**：`src/data/projects.ts` —— 目前已有「心流 Flow」。新增项目时：
   - 把 16:9 截图（WebP 优先）放到 `src/assets/projects/`；
   - 在该文件 import 图片并按 `Project` 类型添加一条数据；
   - 首页卡片和 `/projects/[slug].html` 详情页会在构建时自动生成，无需改组件。
4. **图片素材**：替换 `src/assets/avatar.webp`、`public/og-image.png`；项目截图按上面的方式走 Astro `<Image>` 优化。
5. **设计 token**：`src/styles/global.css` 的 `@theme` —— 颜色/圆角/字体先加 token，再在组件里用对应 Tailwind 类，禁止写死十六进制。

## 部署到线上（花生壳 file-hosting）

当前线上地址：**https://l20v6c.kicp.fun**（国产、免费、国内节点、微信可直开）。此前用过 Cloudflare Pages 与 Vercel，均已弃用；GitHub 仓库仍作为源码备份保留。

发布走花生壳 CLI（`@aweray/hsk-cli`，已全局安装），托管的是**构建好的静态文件**，与 GitHub 仓库无自动联动——源码更新后需要手动重新构建并覆盖发布。

1. 构建干净产物。项目内 `dist/` 可能残留旧文件，建议在临时目录全新构建后，把产物复制到 `.workbuddy/publish/`（首次发布的目录）。该目录只放静态文件：`index.html`、`404.html`、`favicon.svg`、`og-image.png`、`robots.txt`、`sitemap-index.xml`、`sitemap-0.xml`、`_astro/`。

2. 首次发布（在 WorkBuddy 对话中执行，需带 `--context` 上下文参数）：
   ```bash
   hsk-cli file-hosting .workbuddy/publish --entry-file index.html --format json --context <上下文>
   ```
   发布成功会返回一个 resourceId 和 publicUrl，并自动认领；信息记录在本地 `.hsk/resources.json`（已加入 `.gitignore`，不入库）。

3. 后续更新内容——**地址保持不变**：
   ```bash
   hsk-cli file-hosting-update -resource-id 1795760040810580889 .workbuddy/publish
   ```
   重新构建并把新产物替换进 `.workbuddy/publish/` 后再执行，线上即刻生效。

4. 验证：访问 https://l20v6c.kicp.fun，确认标题、姓名、邮箱正常，`/favicon.svg`、`/robots.txt`、`/sitemap-index.xml` 均返回 200。

> 域名一致性：已统一到花生壳地址。构建前设置 `PUBLIC_SITE_URL=https://l20v6c.kicp.fun`；`public/robots.txt` 的 `Sitemap:` 也已手改为该域名（静态文件读不到环境变量）。

> **花生壳 file-hosting 的两个坑**：① 更新接口只接受单个 `.zip`，不接受目录——先把发布目录压缩，再执行 `hsk-cli file-hosting update <zip> --resource-id 1795760040810580889 --yes`；② 它不提供目录索引，`/projects/xxx/` 会返回空文件，所以 `astro.config.mjs` 设了 `build.format: 'file'`，详情页输出为 `.html`。但 `@astrojs/sitemap` 会去掉 `.html` 后缀，发布前需把 `dist/sitemap-0.xml` 里的详情页地址补回 `.html`，否则搜索引擎抓到的是空页面。

## 上线前检查

- [ ] `npm run check` 与 `npm run build` 均通过。
- [ ] 375 / 768 / 1024 / 1440 宽度无横向滚动。
- [ ] 禁用 JS 内容仍完整可见；开启“减少动态效果”后无位移动画。
- [ ] 键盘可完成导航、CTA、邮箱复制与联系方式访问。
- [ ] 所有图片有 alt；外链无 404 且带 `rel="noopener noreferrer"`。
- [ ] `PUBLIC_SITE_URL` 与 `robots.txt` 域名一致（若统一到花生壳地址，两处都用 `https://l20v6c.kicp.fun`）；Lighthouse 三项 ≥ 90。
