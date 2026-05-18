# 中文化重做规格说明

## 背景

当前仓库来自 `IvarK/AntimatterDimensionsSourceCode`，保留了上游 Vue 2 源码结构。中文版目标不是直接改写上游业务逻辑，而是在尽量保持上游可同步的前提下，提供稳定、可测试、可审计的中文 UI。

历史实现已经加入 `i18n/` 运行时翻译层，但仍有三个问题：

1. 翻译数据来自旧锅巴汉化字典，存在术语不一致、直译、生硬和语义误判。
2. Vue 动态渲染会产生大量组合文本，仅靠一次 DOM 扫描容易漏翻。
3. 原版商店依赖 Google/Steam/支付后端，本地或离线构建中 `Cloud.isAvailable` 为假时商店 tab 会消失。

## 目标

1. 商店 tab 在中文版中始终可见。
2. 中文版不提供支付入口，不注入免费 STD，不改变游戏平衡。
3. 商店页改为中文离线说明和原版项目预览，保留存档兼容显示。
4. 翻译引擎继续作为非侵入式 UI 翻译层使用，并减少调试噪声。
5. 增加可重复运行的 Playwright 回归脚本，用于检查首屏、商店页和核心文本的中文覆盖。

## 非目标

1. 本阶段不重写游戏机制源码。
2. 本阶段不连接任何国内支付、账号或云存档服务。
3. 本阶段不自动机器翻译全部 `src/core/secret-formula/h2p.js` 长篇教程文本；长文本必须按术语表人工校对后逐步纳入。

## 翻译原则

1. `Dimension` 统一为“维度”，不使用“次元”。
2. `Tickspeed` 统一为“计数频率”。
3. `Replicanti` 统一为“复制品”。
4. `Dimension Boost` 统一为“维度提升”。
5. `Big Crunch` 统一为“大坍缩”。
6. `Power effect` 在效果分类中译为“幂次效果”。
7. UI 动作使用短句，例如“购买”“导入”“导出”“启用”“禁用”。
8. 教程文本以解释机制为优先，不逐词贴英文句式。

## 商店 tab 设计

中文版商店 tab 使用以下策略：

1. `src/core/secret-formula/tabs.js` 中商店 tab 的 `condition` 改为 `() => true`。
2. tab 名称和子 tab 名称直接显示“商店”。
3. `ShopTab.vue` 不再显示 Google 登录、购买更多、重置商店或支付 loading。
4. `ShopButton.vue` 只展示原版商店项目效果、当前倍率和原价，购买按钮永久禁用。
5. 保留 `ShopPurchaseData` 的读取，以便导入原版存档时能显示已有 STD 记录。
6. `i18n/inject.js` 不再加载 `i18n/shop-hack.js`，避免自动发放 STD。

## 验收标准

1. 本次新增/修改的商店与测试文件通过定向 ESLint；全仓库 `npm run lint` 目前仍受上游既有 lint 债影响。
2. `bash scripts/build-chinese.sh` 通过，`dist/index.html` 包含 `window.__AD_I18N__`。
3. Playwright 回归通过：
   - 页面标题为“反物质维度”。
   - 首屏核心操作文本出现中文。
   - 商店 tab 可见并可打开。
   - 商店页面包含中文版离线说明。
   - 商店页面不出现 Google 登录、Buy More、In-app Purchases 等原版支付入口英文。

## 后续翻译审查流程

1. 运行 Playwright 回归，收集可见英文。
2. 若英文来自固定 UI 文本，优先加入对应 `i18n/zh-CN/*.json`。
3. 若英文来自商店或中文版定制页，优先在 Vue 组件中直接改中文。
4. 若英文来自动态数字句式，补充 `i18n/regex-data.js` 正则规则。
5. 更新 `docs/translation-review.md`，记录术语和语义修正原因。
