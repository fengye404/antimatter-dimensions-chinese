# 中文化重做规格说明

## 背景

当前仓库来自 `IvarK/AntimatterDimensionsSourceCode`，保留了上游 Vue 2 源码结构。中文版目标不是直接改写上游业务逻辑，而是在尽量保持上游可同步的前提下，提供稳定、可测试、可审计的中文 UI。

历史实现已经加入 `i18n/` 运行时翻译层，但仍有三个问题：

1. 翻译数据来自旧锅巴汉化字典，存在术语不一致、直译、生硬和语义误判。
2. Vue 动态渲染会产生大量组合文本，仅靠一次 DOM 扫描容易漏翻。
3. 原版商店依赖 Google/Steam/支付后端，本地或离线构建中 `Cloud.isAvailable` 为假时商店 tab 会消失。

## 目标

1. 商店 tab 在中文版中始终可见。
2. 中文版不提供真实支付入口，但允许在本地免费购买原版商店项目。
3. 商店页改为中文离线说明和本地免费商店，保留存档兼容显示。
4. 中文化迁移到 `src/` 源码层和构建源文件，不再依赖 DOM 运行时翻译引擎。
5. 增加可重复运行的 Playwright 回归脚本，用于检查首屏、商店页和核心文本的中文覆盖。

## 非目标

1. 本阶段不改动核心数值公式和存档结构。
2. 本阶段不连接任何国内支付、账号或云存档服务。
3. 本阶段不自动机器翻译全部 `src/core/secret-formula/h2p.js` 长篇教程文本；长文本必须按术语表人工校对后逐步纳入。

## 翻译原则

1. `Dimension` 统一为“维度”，不使用“次元”。
2. `Tickspeed` 按语境处理：机制名译为“时间间隔”，升级译为“时间间隔升级”，每秒读数译为“每秒游戏刻数”。
3. `Replicanti` 统一为“复制品”。
4. `Dimension Boost` 统一为“维度提升”。
5. `Big Crunch` 统一为“大坍缩”。
6. `Power effect` 在效果分类中译为“幂次效果”。
7. UI 动作使用短句，例如“购买”“导入”“导出”“启用”“禁用”。
8. 教程文本以解释机制为优先，不逐词贴英文句式。

## 移动版参考边界

1. Google Play 简体中文页面采用“反物质维度”“多层重置机制”“隐藏要素”“无限点数”“升级项目”“整体产出”等说法，可作为官方商店文案风格参考。
2. Antimatter Dimensions Wiki 说明安卓版是原生 Android 应用、存档与网页版兼容，但安卓版源码不公开，因此不能从官方仓库直接同步完整 UI 翻译。
3. 第三方 APK 站点和玩家攻略只能作为术语线索，不作为可直接复制的权威译文来源。
4. 中文版翻译策略是参考移动版自然表达，并在本仓库内形成可审计术语表，而不是照搬来源不明的二进制资源文本。

参考来源：

1. Google Play 简体中文页面：https://play.google.com/store/apps/details?hl=zh&id=kajfosz.antimatterdimensions
2. Google Play 中文香港页面：https://play.google.com/store/apps/details?hl=zh_HK&id=kajfosz.antimatterdimensions
3. 移动版 Wiki：https://antimatter-dimensions.fandom.com/wiki/Antimatter_Dimensions_Mobile

## 商店 tab 设计

中文版商店 tab 使用以下策略：

1. `src/core/secret-formula/tabs.js` 中商店 tab 的 `condition` 改为 `() => true`。
2. tab 名称和子 tab 名称直接显示“商店”。
3. `ShopTab.vue` 不再显示 Google 登录、购买更多、重置商店或支付 loading。
4. `ShopButton.vue` 展示原版商店项目效果、当前倍率和原价，并将按钮改为“免费购买”。
5. `ShopPurchaseState.purchase()` 在中文版中只修改本地存档：增加购买次数、启用商店加成、触发即时效果，不访问 Google、Steam、PlayFab 或支付后端。
6. 免费购买不消耗 STD；保留 `ShopPurchaseData` 的读取，以便导入原版存档时能显示已有 STD 记录。
7. `i18n/inject.js` 不再加载 `i18n/shop-hack.js`，避免构建时自动发放 STD；购买必须由玩家在商店页主动点击。

