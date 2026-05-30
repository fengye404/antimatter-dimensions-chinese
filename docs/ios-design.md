# iOS App 技术设计文档

## 背景

当前中文版已经迁移为源码级中文化，并通过 `npm run build:ios` 生成可离线运行的 iOS Web 资源。仓库已包含 SwiftUI + WKWebView iOS 工程，目标是在 iPhone/iPad 上离线游玩，并保持 Web 版文本存档导入导出兼容。

当前阶段的重点不是重写游戏逻辑，而是把 Web 游戏放进可靠的 App 容器：手机 UI 由 Web 端适配，存档由 iOS 原生 `SaveStore` 作为主要持久化来源，WebView 的 localStorage 只作为运行时缓存。

## 目标

1. iOS App 内置中文版 `dist/`，首次启动无需联网。
2. 游戏在 WKWebView 中运行，保留原 Web 逻辑和源码级中文化。
3. Web 版存档格式不变，仍然兼容导入/导出文本存档。
4. iOS 端提供更可靠的本地存档备份，避免只依赖 WebView 的 `localStorage`。
5. 支持 iPhone 和 iPad 横竖屏，优先保证竖屏可玩、横屏舒适。
6. 不接入真实支付、Google、Steam、PlayFab 或 Firebase 云存档。

## 非目标

1. 第一阶段不重写原游戏为原生 Swift UI。
2. 第一阶段不做 iCloud 同步。
3. 第一阶段不接入 Game Center 成就。
4. 第一阶段不处理 App Store 付费/IAP。
5. 第一阶段不从线上动态下载游戏代码，避免引入审核和安全风险。

## 推荐路线

### 方案 A：离线 WKWebView 容器

这是推荐 MVP。

1. `npm run build:chinese` 生成 `dist/`。
2. 构建脚本把 `dist/` 复制到 `ios/AntimatterDimensionsChinese/Web/`。
3. SwiftUI App 使用 `WKWebView` 加载 `Web/index.html`。
4. `WKWebsiteDataStore.default()` 保留 WebView 的 `localStorage` 作为运行时缓存。
5. JS 主动把关键存档同步给原生，原生写入 `Application Support/AntimatterDimensionsChinese/saves.json`，并在下次启动时回灌到 WebView。

优点：实现快，风险低，保留原游戏逻辑。

缺点：UI 仍是 Web UI，需要额外处理 iOS 手势、视口、安全区和输入体验。

### 方案 B：PWA / 添加到主屏幕

只依赖 GitHub Pages 或本地服务器，通过 Safari 添加到主屏幕。

优点：几乎不用写 iOS 代码。

缺点：离线稳定性、存档可靠性、文件导入导出和沉浸体验都弱，不符合“做成 App”的目标。

### 方案 C：原生重写

用 Swift/SwiftUI 重写游戏界面和逻辑。

优点：体验最好，长期可做得很原生。

缺点：工作量极大，Antimatter Dimensions 的机制、存档迁移、超大数和 UI 状态都很复杂，不适合作为第一阶段。

结论：先做方案 A，等容器、存档和手机交互稳定后，再决定是否把个别页面原生化。

## iOS 工程结构

建议新增：

```text
ios/
├── AntimatterDimensionsChinese.xcodeproj
├── AntimatterDimensionsChinese/
│   ├── App/
│   │   └── AntimatterDimensionsChineseApp.swift
│   ├── WebView/
│   │   ├── GameWebView.swift
│   │   ├── WebViewCoordinator.swift
│   │   └── NativeBridge.swift
│   ├── Storage/
│   │   ├── SaveStore.swift
│   │   └── SaveEnvelope.swift
│   ├── UI/
│   │   ├── RootView.swift
│   │   └── ToolbarView.swift
│   ├── Resources/
│   │   └── Web/                  # 构建脚本复制 dist/ 到这里
│   └── Info.plist
└── scripts/
    └── sync-web-assets.sh
```

## Web 资源加载

