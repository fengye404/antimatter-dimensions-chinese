# 翻译审查与修复记录

## 文档概述

本文档列出了在翻译系统分析过程中发现的问题、不一致或需要改进的翻译条目，以及已完成的修复。

---

## 已修复问题

### 2026-05-19 阶段式 UI 审计与核心机制翻译

| # | 位置 | 原文/问题 | 修复后 | 原因 |
|---|------|-----------|--------|------|
| 23 | `scripts/audit-i18n-visible-text.js` | 缺少跨阶段可见英文审计 | 新增 Playwright 阶段遍历报告 | 让翻译修复从人工抽查变为可重复审计 |
| 24 | `src/core/secret-formula/tabs.js` | 主 Tab/Subtab 名称大量依赖运行时替换 | 维度、选项、统计、挑战、无限、永恒、现实、天体等源头中文化 | 导航是最高频 UI，不应出现加载时英文闪烁 |
| 25 | `src/components/tabs/options-*` | 选项页标签和滑块句式中英混排 | 存档、显示、玩法选项源头中文化 | Vue 模板拆分文本会导致翻译引擎只能替换半句 |
| 26 | `src/components/tabs/normal-challenges` 与 `src/core/secret-formula/challenges/normal-challenges.js` | 普通挑战名称、规则、奖励仍有英文 | 挑战规则和自动购买器奖励中文化 | 普通挑战解释直接影响早中期玩法理解 |
| 27 | `src/components/tabs/infinity-dimensions` 与 `src/components/tabs/replicanti` | 无限维度、复制品页存在动态英文句式 | 无限之力、复制概率、复制品星系、上限说明等中文化 | 无限阶段是第一次机制扩展，术语必须稳定 |
| 28 | `src/core/timespan.js` | 时间显示输出 `seconds/minutes/hours` | 输出“秒/分钟/小时/天/年” | 全局时间格式影响统计、复制品、自动机和离线进度 |
| 29 | `src/core/format.js` | `makeEnumeration` 和 `pluralize` 默认英文复数 | 中文列表用顿号/“和”，中文词不加复数 `s` | 避免“维度和Dimension Boosts”“无限点数s”等混排 |
| 30 | `src/core/secret-formula/news.js` | 审计中抽到的新闻仍为英文 | 已翻译本轮命中的新闻样例 | 新闻滚动条是可见 UI，需逐步进入审计队列 |
| 31 | `src/core/achievements/*` | 成就通知前缀与部分成就名英文 | “成就/秘密成就”通知前缀和审计命中成就名中文化 | 避免通知区反复出现 `Achievement:` |
| 32 | `public/stylesheets/chinese-localization.css` | 同一句内英文/数字使用 `Typewriter`，中文使用系统 fallback，视觉大小和字重不一致 | 中文版常规 UI 统一使用系统中文 UI 字体栈，保留图标/代码/特殊符号字体 | 解决“已翻译但同段字体和大小不一致”的基础视觉问题 |
| 33 | `src/components/modals/H2PModal.vue` | “游戏玩法”弹窗正文通过 `v-html` 整块渲染，运行时翻译因换行/HTML 差异漏命中 | 渲染前按规范化文本匹配 `howtoplay.json`，并源头中文化标题与搜索占位符 | 修复大段教程正文仍显示英文的问题，避免只翻译左侧目录 |
| 34 | `src/components/tabs/antimatter-dimensions/*` | 首屏购买按钮、Tickspeed 按钮仍显示 `Until 10`、`Tickspeed Cost`、`Buy Max` | 反物质维度行和时间间隔行源头中文化 | 首屏核心玩法文本必须稳定中文，不应依赖 DOM 竞态替换 |
| 35 | `src/components/ui-modes/NewsTicker.vue` | 新闻滚动条通过 `innerHTML` 命令式写入，部分新闻绕过翻译 | 写入前按规范化文本匹配翻译词典，并补充截图命中的新闻译文 | 修复可见新闻条仍显示整句英文的问题 |
| 36 | `.github/workflows/deploy-master.yml` | Pages 工作流只跑 `build:master`，可能发布未注入中文词典的产物 | 改为 `npm run build:chinese`，保证构建后执行 `i18n/inject.js` | 修复线上 GitHub Pages 与本地中文构建不一致 |
| 37 | `src/components/modals/options/*` | 点击选项页按钮后出现的指数记数法、快捷键、新闻、信息显示、确认、离线进度、动画、隐藏标签、备份弹窗仍有整段英文 | 将高频选项弹窗标题、说明、开关、滑块和运行期名称源头中文化，并纳入 Playwright 与审计脚本 | 修复人工抽查一点击就看到英文的问题，避免只审计默认可见页面 |
| 38 | `src/core/secret-formula/challenges/infinity-challenges.js` 与 `InfinityChallengeBox.vue` | 无限挑战规则、目标和奖励说明仍混有 `Reward`、`Goal`、长段英文 | 无限挑战 1-8 的规则和奖励说明源头中文化 | 审计进入无限阶段后能直接看到这些文本，属于影响机制理解的高优先级内容 |
| 39 | `i18n/inject.js` 与 `tests/i18n-regression.spec.js` | GitHub Pages 上 `js/app.js`、`js/chunk-vendors.js`、CSS 使用固定 URL，浏览器可能继续执行旧 bundle，导致已修复弹窗仍显示英文 | 构建注入阶段为本地 JS/CSS 追加提交号版本参数，并新增 Playwright 断言 | 确保线上发布后用户拿到最新中文化 bundle，而不是缓存中的旧英文界面 |
| 40 | `src/components/modals/catchup/*`、`src/core/secret-formula/catchup-resources.js`、`src/core/secret-formula/progress-checker.js` | “查看内容概要”弹窗的引导语、机制摘要和底部建议语仍有英文 | 内容概要组件、阶段显示名、全量机制摘要源头中文化，并纳入 Playwright 与可见英文审计 | 修复统计页弹窗漏审问题，保留内部英文 `name` 以免破坏 H2P 跳转 |
| 41 | `src/components/tabs/*-achievements` 与 `src/core/chinese-achievement-i18n.js` | 成就卡片图片内嵌英文，tooltip 仍显示英文成就名、条件和奖励；成就 sprite 加载慢 | 卡片改为中文标题覆盖层，tooltip 组件层中文化，并禁用三张原版英文大 sprite | 图片内文字无法被 DOM 翻译引擎处理，源头中文覆盖同时减少成就页资源请求和解码卡顿 |

