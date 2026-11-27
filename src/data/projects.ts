import type { Project } from '../types';

/**
 * 项目数据：目前暂无公开项目，后续用于展示 AI 编程项目。
 *
 * 新增项目步骤：
 * 1. 将 16:9 截图放入 src/assets/projects/（WebP 优先）。
 * 2. 在这里 import 图片，并按 Project 类型 push 一条数据。
 * 3. 首页项目卡片与 /projects/[slug] 详情页会在构建时自动生成，无需改组件。
 */
export const projects: Project[] = [];