MVP 使用 `WKWebView.loadFileURL(_:allowingReadAccessTo:)` 加载本地 `index.html`，读取权限限制在 `Resources/Web/` 目录内。

Swift 侧流程：

1. 定位 Bundle 中的 `Web/index.html`。
2. 以 `Web/` 目录作为 `allowingReadAccessTo`。
3. 禁止任意外链在当前 WebView 中打开，外部链接统一交给 `SFSafariViewController` 或系统浏览器。
4. 注入一段 document-start JS，提供 `window.ADNative` 桥接对象。

备选：如果 `file://` 下 localStorage 或资源路径在后续测试中出现兼容问题，再改为 `WKURLSchemeHandler` 注册 `adcn://game/index.html` 自定义 scheme。

## 存档方案

游戏当前使用：

1. 主存档 key：生产构建为 `dimensionSave`。
2. 自动备份 key：`backupSave-{slot}-{backupSlot}`。
3. 备份时间 key：`backupTimes-{slot}`。
4. 存档序列化：`GameSaveSerializer.serialize(root)`。

iOS 不应只依赖 WebView localStorage。当前采用 App 内部存储优先：

1. Web 层继续按原逻辑读写 localStorage，保证游戏最小改动和 Web 兼容，但它只被视为运行时缓存。
2. 每次 `GameStorage.save()`、导入、切换槽位、写备份后，通过 JS bridge 把以下数据同步到原生：
   - `dimensionSave`
   - 所有 `backupSave-*`
   - `backupTimes-*`
   - 同步时间和同步原因
3. 原生 `SaveStore` 写入 `Application Support/AntimatterDimensionsChinese/saves.json`。
4. App 启动时，原生把 `SaveStore` 中的主存档和备份槽全量注入回 localStorage，再加载游戏页面。
5. 如果清理 WebView 缓存或系统回收网站数据，下次打开仍会从 App 内部存档恢复。
6. Web/PWA 的 GitHub Gist 备份仍可保留为浏览器路线的云备份方案，但 iOS App 不以 GitHub Token 或浏览器 localStorage 作为主要存储。

## JS Bridge 设计

Web 到原生：

```js
window.webkit.messageHandlers.adNative.postMessage({
  type: "save",
  key: "dimensionSave",
  value: localStorage.getItem("dimensionSave"),
  timestamp: Date.now()
});
```

原生到 Web：

```js
for (const [key, value] of Object.entries(savedRecords)) {
  localStorage.setItem(key, value);
}
window.location.reload();
```

桥接脚本由 iOS 在 document-start 注入，提供 `window.ADNative.syncSave(reason)` 和 `window.ADNative.exportSave()`。Web 环境下没有该对象，浏览器版不受影响。

## 原生功能

第一阶段必须有：

1. 离线打开游戏。
2. 横竖屏可玩。
3. 本地存档持久化。
4. 导出当前存档到系统分享面板。
5. 从文件/剪贴板导入 Web 版文本存档。
6. 清理缓存/重载游戏入口，便于救援。

第二阶段再做：

1. iCloud Drive 手动备份。
2. iCloud 自动同步。
3. App 内日志面板。
4. 崩溃和 WebView 错误收集。
5. 原生设置页：清缓存、导出诊断包、切换调试模式。

## 适配与体验

1. 默认允许横竖屏，iPad 支持全屏和分屏。
2. 在 `index.html` 或 iOS 专用 CSS 中补充 viewport/safe-area：
   - `viewport-fit=cover`
   - `env(safe-area-inset-*)`
3. 禁止双击缩放和长按选中文本，但保留输入框、导入框的正常编辑。
4. 对 iPhone 小屏，优先测试现代 UI 的侧边栏、成就页、商店页、H2P 弹窗和选项弹窗。
5. 对大资源继续保持首屏懒加载，避免 WKWebView 启动卡顿。

## 构建流程

新增脚本：

```bash
npm run build:ios
```

建议串联：