### 2026-05-18 商店与运行时翻译重做

| # | 位置 | 原文/问题 | 修复后 | 原因 |
|---|------|-----------|--------|------|
| 18 | `src/core/secret-formula/tabs.js` | 商店 tab 依赖 `Cloud.isAvailable`，离线构建中不可见 | 商店 tab 始终可见，名称改为“商店” | 中文版目标是离线/本地可用，商店入口不应依赖 Google/Firebase |
| 19 | `src/components/tabs/shop/ShopTab.vue` | 原版商店展示 Google 登录、Buy More、IAP 开关和支付状态 | 改为中文离线说明与原版商店项目预览 | 避免误触支付，明确中文版不提供购买入口且不改变游戏平衡 |
| 20 | `src/components/tabs/shop/ShopButton.vue` | 商店项目说明仍为英文，按钮可尝试购买 | 项目说明中文化，购买按钮永久禁用 | 保留存档兼容展示，但阻断支付后端调用 |
| 21 | `i18n/inject.js` | 构建时会加载 `shop-hack.js` 自动发放 STD | 不再加载任何商店货币注入脚本 | 自动发放 STD 会污染平衡和测试结果 |
| 22 | `i18n/translation-engine.js` | Vue 首次渲染前启动可能漏扫，空白 trim 后格式易丢 | 等待 `#ui` mount，保留前后空白，周期重扫 | 提升动态 UI 文本覆盖率 |
| 23 | `src/core/shop.js`、`ShopTab.vue`、`ShopButton.vue` | 中文版商店按钮被永久禁用，用户无法体验原版商店加成 | 改为本地免费购买：不扣 STD、不访问支付后端、点击后直接增加购买次数并启用加成 | 按项目目标允许中文版自由购买，同时避免真实支付和后端依赖 |

