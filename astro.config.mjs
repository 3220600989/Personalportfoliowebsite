import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Cloudflare Pages 免费域名为 <项目名>.pages.dev（可能带随机后缀）。
// 部署后在 Cloudflare 项目里设置 PUBLIC_SITE_URL=https://实际域名，canonical / OG / sitemap 会自动跟随。
const site = process.env.PUBLIC_SITE_URL ?? 'https://luotaotao-portfolio.pages.dev';

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