## 验收标准

1. 本次新增/修改的商店与测试文件通过定向 ESLint；全仓库 `npm run lint` 目前仍受上游既有 lint 债影响。
2. `bash scripts/build-chinese.sh` 通过，`dist/index.html` 不包含 `window.__AD_I18N__` 或运行时翻译引擎。
3. Playwright 回归通过：
   - 页面标题为“反物质维度”。
   - 首屏核心操作文本出现中文。
   - 商店 tab 可见并可打开。
   - 商店页面包含中文版免费购买说明。
   - 商店按钮可点击，并能提升本地购买倍率。
   - 商店页面不出现 Google 登录、Buy More、In-app Purchases 等原版支付入口英文。

## 后续翻译审查流程

1. 运行 Playwright 回归，收集可见英文。
2. 若英文来自固定 UI 文本，优先在对应 `src/` 组件或数据源中直接中文化。
3. 若英文来自商店或中文版定制页，继续在 Vue 组件中直接改中文。
4. 若英文来自动态数字句式，优先改写生成句式的源码函数，而不是新增 DOM 翻译规则。
5. 更新 `docs/translation-review.md`，记录术语和语义修正原因。

## 2026-05-19 阶段式审计补充

### 游戏机制理解

本仓库的核心流程按重置层推进：

1. 反物质维度负责产出反物质，玩家通过购买维度、时间间隔升级、维度提升和反物质星系进入首次无限。
2. 无限阶段解锁无限点数、无限升级、突破无限、无限维度、复制品和无限挑战。
3. 永恒阶段解锁永恒点数、时间维度、时间研究、永恒升级、永恒里程碑、永恒挑战和时间膨胀。
4. 现实阶段解锁现实机器、符文、特权、黑洞、现实升级和后续天体系统。
5. 天体系统是后期长线内容，依赖 Teresa、Effarig、无名之辈、V、Ra、Lai'tela、Pelle 等解锁条件。

### 审计工具

新增 `npm run audit:i18n`，由 `scripts/audit-i18n-visible-text.js` 启动本地 `dist/` 静态服务并使用 Playwright 真实浏览器遍历可见 Tab/Subtab。脚本会构造以下阶段：

1. 新存档：覆盖首屏、选项、统计、成就、商店。
2. 无限阶段：设置无限点数、突破无限、无限维度和复制品解锁。
3. 永恒阶段：设置永恒点数、时间研究和永恒挑战入口。
4. 现实阶段：设置现实机器、特权点、黑洞和现实子页入口。

报告写入 `docs/i18n-audit-report.md`。报告中的候选项不是自动失败条件，允许保留缩写、样式名、专有名和数值单位；其余进入翻译修复队列。

### 本轮修复策略

本轮不再只依赖运行时字典。对于 Vue 模板拆分文本、长期显示的导航名称、核心机制说明和格式化函数，直接在源组件中中文化，以减少 DOM 翻译竞态和半句中英混排。

### 源码级中文化迁移

用户确认后，中文版迁移为源码级中文化：

1. `src/` 中的 Vue 组件、机制文案函数、游戏数据库展示文案直接输出中文。
2. `i18n/inject.js` 保留为构建后处理脚本，只负责 HTML 元数据、资源版本号和 glossary 复制。
3. 构建产物不得包含 `window.__AD_I18N__`、`i18n/translation-engine.js` 或其他 DOM 扫描式翻译注入。
4. 新闻、H2P、成就、商店、确认弹窗等命令式或 `v-html` 渲染路径必须在写入 DOM 前完成中文文本选择。
5. 上游同步时，优先用源码 diff 重新应用中文化补丁；`i18n/zh-CN/*.json` 仅作为历史参考，不再作为线上运行时依赖。

### H2P 教程弹窗

“游戏玩法”弹窗正文来自 `src/core/secret-formula/h2p.js`，并通过 `v-html` 整块渲染。运行时 DOM 翻译容易因为源码换行、字面量 `\n`、转义引号和 HTML 分隔导致大段正文漏翻。中文版在 `H2PModal.vue` 中维护已经人工校对的中文正文覆盖和条目名映射；已覆盖条目直接输出中文，未覆盖条目会在审计报告中暴露，进入后续人工翻译队列。

