import avatar from '../assets/avatar.webp';
import type { Profile } from '../types';

/** 个人资料：姓名、简介、技能分组与联系方式集中在此维护。 */
export const profile: Profile = {
  name: '骆涛涛',
  title: 'C++ / Qt 开发工程师',
  tagline:
    '重庆师范大学软件工程在读。专注于 C++ 与 Qt/QML 桌面端开发，拥有从客户端 UI 交互到后端 RESTful 服务的全链路实战经验。',
  avatar,
  status: '重庆师范大学 · 软件工程在读',
  location: '中国 · 重庆',
  email: '3220600989@qq.com',
  bio: [
    '我是骆涛涛，重庆师范大学软件工程专业在读。我对 C++ 底层逻辑与 Qt/QML 的丝滑 UI 交互充满热情。在校期间，我深入参与了多个实战项目：从使用纯 QML 编写并优化至 60FPS 的“土豆兄弟”游戏，到参与全链路电商平台的前端开发，再到独立完成 20 个 RESTful 端点与单元测试的智能厨房系统。',
    '我熟练掌握 C++（现代 C++ 特性）、Qt 6 框架及 PostgreSQL 等数据库技术，熟悉 Linux（Manjaro）开发环境。同时，我善于运用 AI 编程工具进行提示词工程以提升开发效率。我致力于成为一名具备全栈视野的 C++ 开发者，用代码构建流畅、高效的软件产品。',
  ],
  skills: [
    {
      category: '桌面端开发 (Desktop)',
      skills: [
        { name: 'C++ / 现代 C++ (11/14/17)' },
        { name: 'Qt 6 / QML / QtQuick' },
        { name: 'Qt Network / Qt SQL' },
        { name: '信号与槽 / 状态机 / 对象池优化' },
      ],
    },
    {
      category: '后端与数据 (Backend & DB)',
      skills: [
        { name: 'RESTful API 设计' },
        { name: 'cpp-httplib (C++ 后端)' },
        { name: 'PostgreSQL / SQLite / MySQL' },
        { name: 'JSON 数据交互' },
      ],
    },
    {
      category: '工具与环境 (Tools)',
      skills: [
        { name: 'Linux (Manjaro) / Windows' },
        { name: 'Git' },
        { name: 'Qt Creator' },
        { name: 'AI 编程工具 / 提示词工程' },
      ],
    },
  ],
};