1. `npm run build:chinese`
2. 删除旧的 `ios/AntimatterDimensionsChinese/Resources/Web`
3. 复制 `dist/` 到 `Resources/Web`
4. 写入 `Resources/Web/ios-build.json`
5. 可选：删除 App 内不需要的 Web-only 资源，例如 `font_test.html`

Xcode build phase 也可以调用 `ios/scripts/sync-web-assets.sh`，但不要在每次 Swift 编译时自动跑完整 Web 构建，避免 Xcode 构建过慢。推荐由 npm 脚本显式同步。

## 测试计划

Web 侧继续运行：

1. `npm run build:chinese`
2. `npm run audit:i18n`
3. `npm run audit:i18n:visual`
4. `npm run test:e2e`

iOS 侧新增：

1. Xcode 单元测试：`SaveStore` 读写、冲突选择、损坏文件恢复。
2. XCUITest：启动 App，等待游戏标题，点击维度购买，保存后杀进程重启，验证反物质/维度数量仍存在。
3. XCUITest：导出存档，清档，导入存档，验证恢复。
4. 真机测试：低电量模式、飞行模式、后台挂起超过 1 小时、切换系统深色模式、旋转屏幕。

## 分发策略

### 自用 / TestFlight

这是最现实的第一目标。

1. 个人设备可用 Xcode 直接安装。
2. 小范围测试可走 TestFlight。
3. 不需要一开始就处理完整 App Store 元数据。

### App Store

可以作为后续目标，但需要提前注意：

1. App Store 对“只是重新包装网站”的 App 有最低功能要求；需要至少提供离线能力、本地存档、导入导出、原生错误恢复等 App 级功能。
2. 如果 App 内含商店样式页面，必须明确不提供真实购买，不能引导外部支付。
3. HTML5/JavaScript 内容责任仍由 App 提交方承担，不能动态下载不受控代码。
4. 需要确认 Antimatter Dimensions 原项目授权、名称、图标和素材使用边界；这是上架最大非技术风险。

## 风险

1. `dist/js/app.js` 约 27MB，`chunk-vendors.js` 约 10MB，App 首次 WebView 解析时间可能偏长。
2. `file://` origin 下 localStorage 行为需要真机验证；若不稳定，切换到自定义 scheme。
3. 原版里仍包含 Firebase/Google/Steam 相关依赖，虽然中文版不连接支付和云存档，但 iOS 构建需要验证不会发起多余网络请求。
4. 如果只靠 WebView localStorage，卸载、系统清理或 WKWebView 数据异常会造成存档丢失，因此原生备份是必须项。
5. App Store 上架存在 IP/授权和“套壳网页”审核风险。

## 实施阶段

### 第 0 阶段：技术验证

1. 创建最小 SwiftUI + WKWebView 工程。
2. 手动复制 `dist/` 并加载 `index.html`。
3. 真机验证首屏、维度购买、离线进度弹窗、成就页、商店页。

### 第 1 阶段：MVP

1. 建立正式 `ios/` 目录和 Xcode 工程。
2. 新增 `npm run build:ios` 资源同步。
3. 实现 `GameWebView`、`NativeBridge`、`SaveStore`。
4. 接入主存档同步和启动恢复。
5. 添加导入/导出存档。

### 第 2 阶段：体验打磨

1. iPhone/iPad 布局适配。
2. 原生工具栏：导出、导入、重载、备份管理。
3. 增加 iOS 专用 CSS 修复小屏可读性。
4. XCUITest 覆盖存档和离线启动。

### 第 3 阶段：分发准备

1. 图标、启动图、隐私说明。
2. TestFlight 包。
3. 真机长期挂机测试。
4. 根据目标决定是否准备 App Store 审核材料。

## 参考

1. Apple `WKWebView.loadFileURL(_:allowingReadAccessTo:)`：https://developer.apple.com/documentation/webkit/wkwebview/loadfileurl%28_%3Aallowingreadaccessto%3A%29
2. Apple `WKScriptMessageHandler`：https://developer.apple.com/documentation/webkit/wkscriptmessagehandler
3. Apple App Review Guidelines： https://developer.apple.com/app-store/review/guidelines/
