import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Cloudflare Pages 实际分配的免费域名（含随机后缀），canonical / OG / sitemap 依赖它。
// 若以后更换域名，可在项目环境变量里设置 PUBLIC_SITE_URL 覆盖。
const site = process.env.PUBLIC_SITE_URL ?? 'https://personalportfoliowebsite-izg.pages.dev';

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