### 首屏动态文本与新闻滚动条

首屏的反物质维度购买按钮、时间间隔按钮和新闻滚动条都属于高频可见 UI，不应只依赖 DOM 翻译。维度行与时间间隔行直接在 Vue 组件中输出中文；新闻滚动条在写入 `innerHTML` 前先用规范化文本匹配中文词典，处理新闻源码中的换行、HTML 标签和动态拼接残留。回归测试需要覆盖“补至 10 个”“时间间隔花费”“商店入口可见”和指定新闻 `a294` 的中文化。

### GitHub Pages 部署

`gh-pages` 必须发布经过中文版构建后处理的 `dist/`。`master` 分支的 Pages 工作流使用 `npm run build:chinese`，该脚本先执行原版构建，再执行 `i18n/inject.js`。当前 `i18n/inject.js` 只处理标题、`lang`、静态资源版本号和辅助资源复制，不再注入 `window.__AD_I18N__` 或 DOM 翻译引擎。

### 发布缓存策略

GitHub Pages 与浏览器都可能短时间缓存固定 URL 的 `js/app.js`、`js/chunk-vendors.js` 和样式文件。由于选项弹窗、快捷键列表等翻译已经进入 Vue bundle，如果用户继续执行旧 `app.js`，就会出现“源码已中文化但线上仍是一堆英文”的现象。

`i18n/inject.js` 读取 `dist/commit.json`，并为本地 JS/CSS 追加 `?v=<commit>` 版本参数。每次提交后重新构建都会生成新的资源 URL，确保 GitHub Pages 发布和用户浏览器都能拿到最新中文 bundle。

### 审计口径

新闻滚动条包含数千条随机消息，会让可见英文审计结果随抽样波动。主审计报告不统计 `.c-news-ticker` 文本，新闻翻译路径由 Playwright 专项用例固定消息 `a294` 覆盖。报告中剩余的 `AMOLED`、`Blob`、`Emoji`、`STD`、`Kms` 等候选项属于主题名、商店货币缩写或数值单位，默认允许保留；后续若要做完全中文化，可单独开术语决策。

### 点击弹窗审计补充

用户抽查发现“选项”页里的指数记数法设置、快捷键、新闻选项等弹窗仍存在整段英文。原因是第一轮审计只遍历可见 Tab/Subtab，未主动触发这些需要点击按钮才出现的 Modal。

本轮将以下高频选项弹窗纳入固定回归和可见英文审计：

1. 指数记数法设置。
2. 快捷键列表。
3. 新闻选项。
4. 信息显示选项。
5. 确认选项。
6. 离线进度选项。
7. 动画选项。
8. 修改可见标签页。
9. 自动备份存档。

验收要求：

1. 以上弹窗标题、说明段落、开关标签和滑块标签必须源头中文化。
2. `npm run test:e2e` 必须主动打开这些弹窗，并断言截图中已出现过的英文标题不再出现。
3. `npm run audit:i18n` 必须在每个游戏阶段额外打开这些弹窗，避免只覆盖首屏静态文本。
4. 快捷键、离线进度、确认项等来自运行期配置的名称需要在组件层显式映射，不能只依赖模板翻译。

### 内容概要弹窗审计补充

用户继续抽查发现“统计”页的“查看内容概要”弹窗仍存在英文段落。该弹窗由 `CatchupModal.vue` 的模板说明、`progress-checker.js` 的阶段和建议资源、`catchup-resources.js` 的机制摘要共同拼接，之前只靠运行时词典翻译，审计也没有主动打开该弹窗。

本轮要求：

1. 内容概要标题、引导说明、底部建议语直接在组件层中文化。
2. 进度阶段保留英文内部 `name` 用于原版逻辑和 H2P alias，新增中文 `displayName` 用于 UI 展示。
3. 全量内容概要资源表新增中文 `displayName` 并将摘要说明源头中文化。
4. Playwright 回归必须打开内容概要并展开反物质产出分组，断言截图中出现过的英文说明不再出现。
5. `npm run audit:i18n` 必须在每个模拟阶段主动打开内容概要并展开所有分组，避免统计页弹窗再次漏审。

