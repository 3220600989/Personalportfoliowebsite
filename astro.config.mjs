import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Cloudflare Pages 实际分配的免费域名（含随机后缀），canonical / OG / sitemap 依赖它。
// 若以后更换域名，可在项目环境变量里设置 PUBLIC_SITE_URL 覆盖。
const site = process.env.PUBLIC_SITE_URL ?? 'https://personalportfoliowebsite-izg.pages.dev';

export default defineConfig({
  site,
  // 花生壳 file-hosting 不提供目录索引：/projects/xxx/ 会返回空文件。
  // 输出 .html 文件形式，让详情页与 sitemap 里的链接都能直接打开。
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