### 高优先级

| # | 位置 | 原文 | 修复前 | 修复后 | 原因 |
|---|------|------|--------|--------|------|
| 1 | 正则 约L1984 | `(数字)e(数字) AM` | `$1e$2 反物质维度` | `$1e$2 反物质` | AM是Antimatter的缩写，不是Antimatter Dimension |
| 2 | 正则 约L2028 | `Peak: (.+) EP/min` | `特权：$1 永恒点/分钟` | `峰值：$1 永恒点/分钟` | Peak意为"峰值"，"特权"是错误翻译 |
| 3 | 正则 约L2047 | `Cost: (.+) AM` | `成本：$1 反物质维度` | `成本：$1 反物质` | AM是Antimatter的缩写，不是Antimatter Dimension |
| 4 | 正则 约L1907 | `Until (.+), Cost (.+) AM` | `直到 $1，费用为 $2 反物质维度` | `直到 $1，费用为 $2 反物质` | 同上，AM=Antimatter |
| 5 | 正则 约L1908 | `Until (.+), (.+) AM` | `直到 $1，$2 反物质维度` | `直到 $1，$2 反物质` | 同上，AM=Antimatter |
| 6 | 正则 约L1961 | `Reach (数字)e(数字) AM` | `达到 $1e$2 反物质维度` | `达到 $1e$2 反物质` | 同上，AM=Antimatter |

### 中优先级（术语一致性）

| # | 位置 | 原文 | 修复前 | 修复后 | 原因 |
|---|------|------|--------|--------|------|
| 7 | 字典 L374 | `Replicanti Galaxies` | `复制星系` | `复制品星系` | 统一术语：Replicanti→复制品 |
| 8 | 字典 L375 | `Replicanti Galaxies boost Replicanti multiplier` | `Replicanti Galaxies 提升 复制品 乘数` | `复制品星系 提升 复制品 乘数` | 英文未翻译 |
| 9 | 字典 L515 | `Infinity Power strengthens Replicanti Galaxies` | `无限力量强化复制星系` | `无限力量强化复制品星系` | 统一术语：Replicanti Galaxy→复制品星系 |
| 10 | 字典 L756 | `: Replicanti Galaxy` | `: 复制星系` | `: 复制品星系` | 统一术语 |
| 11 | 字典 L976 | `Replicanti Galaxies no longer reset...Tickspeed...` | `复制星系不再重置...tick速度...` | `复制品星系不再重置...时间间隔升级...` | 统一术语：Replicanti Galaxies→复制品星系，Tickspeed Upgrade→时间间隔升级 |
| 12 | 字典 L364 | `(1 per 2,000 Dim Boosts)` | `（每 2,000 个暗淡提升 1 个）` | `（每 2,000 个维度提升 1 个）` | Dim Boosts=Dimension Boosts=维度提升，非"暗淡提升" |
| 13 | 字典 L945 | `(1 per 2,000 Dim Boosts)` | `（每 2,000 个暗淡增强 1 个）` | `（每 2,000 个维度提升 1 个）` | 同上 |
| 14 | 字典 L752 | `: Infinity Dimension` | `: 无限次元` | `: 无限维度` | 统一术语：Dimension→维度，不是"次元" |
| 15 | 字典 L88 | `(additive)` | `（添加剂）` | `（叠加）` | additive在游戏数学语境中意为"叠加"效果 |
| 16 | 字典 L766 | `Additive:` | `添加剂：` | `加法：` | 同上，数学术语，非化学"添加剂" |
| 17 | 字典 L1336 | `until the 8th Antimatter Dimension` | `直到第8个反物质维` | `直到第8个反物质维度` | "维度"被截断为"维" |

