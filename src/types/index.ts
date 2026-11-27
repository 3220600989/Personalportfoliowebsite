import type { ImageMetadata } from 'astro';

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
  location?: string;
  email: string;
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

export interface NavItem {
  label: string;
  href: string;
}

export interface AnalyticsConfig {
  scriptUrl: string;
  websiteId: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  siteUrl: string;
  ogImage: string;
  navItems: NavItem[];
  socials: SocialLink[];
  analytics: AnalyticsConfig;
}