## 2026-05-19 视觉一致性补充

### 问题

原版 UI 大量使用自定义 `Typewriter` 字体。该字体没有完整中文字符设计，浏览器会在同一段文本中用 `Typewriter` 渲染英文和数字、再用系统中文 fallback 渲染汉字，导致同一句内字体、字重和视觉大小不一致。运行时翻译层还会在局部文本节点上替换内容，使这种不一致更明显。

### 设计

1. `public/index.html` 将页面语言声明改为 `zh-CN`。
2. 新增 `public/stylesheets/chinese-localization.css` 并在所有原版样式后加载。
3. 中文版常规 UI 使用系统中文 UI 字体栈，优先 `PingFang SC`、`Microsoft YaHei`、`Noto Sans CJK SC`、`Source Han Sans SC`。
4. 图标字体、CodeMirror、自动机代码块和符文/特殊视觉仍保留各自专用字体，避免破坏原版机制表达。
5. Playwright 回归新增字体栈检查，防止 `body`、`#page`、主按钮和 Tab 按钮继续落回 `Typewriter`。

## 2026-05-19 首屏性能补充

### 问题

进入游戏时会出现明显卡顿。首屏资源检查发现两个高风险点：

1. `public/images/loading.png` 是 3840×2160 PNG，体积约 1.2MB，作为加载遮罩背景会在首屏立即请求。
2. `public/images/stars-bg.webm` 体积约 10MB，原先在 `index.html` 中带 `autoplay`，即使默认主题不显示星空动画，也会在进入页面时开始下载和解码。

### 设计

1. 首屏加载遮罩不再使用装饰图片，直接使用纯黑 CSS 背景，避免进入游戏时请求 `loading.png` 或 `loading.webp`。
2. 星空背景视频改为 `preload="none"`，初始进入游戏时不再请求静态星空图或 10MB 视频。
3. 现实动画视频也改为 `preload="none"`，只在真正触发现实动画时由现有逻辑播放。
4. `Theme.set()` 只在启用 S6/S10 且背景动画开启时播放星空视频；其他主题暂停视频，避免后台解码。
5. Playwright 回归新增首屏资源断言：初始进入游戏不得请求 `loading.webp`、`loading.png`、`stars-bg.webm` 或 `realityanimbg.webm`。

## 2026-05-19 游戏玩法正文审计补充

### 问题

“游戏玩法”弹窗的正文来自 `GameDatabase.h2p` 中的大段 HTML 字符串。原先的运行时翻译按文本片段匹配，遇到 `<br>`、`<b>`、动态解锁段落和局部插值时会漏掉整段英文，造成同一页里标题已中文化、正文仍中英混杂。

### 设计

1. `H2PModal.vue` 对高频和机制关键玩法条目使用整段中文正文覆盖，覆盖范围从新存档、效果叠加、反物质维度扩展到无限、复制体、永恒、时间研究、现实、符文、特权和黑洞。
2. 覆盖正文以机制解释为准，不逐字硬译，优先保持术语一致、句子自然、玩家能理解当前阶段目标。
3. `npm run audit:i18n` 主动打开“游戏玩法”弹窗并逐个点击当前阶段已解锁页签，不再只扫主界面。
4. 可见英文审计允许保留品牌、缩写、数字后缀和存档格式标记，但不允许出现整段英文说明或中英混杂句子。
5. Playwright 回归新增“游戏玩法”机制页断言，覆盖“效果叠加”“反物质维度”“自动购买器”等用户已截图反馈的条目。

### 验收

1. `npm run test:e2e` 必须全部通过。
2. `npm run audit:i18n` 的候选英文残留必须为 0。
3. 用户截图中的 `These effects are typically...`、`Hotkey:`、`Dimension Boost`、`Infinity Dimension` 等正文残留不得再出现在已覆盖玩法页中。

## 2026-05-19 成就页中文化与性能补充

### 问题

普通成就和秘密成就的卡片贴图来自原版 sprite：`normal achievements.png`、`cancer achievements.png`、`secret achievements.png`。这些图片本身包含英文成就名，因此运行时翻译无法处理；同时普通成就 sprite 体积较大，进入成就页时会触发额外加载和解码，造成明显卡顿。

### 设计