---

## 已验证的系统性问题状态

### 1. AM缩写定义 — ✅ 已修复

所有使用 AM 缩写的正则表达式条目已统一修正为"反物质"（Antimatter），不再错误翻译为"反物质维度"（Antimatter Dimension）。

**修复范围：** 6条正则表达式规则

### 2. Peak翻译 — ✅ 已修复

`Peak` 已从错误的"特权"修正为正确的"峰值"。

### 3. 术语统一性 — ✅ 已改进

| 术语 | 修复前状态 | 修复后状态 |
|------|-----------|-----------|
| Replicanti Galaxy | 混用"复制星系"和"复制品星系" | 统一为"复制品星系" |
| Dim Boosts | 误译为"暗淡提升/增强" | 修正为"维度提升" |
| Infinity Dimension | 偶见"无限次元" | 统一为"无限维度" |
| Tickspeed | 偶见"tick速度/计数频率" | 机制名可保留 Tickspeed；按钮译为“时间间隔升级”，速率译为“游戏刻速率” |
| Additive (效果类型) | 误译为"添加剂" | 修正为"叠加/加法" |

### 4. 格式化问题 — 部分修复

- ✅ "反物质维" 截断问题已修复
- ✅ “计数频率 升级”这类机械拼接改为“时间间隔升级”，避免中英逻辑和空格混排

---

## 术语统一性检查

### 已验证的一致翻译

| 术语 | 翻译 | 验证状态 |
|------|------|--------|
| Antimatter | 反物质 | 一致 ✓ |
| AM (缩写) | 反物质 | 已修复 ✓ |
| Infinity Points | 无限点 | 一致 ✓ |
| Eternity Points | 永恒点 | 一致 ✓ |
| Dimension | 维度 | 已修复 ✓ |
| Galaxy | 星系 | 一致 ✓ |
| Autobuyer | 自动购买者 | 一致 ✓ |
| Tickspeed | Tickspeed / 时间间隔升级 / 游戏刻速率 | 已按语境修复 ✓ |
| Replicanti Galaxy | 复制品星系 | 已修复 ✓ |
| Dimension Boost / Dim Boost | 维度提升 | 已修复 ✓ |
| Peak | 峰值 | 已修复 ✓ |
| Additive | 叠加/加法 | 已修复 ✓ |
| Big Crunch | 大坍缩 | 一致 ✓ |
| Time Study | 时间研究 | 一致 ✓ |
| Time Dilation | 时间膨胀 | 一致 ✓ |
| Achievement | 成就 | 一致 ✓ |
| Reality | 现实 | 一致 ✓ |

---

## chs.js 文件结构分析

### 数据组织方式

chs.js 包含以下五个主要部分：

1. **字典条目** (cnItems) - ~1458行
   - 基本UI文本 (行13-100)
   - 详细教程文本 (行1300+)
   - 特殊符号和代码 (行1380+)

2. **前缀处理** (cnPrefix) - 约40行
   - 主要是空格和缩进处理

3. **后缀处理** (cnPostfix) - 约30行
   - 尾部空格和符号

4. **排除规则** (cnExcludeWhole) - 约100行
   - 纯数字、格式化字符串等不需翻译的内容

5. **正则表达式替换** (cnRegReplace) - 234个规则
   - 动态内容替换
   - 格式化字符串翻译

### 覆盖范围统计

- **标准字典条目**：约1400个
- **正则表达式规则**：234个
- **总条目数量**：1600+

---

## 翻译引擎技术分析

### core.js 工作机制

翻译引擎采用以下匹配策略（优先级从高到低）：

