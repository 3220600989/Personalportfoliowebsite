import type { SiteConfig } from '../types';

const defaultSiteUrl = 'https://personalportfoliowebsite-izg.pages.dev';

/**
 * 站点级配置：标题、域名、导航与社交链接集中在此维护。
 * 上线时把 PUBLIC_SITE_URL 设为实际线上域名即可。
 */
export const site: SiteConfig = {
  title: '骆涛涛 · C++ / Qt 开发工程师 | 个人作品集',
  description:
    '骆涛涛的个人作品集：重庆师范大学软件工程在读，专注 C++ 与 Qt/QML 桌面端开发，覆盖客户端交互与 RESTful 服务全链路实践。',
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? defaultSiteUrl,
  ogImage: '/og-image.png',
  navItems: [
    { label: '首页', href: '/#home' },
    { label: '关于', href: '/#about' },
    { label: '项目', href: '/#projects' },
    { label: '联系', href: '/#contact' },
  ],
  // 暂无公开社交主页时留空；在拿到真实 GitHub / 掘金等地址后按 SocialLink 类型补充，避免死链。
  socials: [],
};
