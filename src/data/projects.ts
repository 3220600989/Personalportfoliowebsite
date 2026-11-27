import type { Project } from '../types';
import flowFocus from '../assets/projects/flow-focus.webp';

/**
 * 项目数据：首页项目卡片与 /projects/[slug] 详情页在构建时自动生成。
 *
 * 新增项目步骤：
 * 1. 将 16:9 截图放入 src/assets/projects/（WebP 优先）。
 * 2. 在这里 import 图片，并按 Project 类型 push 一条数据。
 * 3. 首页项目卡片与 /projects/[slug] 详情页会在构建时自动生成，无需改组件。
 */
export const projects: Project[] = [
  {
    slug: 'flow-focus-timer',
    name: '心流 Flow',
    description:
      '纯前端专注计时器，支持专注 / 休息循环、自定义时长、到时通知与提示音，并记录每日与每周完成数量。',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Web Audio API', 'Notification API'],
    image: flowFocus,
    imageAlt: '心流 Flow 专注计时器界面，薄荷绿进度环与珊瑚橘按钮',
    liveUrl: 'https://3220600989.github.io/Clock-timer/',
    repoUrl: 'https://github.com/3220600989/Clock-timer',
    role: '独立开发',
    period: '2026-11',
    highlights: [
      '剩余时间由 endAt - Date.now() 推导，切后台 30 秒误差 ≤ 1 秒',
      'Web Audio 实时合成提示音，零音频资源依赖',
      '薄荷绿 + 珊瑚橘视觉系统，呼吸进度环与响应式布局',
      'LocalStorage 持久化时长、提示音与完成记录，无后端依赖',
    ],
  },
];
