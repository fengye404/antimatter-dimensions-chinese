# 反物质维度中文版（Antimatter Dimensions Chinese）

## 项目总体规格说明

### 项目目标

基于英文版 Antimatter Dimensions 源码，维护源码级中文化版本，最终打包为 iOS App（WKWebView 方案）。

### 原始项目

| 仓库 | 说明 |
|------|------|
| [IvarK/IvarK.github.io](https://github.com/IvarK/IvarK.github.io) | 英文版部署产物（GitHub Pages） |
| [IvarK/AntimatterDimensionsSourceCode](https://github.com/IvarK/AntimatterDimensionsSourceCode) | 英文版 Vue.js 3 源码 |
| [g1tyx/antimatter-dimensions](https://github.com/g1tyx/antimatter-dimensions) | 中文翻译参考（锅巴汉化） |

### 技术架构概述

#### Web 端

- **基础**：Vue/Vue CLI 源码（来自英文版源码仓库）
- **翻译方案**：源码级中文化
  - `src/`：高频 UI、机制说明、商店、新闻、成就、弹窗等直接输出中文
  - `i18n/`：保留历史词典和构建后处理脚本，线上不再注入 DOM 翻译引擎
- **工作原理**：在源码和构建源文件中维护中文文本，`npm run build:chinese` 只做构建后元数据和资源版本处理

#### iOS 端

- **框架**：Swift + SwiftUI
- **核心组件**：WKWebView 包装 Web 游戏
- **存档桥接**：通过 WKWebView 的 JavaScript Bridge 将游戏存档桥接到 iOS 本地文件系统
- **离线支持**：所有 Web 资源打包到 App Bundle 内，无需网络即可运行

### 开发规范

- **Spec 驱动开发**：所有设计决策和技术方案先写文档，沉淀到 `docs/` 目录
- **翻译修改原则**：优先修改 `src/` 源码中的展示文案，不修改构建产物 `dist/`
- **术语一致性**：游戏术语参照 `docs/glossary.md` 中英对照表
- **决策记录**：重要技术决策记录在 `docs/decisions/` 目录
- **源码级中文化维护**：上游同步后必须重新运行 `npm run audit:i18n` 和 `npm run test:e2e`，以浏览器审计报告驱动新增英文的源码修复；`i18n/` 仅保留历史词典和构建后处理，不再作为线上运行时翻译层

### 仓库结构

```
antimatter-dimensions-chinese/
├── public/index.html       # 游戏入口模板
├── src/                    # 游戏源码与源码级中文化修改
├── i18n/                   # 历史词典与中文版构建后处理
├── stylesheets/            # 样式文件
├── images/                 # 图片资源
├── docs/                   # 项目文档
│   ├── spec.md             # 项目总体规格说明（本文件）
│   ├── glossary.md         # 游戏术语中英对照表
│   ├── translation-review.md # 翻译审查与修复记录
│   ├── ios-design.md       # iOS App 技术设计文档
│   └── decisions/          # 技术决策记录
├── ios/                    # iOS App 代码（待创建）
├── AGENTS.md               # AI Agent 开发参考文档
└── README.md               # 项目说明
```

### 里程碑

1. **M1 - 项目初始化**：Fork 仓库、集成翻译文件、建立文档结构
2. **M2 - 翻译集成与修复**：源码级中文化、审查并修复翻译质量
3. **M3 - iOS App 开发**：Swift/WKWebView 包装、存档桥接、App Store 发布准备