1. 成就卡片不再依赖原版英文 sprite 展示标题，中文版在卡片上直接渲染中文成就名。
2. 普通成就和秘密成就 tooltip 在组件层读取中文 helper，不再等待 DOM 翻译引擎二次扫描。
3. 中文版禁用普通、癌症和秘密成就的大 sprite 背景，只保留卡片状态色、奖励星标和完成状态图标。
4. 成就页标题、自动成就倒计时、奖励说明等高频文字源头中文化。
5. 可见英文审计增加成就悬浮提示扫描，Playwright 回归断言成就页不会请求三张大英文 sprite。

### 验收

1. 普通成就卡片显示中文标题，不再露出图片内英文。
2. 悬浮成就 34 时显示“反正也不需要它”“在没有任何第 8 反物质维度的情况下到达无限”“第 1 到第 7 维度增强 2%”。
3. 成就页首轮请求不得包含 `normal achievements.png`、`cancer achievements.png`、`secret achievements.png`。
4. `npm run test:e2e` 和 `npm run audit:i18n` 必须通过。

## 2026-05-19 存档页属性文本与新闻兜底补充

## 2026-05-19 自动购买器展开态补充

### 问题

用户抽查“自动化 / 自动购买器”时发现第一反物质维度自动购买器展开后仍出现 `Current interval`、`Current bulk` 和 `Complete the challenge to upgrade interval`。这些文本来自自动购买器内部共享子组件，并且只有在自动购买器已购买或解锁后才会显示，之前的可见文本审计只覆盖了折叠态入口，因此漏掉了这类展开态英文。

### 设计

1. `AutobuyerIntervalLabel.vue` 统一输出“当前间隔”“当前批量”“立即”“无限”等中文文案。
2. `AutobuyerIntervalButton.vue` 和 `DimensionBulkButton.vue` 统一将升级按钮、花费和挑战门槛说明源头中文化。
3. `AutobuyerBox.vue` 的触发状态提示使用中文资源名和中文句式。
4. Playwright 回归直接构造第一反物质维度自动购买器的已购买状态，打开自动购买器页并断言展开态不再包含截图中的英文。
5. `npm run audit:i18n` 在遍历自动购买器页时主动暴露第一层自动购买器详情，避免只扫到外层卡片。

### 验收

1. 自动购买器展开行显示“当前间隔：0.50 秒”“当前批量：×1”。
2. 未完成挑战时按钮显示“完成对应挑战后可升级间隔”。
3. 可见文本审计不再允许 `Current interval`、`Current bulk`、`Complete the challenge to upgrade interval` 这类内部控件英文残留。

### 问题

选项-存档页仍有英文残留，但它们不在 `innerText` 中：自定义存档名的说明来自 `ach-tooltip` 属性，占位提示来自 `placeholder`。旧审计只扫可见文本节点，因此截图中的 `Set a custom name...` 和 `Custom save name` 会漏掉。新闻滚动条也存在同类问题：部分消息来自随机池，旧回归只固定检查少数新闻 ID，无法覆盖用户实际刷到的英文消息。

### 设计

1. 存档页高频按钮、存档名称、占位符和 tooltip 改为组件层中文，避免依赖运行时 DOM 二次替换。
2. 新闻滚动条在写入 `innerHTML` 前统一走 `localizedNewsText()`，先查中文词条；如果翻译结果或原文仍含明显英文，则回退到稳定的中文新闻句子。
3. `localizedNewsText()` 暴露为 `window.__AD_LOCALIZE_NEWS_TEXT__`，供审计和 E2E 对新闻数据库进行确定性抽样。
4. `npm run audit:i18n` 扩展为同时扫描可见元素的 `ach-tooltip`、`placeholder`、`aria-label`、`title` 属性，并抽样检查新闻池。
5. Playwright 回归固定覆盖用户截图中的存档页 tooltip、输入框占位符、`There are no typos...` 新闻，以及一批新闻池样本。

### 验收

1. 选项-存档页不得再出现 `Set a custom name`、`Custom save name`。
2. 新闻滚动条不得再显示用户截图中的 `There are no typos...` 英文消息。
3. `npm run test:e2e` 必须全部通过。
4. `npm run audit:i18n` 的候选英文残留必须为 0。

