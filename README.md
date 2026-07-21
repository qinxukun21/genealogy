# 族谱（Genealogy）

一个多端族谱应用，支持 **微信小程序** 与 **电脑端（H5/Web）**，用于记录和传承家族谱系。

## 技术栈

- **前端框架**：uni-app (Vue3 + TypeScript + Vite) —— 一套代码，多端编译
- **多端目标**：微信小程序（主）、H5（电脑端浏览器）
- **后端**：微信云开发 CloudBase（云数据库 / 云存储 / 云函数 / 微信登录）
- **语言**：TypeScript

## 环境要求

- Node.js >= 18
- npm / pnpm
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（编译小程序时使用）
- VSCode（推荐）

## 开发命令

```bash
# 安装依赖
npm install

# H5 / 电脑端（浏览器访问，默认 http://localhost:5173）
npm run dev:h5

# 微信小程序（编译后用微信开发者工具打开 dist/dev/mp-weixin）
npm run dev:mp-weixin

# 类型检查
npm run type-check
```

## 目录结构

```
族谱/
├── src/
│   ├── pages/          # 页面
│   │   ├── index/      # 首页
│   │   ├── tree/       # 家族树
│   │   └── profile/    # 我的
│   ├── components/     # 组件
│   ├── api/            # 接口调用（云开发）
│   ├── utils/          # 工具函数
│   ├── types/          # 类型定义
│   ├── static/         # 静态资源
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json   # 应用配置（含 AppID）
│   ├── pages.json      # 页面路由
│   └── uni.scss        # 全局样式变量
├── scripts/            # 同步脚本（start-work.bat / end-work.bat）
├── docs/               # 文档（家用电脑配置指南等）
├── .vscode/            # VSCode 配置（同步任务）
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 多端同步开发

本仓库支持在多台机器（如公司 + 家里）同步开发：

1. **代码同步**：通过本 GitHub 仓库，`git pull / push`
2. **VSCode 设置同步**：VSCode Settings Sync（GitHub 账号登录，同步设置/扩展/快捷键）
3. **Claude Code 对话记录同步**：见下方「Claude Code 记录同步」
