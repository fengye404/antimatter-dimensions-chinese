# 反物质维度中文版（Antimatter Dimensions Chinese）

## 项目总体规格说明

### 项目目标

基于英文版 Antimatter Dimensions 的编译产物，集成并修复中文翻译，最终打包为 iOS App（WKWebView 方案）。

### 原始项目

| 仓库 | 说明 |
|------|------|
| [IvarK/IvarK.github.io](https://github.com/IvarK/IvarK.github.io) | 英文版部署产物（GitHub Pages） |
| [IvarK/AntimatterDimensionsSourceCode](https://github.com/IvarK/AntimatterDimensionsSourceCode) | 英文版 Vue.js 3 源码 |
| [g1tyx/antimatter-dimensions](https://github.com/g1tyx/antimatter-dimensions) | 中文翻译参考（锅巴汉化） |

### 技术架构概述

#### Web 端

- **基础**：Vue.js 3 编译产物（来自英文版部署仓库）
- **翻译方案**：运行时翻译注入（锅巴汉化引擎）
  - `chs.js`：中文翻译字典，包含所有中英文本映射
  - `core.js`：翻译引擎核心，负责运行时文本替换与注入
- **工作原理**：不修改原始编译后的 JS bundle，而是在运行时通过翻译引擎拦截并替换界面文本

#### iOS 端

- **框架**：Swift + SwiftUI
- **核心组件**：WKWebView 包装 Web 游戏
- **存档桥接**：通过 WKWebView 的 JavaScript Bridge 将游戏存档桥接到 iOS 本地文件系统
- **离线支持**：所有 Web 资源打包到 App Bundle 内，无需网络即可运行

### 开发规范

- **Spec 驱动开发**：所有设计决策和技术方案先写文档，沉淀到 `docs/` 目录
- **翻译修改原则**：只修改 `chs.js` 翻译字典，不修改原始 JS bundle 文件
- **术语一致性**：游戏术语参照 `docs/glossary.md` 中英对照表
- **决策记录**：重要技术决策记录在 `docs/decisions/` 目录

### 仓库结构

```
antimatter-dimensions-chinese/
├── index.html              # 游戏入口页面（英文版原始文件）
├── chs.js                  # 中文翻译字典
├── core.js                 # 锅巴汉化翻译引擎
├── javascripts/            # 英文版编译后的 JS bundle
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
2. **M2 - 翻译集成与修复**：将翻译引擎注入 index.html、审查并修复翻译质量
3. **M3 - iOS App 开发**：Swift/WKWebView 包装、存档桥接、App Store 发布准备
