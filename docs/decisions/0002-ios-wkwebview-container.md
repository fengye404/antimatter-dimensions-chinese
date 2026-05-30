# ADR 0002: iOS 端采用 SwiftUI + WKWebView 离线容器

## 状态

已采纳。

## 背景

反物质维度本体逻辑和 UI 已经在 Web 端完成中文化与移动端适配。直接用 SwiftUI 重写整套游戏机制会引入很高风险：超大数运算、存档格式、各阶段解锁逻辑、成就与自动购买器都需要重新验证。当前目标是先让 iPhone/iPad 可以离线玩，并让存档比单纯依赖浏览器 localStorage 更稳。

## 决策

第一阶段 iOS App 使用 SwiftUI 作为原生外壳，核心游戏通过 WKWebView 加载内置的 `dist/` 构建产物：

1. `npm run build:ios` 先构建中文版 Web，再同步到 `ios/AntimatterDimensionsChinese/Resources/Web/`。
2. Xcode 工程由 `ios/project.yml` 通过 XcodeGen 生成，避免手工维护 `.pbxproj`。
3. WebView 使用 `loadFileURL(_:allowingReadAccessTo:)` 离线加载 `Web/index.html`。
4. iOS 注入 `window.ADNative`，监听 `dimensionSave`、`backupSave-*` 和 `backupTimes-*` 的 localStorage 写入，并同步到原生 `SaveStore`。
5. App 启动时以原生 `SaveStore` 为权威来源，把主存档和备份槽全量回灌到 WebView localStorage；WebView localStorage 只作为运行时缓存。
6. 原生侧提供导出当前存档、从剪贴板导入存档、重载游戏、清理 WebView 缓存等救援操作。
7. 生成的 Web 资源不提交到 git，由构建脚本生成，避免把 68MB 编译产物常驻仓库。

## 影响

优点：

1. 保留现有 Web 游戏逻辑，存档格式与 Web 版兼容。
2. 原生层很薄，容易测试和迭代。
3. 可以离线运行，也有原生文件系统备份兜底。

代价：

1. 视觉和交互体验仍主要由 Web UI 决定。
2. WKWebView 首次解析大 bundle 仍可能有启动成本。
3. 当前桥接只做本地备份和导入导出，不包含 iCloud 自动同步。

## 验证

当前实现已通过：

1. `npm run build:ios`
2. `xcodebuild test -project ios/AntimatterDimensionsChinese.xcodeproj -scheme AntimatterDimensionsChinese -destination 'platform=iOS Simulator,name=iPhone 17' -derivedDataPath ios/DerivedData`
3. 检查构建产物包含 `AntimatterDimensionsChinese.app/Web/index.html`
4. 在 iPhone 17 Pro 模拟器安装并启动 App，首屏可见游戏 UI