1. **排除规则** - 完全匹配排除列表 (cnExcludeWhole)
2. **正则替换** - 使用正则表达式动态替换 (cnRegReplace)
3. **字典匹配** - 标准字典查表
   - 字符串完全匹配
   - 对象匹配 (支持CSS选择器、ID、class等上下文)
4. **收集新词** - 未知词汇收集到 _OTHER_ 数组

### 匹配模式支持

支持的匹配类型：
- `.classname` - 按CSS类选择
- `#elementid` - 按元素ID选择
- `$selector` - 通用CSS选择器
- `*text` - 按文本内容查找
- 标准字符串 - 完全匹配

这允许同一英文文本在不同上下文中有不同翻译。

---

## 已知遗留问题（低优先级）

| 行号 | 原文 | 现有翻译 | 问题类型 | 备注 |
|------|------|----------|----------|------|
| 49 | `Tickspeed upgrades` | `计数频率 升级` | 机械直译且格式不一致 | 后续统一按语境改为“时间间隔升级”或“游戏刻速率” |
| 1314 | `are gained by resetting...` | `通过重置...获得。` | 句子不完整 | 原文本身是片段，结合DOM使用 |
| 1953-1955 | EP, DT, Replicanti with ^ | `×永恒点数^` 等 | 缩写不统一 | 保留原样，这是特殊数学表达式格式 |
| 多处 | 各种描述 | -- | 可读性优化 | 建议后续进行自然度润色 |

## 2026-05-19 首屏与动态 UI 复审

| 范围 | 修复内容 | 验证方式 | 备注 |
|------|----------|----------|------|
| 反物质维度 / 时间间隔 | 将购买模式、花费、购买数量、游戏刻速率说明改为源码级中文 | Playwright 首屏回归 | 修复 `Until 10`、`Buy 10`、`Tickspeed Cost` 等拆分文本 |
| 无限维度 / 永恒按钮 | 将解锁要求、购买按钮、效果标签改为源码级中文 | 可见文本审计 | 修复 `Reach 1.80e308`、`Currently:` 等长期显示文本 |
| 新闻滚动条 | `innerHTML` 写入前进行规范化翻译匹配 | Playwright 指定新闻回归 | 主审计不统计随机新闻，避免结果不稳定 |
| 商店 | 恢复商店 tab 展示，禁用支付并保留机制说明 | Playwright 商店回归 | `gh-pages` 必须发布 `build:chinese` 产物 |
| 统计 / 倍率明细 / 时间定理 | 修复高频说明文本和日期格式 | 可见文本审计 | 保留主题名、STD、IP/EP 等缩写 |
| 游戏玩法弹窗 | 将关键玩法正文改为整段中文覆盖，并把 H2P 页签纳入审计 | Playwright H2P 回归 + 可见文本审计 | 修复“效果叠加”、无限、复制体、时间研究、现实、符文、黑洞等正文混杂英文 |
| 选项-存档页 / 新闻滚动条 | 源头中文化存档页按钮、占位符、tooltip，并为新闻池增加中文兜底 | Playwright 固定新闻 + 属性审计 + 新闻抽样审计 | 修复 `Set a custom name`、`Custom save name`、`There are no typos...` 等属性和随机文本漏检 |

---

## 修复优先级参考

### 高优先级 (影响游戏理解) — ✅ 全部完成
1. ~~缩写字母定义修正 (AM, EP等)~~
2. ~~物理意义错误修正 (Peak: 应为峰值)~~
3. ~~不完整条目修复~~

### 中优先级 (影响用户体验) — ✅ 全部完成
1. ~~术语统一性检查~~
2. ~~Replicanti Galaxy 术语统一~~
3. ~~Dim Boosts 误译修正~~
4. ~~Additive 术语修正~~

### 低优先级 (美观性) — 保留
1. 空格和缩进微调（保持现有约定）
2. 评论和元数据整理
