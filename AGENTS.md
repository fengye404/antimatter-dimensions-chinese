# AGENTS.md — AI Agent 开发参考文档

> 本文件供 AI 开发 Agent（如 Copilot、Cursor、Qoder 等）在本仓库中工作时参考。

## 项目概述

**反物质维度中文版（Antimatter Dimensions Chinese）** 是基于英文版 [Antimatter Dimensions](https://ivark.github.io/) 增量游戏的中文化项目。目标是集成并修复中文翻译，最终打包为 iOS App（WKWebView 方案）。

### 项目目标

1. 在英文版编译产物基础上，注入锅巴汉化翻译引擎实现中文化
2. 审查并修复翻译质量问题
3. 将 Web 游戏包装为 iOS App，支持离线运行和本地存档

## 仓库结构

```
antimatter-dimensions-chinese/
├── index.html                  # 游戏主入口页面
├── chs.js                      # 中文翻译字典（核心翻译文件）
├── core.js                     # 锅巴汉化翻译引擎（运行时注入）
├── javascripts/                # 英文版编译后的 JS 文件（不要修改！）
│   ├── game.js                 # 游戏主逻辑（310KB，核心游戏代码）
│   ├── breakinfinity.js        # 大数运算库
│   ├── breakbreakinfinity.js   # 扩展大数运算库
│   ├── autobuyer.js            # 自动购买器逻辑
│   ├── jquery-3.2.1.min.js     # jQuery 库
│   ├── lz-string.js            # 字符串压缩（存档用）
│   ├── chart.js                # 图表库
│   ├── notify.js               # 通知组件
│   ├── sha512.js               # SHA-512 哈希库
│   ├── howto.js                # 帮助/教程页面逻辑
│   └── core/                   # 核心游戏模块
│       ├── normal_dimension.js # 普通维度逻辑
│       ├── infinity_dimension.js # 无限维度逻辑
│       ├── time_dimension.js   # 时间维度逻辑
│       ├── achievements.js     # 成就系统
│       ├── dimboost.js         # 维度提升逻辑
│       ├── tickspeed.js        # 计时器速度逻辑
│       ├── timestudies.js      # 时间研究逻辑
│       ├── newsticker.js       # 新闻滚动条
│       ├── load_functions.js   # 存档加载/保存函数
│       ├── format.js           # 数字格式化
│       ├── canvases.js         # 画布/动画渲染
│       ├── chart.js            # 图表展示
│       ├── kong.js             # Kongregate 集成
│       ├── playfab.js          # PlayFab 云存档集成
│       ├── polyfill.js         # 浏览器兼容性补丁
│       └── devtools.js         # 开发者工具
├── stylesheets/                # CSS 样式文件
├── images/                     # 图片资源
├── docs/                       # 项目文档（Spec 驱动开发）
│   ├── spec.md                 # 项目总体规格说明
│   ├── glossary.md             # 游戏术语中英对照表
│   ├── translation-review.md   # 翻译审查与修复记录
│   ├── ios-design.md           # iOS App 技术设计文档
│   └── decisions/              # 架构/技术决策记录（ADR）
├── ios/                        # iOS App 代码（Swift/SwiftUI）
├── AGENTS.md                   # 本文件 — AI Agent 参考
└── README.md                   # 项目说明
```

## 关键文件说明

### index.html
游戏入口页面，加载所有 JS 和 CSS 资源。翻译集成时需要在此文件中添加 `chs.js` 和 `core.js` 的 `<script>` 引用。

### chs.js — 中文翻译字典
- 来源：[g1tyx/antimatter-dimensions](https://github.com/g1tyx/antimatter-dimensions) 的 `new/` 目录
- 包含所有中英文本映射关系
- **翻译修改只改这个文件**，不要修改原始 JS bundle
- 约 275KB，包含数千条翻译条目

### core.js — 锅巴汉化翻译引擎
- 来源：同 chs.js
- 运行时翻译注入引擎，负责拦截并替换界面文本
- 约 8KB，包含翻译匹配和替换的核心逻辑
- 通常不需要修改，除非需要修复翻译引擎本身的 bug

### javascripts/game.js
游戏核心逻辑，310KB 的编译产物。包含 Vue.js 3 组件、游戏状态管理、UI 渲染等。**绝对不要手动修改此文件**。

### javascripts/core/
游戏核心模块目录，包含维度逻辑、成就系统、存档管理等。**不要修改这些文件**。

## 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 游戏前端 | Vue.js 3 编译产物 | 来自英文版，不做源码级修改 |
| 翻译引擎 | 锅巴汉化（core.js + chs.js） | 运行时文本注入替换 |
| 大数运算 | break_infinity.js | 游戏中处理超大数值 |
| 存档压缩 | lz-string.js | 游戏存档的压缩/解压 |
| iOS 客户端 | Swift + SwiftUI + WKWebView | 包装 Web 游戏为原生 App |
| iOS 存档桥接 | WKWebView JavaScript Bridge | JS ↔ Swift 通信 |

## 开发约定

### 1. Spec 驱动开发
- 所有设计文档在 `docs/` 目录
- 重要技术决策记录在 `docs/decisions/` 目录
- 先写设计文档，再写代码

### 2. 翻译修改原则
- **只改 `chs.js`**，不改原始 JS bundle（`javascripts/` 下的所有文件）
- 翻译采用运行时注入方式，不是源码级修改
- 术语参照 `docs/glossary.md` 中英对照表，保持一致性

### 3. iOS 代码
- iOS 相关代码统一放在 `/ios` 子目录
- 使用 Swift/SwiftUI，最低支持 iOS 15+
- 存档通过 JavaScript Bridge 桥接到本地文件系统

### 4. 文档与术语
- 术语参照 `docs/glossary.md`
- 翻译修复记录在 `docs/translation-review.md`
- iOS 设计文档在 `docs/ios-design.md`

## 常用命令

### 本地预览游戏
```bash
# 在仓库根目录运行
python3 -m http.server 8080

# 然后在浏览器访问
# http://localhost:8080
```

### 查看翻译字典
```bash
# 搜索特定翻译条目
grep "关键词" chs.js
```

### 运行 E2E 测试
```bash
# 启动本地服务器
python3 -m http.server 8080 &

# 运行 Playwright 测试（需先 npm install）
npx playwright test tests/e2e.spec.js --reporter=list

# 测试完成后停止服务器
pkill -f "python3 -m http.server 8080"
```

测试包括：
1. UI 正确渲染验证
2. 中文文本正确显示
3. 游戏逻辑正常（维度购买、反物质增长）
4. 各页面翻译覆盖检查

截图保存在 `tests/screenshots/` 目录。

## 注意事项

1. **不要修改编译后的 JS 文件** — `javascripts/` 目录下的所有文件都是英文版的编译产物，任何修改都可能破坏游戏逻辑。如需更新，应从上游英文版重新同步。

2. **翻译采用运行时注入** — 通过 `core.js` 翻译引擎在页面加载后动态替换文本，而非在源码中硬编码中文。这样可以随时切换语言，也便于跟踪上游更新。

3. **存档兼容性** — 游戏存档存储在 localStorage 中（Web 版）。iOS 版需要通过 JavaScript Bridge 将存档同步到本地文件系统。修改存档相关逻辑时要确保与英文版存档格式兼容。

4. **上游同步** — 英文版仓库 `IvarK/IvarK.github.io` 可能会更新。同步时只需要更新 `javascripts/` 等原始文件，翻译文件（`chs.js`）需要相应检查是否有新增未翻译内容。

5. **大文件注意** — `game.js`（310KB）和 `chs.js`（275KB）较大，避免在 prompt 中完整加载。需要查找特定内容时使用 grep 搜索。

6. **翻译脚本加载顺序** — `chs.js`（字典）必须在 `core.js`（引擎）之前加载，因为引擎依赖字典中定义的 `cnItems`、`cnPrefix`、`cnPostfix` 等变量。

7. **chs.js 多行字符串** — `chs.js` 中的新闻消息翻译可能包含多行字符串字面量，这在标准 JavaScript 中是无效的。修改 `chs.js` 后应用 `node -c chs.js` 验证语法正确性。