## 2026-05-19 时间间隔术语补充

### 问题

主界面将 `Tickspeed` 的每秒读数翻译为“游戏刻速率”，语义虽然接近原文，但中文玩家不容易理解，也容易和“时间间隔升级”这个按钮名割裂。

### 设计

1. 机制名按上下文译为“时间间隔”，购买项译为“时间间隔升级”。
2. 数值读数统一译为“每秒游戏刻数”，直接说明该数值表示每秒经过多少个游戏刻。
3. 游戏玩法说明同步解释“游戏刻”和“每秒游戏刻数”的关系，避免再次出现机械术语。

### 验收

1. 主界面顶部不再出现“游戏刻速率”。
2. 首屏应出现“每秒游戏刻数”。
3. `npm run test:e2e` 和 `npm run audit:i18n` 必须通过。

## 2026-05-19 源码级中文化收口

### 问题

用户确认不再继续依赖运行时 DOM 翻译，希望将之前的翻译修复迁移到源码级。运行时方案虽然便于上游同步，但对 Vue 模板拆分文本、`v-html` 大段正文、属性 tooltip、新闻 `innerHTML` 写入、成就图片内嵌英文等场景覆盖不稳定，线上容易出现“本地修过但 GitHub Pages 仍有英文”的错觉。

### 设计

1. 中文文本优先落在 `src/` 源码组件、配置表和 `public/index.html` 模板中。
2. `i18n/inject.js` 仅作为构建后处理：设置 `lang`、标题、描述、资源版本号，并复制术语表；不得注入 `window.__AD_I18N__` 或 DOM 翻译引擎。
3. `scripts/build-chinese.sh` 在构建后断言 `dist/index.html` 不包含运行时翻译注入标记。
4. `scripts/audit-i18n-visible-text.js` 负责真实浏览器审计，覆盖阶段推进、主要 Tab/Subtab、高频弹窗、属性文本、新闻抽样、自动购买器展开态和成就 tooltip。
5. 保留少量产品名、缩写、货币和技术品牌白名单，但真实可见英文句子必须修复到源码层。

### 维护影响

源码级中文化会让上游同步时产生更多 `src/` diff，但换来更稳定的首屏、弹窗、属性和动态 UI 表现。后续同步上游时的维护流程是：先合并上游源码，再运行 `npm run build:chinese`、`npm run audit:i18n`、`npm run test:e2e`，根据审计报告补齐新增英文。不要修改 `dist/` 作为来源，也不要重新启用 DOM 翻译引擎。

### 验收

1. `npm run build:chinese` 通过，且构建产物不包含 `window.__AD_I18N__` 或 `translation-engine`。
2. `npm run audit:i18n` 报告候选英文残留为 0。
3. `npm run test:e2e` 全部通过。
4. 商店 Tab 可见，本地免费购买可用，不连接支付后端。

## 2026-05-19 离线进度弹窗补漏

### 问题

进游戏后如果触发离线结算，离线进度弹窗仍显示 `While you were away... Nothing happened.`；有资源增长时，条目模板也会显示 `increased from ... to ...`。这类文案来自 `AwayProgressModal.vue` 和 `AwayProgressEntry.vue` 的源码模板，并且只会在离线模拟结束后出现，旧审计没有主动触发该路径。

### 设计

1. 离线弹窗标题统一改为“你离开了……期间获得了”或“你离开了……什么都没有发生”。
2. 离线资源增长条目统一用中文句式“从 A 提高到 B”，黑洞激活条目统一显示“激活了 N 次”。
3. 启动时较长离线模拟的进度条改为“离线进度模拟 / 游戏刻 / 加速 / 跳过”。
4. 秘密成就 36 的名称和描述同步改为源码级中文，避免 tooltip 或成就列表继续出现英文。
5. 审计脚本在每个阶段主动打开无变化和有变化两种离线弹窗，Playwright 回归固定断言截图里的英文不再出现。

### 验收

1. 离线弹窗不得出现 `While you were away`、`Nothing happened`、`increased from`。
2. 较长离线模拟进度条不得出现 `Offline Progress Simulation`、`Speed up`、`SKIP`。
3. `npm run audit:i18n` 必须覆盖离线弹窗路径并保持候选英文残留为 0。
