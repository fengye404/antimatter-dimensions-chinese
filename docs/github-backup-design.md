# GitHub 自动备份设计

## 背景

PWA 方案可以避免 iOS 免费签名 7 天过期的问题，但 Safari/PWA 的 `localStorage`、`IndexedDB` 和 Cache API 都属于浏览器管理的网站数据，不能保证永远不会被系统或用户清理。因此需要一个不依赖 Apple Developer 账号的云备份方案。

当前 iOS App 版本已经改为以 App 内部 `SaveStore` 作为主要存档来源，WebView localStorage 只作为运行时缓存。本设计主要服务浏览器/PWA 路线；在 iOS App 内，GitHub Gist 可作为额外手动备份思路，但不再承担主存储职责。

## 方案

使用 GitHub Gist 保存游戏存档备份。

1. 用户自己创建 GitHub Token，并只授予 Gist 读写权限。
2. 游戏在“选项 / 存档”页保存 Token 和可选 Gist ID。
3. 如果没有填写 Gist ID，第一次备份会自动创建一个 secret Gist。
4. 之后每次游戏本地保存都会排队自动同步；默认跟随游戏 30 秒自动保存间隔，若玩家调整本地自动保存间隔，GitHub 备份也随之变化。
5. 用户也可以手动“立即备份到 GitHub”或“从 GitHub 恢复”。

## 存储内容

Gist 中写入 `antimatter-dimensions-chinese-save.json`：

```json
{
  "schema": 1,
  "app": "antimatter-dimensions-chinese",
  "reason": "auto-save",
  "savedAt": "2026-05-20T00:00:00.000Z",
  "saveKey": "dimensionSave",
  "currentSlot": 0,
  "gameVersion": 25,
  "saves": {
    "dimensionSave": "...",
    "backupSave-0-0": "...",
    "backupTimes-0": "..."
  }
}
```

新存档实测备份 JSON 约 6.6 KB；即使进入后期，存档通常也远小于 GitHub Gist API 单文件内容返回的 1 MB 量级。恢复逻辑会优先读取 API 返回的 `content`，如果 GitHub 标记文件被截断，则改用 `raw_url` 读取完整原始文件。

## 安全边界

1. Token 不写进源码，只保存在用户本机浏览器的 localStorage。
2. 推荐使用 GitHub fine-grained token，并只开放 Gist 读写能力。
3. GitHub secret Gist 是“非公开索引”的链接内容，不是端到端加密保险箱；获得链接或 Token 的人仍可能访问。
4. 不要把 Gist 链接、Token 或浏览器 profile 分享给他人。
5. Token 丢失或过期不会删除 GitHub 上的备份；重新创建 Token 并填回同一个 Gist ID 后即可继续自动备份。
6. 只恢复已有备份时，可以只填写 Gist ID，不填写 Token；这依赖 secret Gist “知道链接即可访问”的 GitHub 语义。
7. 如果浏览器网站数据被清空，游戏无法自动知道原来的 Gist ID，用户需要从自己的 GitHub Gist 列表或已保存的 Gist 链接中找回。
8. 后续如果需要更强隐私，可以在上传前加入用户口令加密。

## 失败策略

1. GitHub 不可用时，本地保存照常进行。
2. 备份失败只显示提示，不阻塞游戏保存。
3. 最近错误会显示在“GitHub 自动备份”面板中。
4. 从 GitHub 恢复只接受 `app === "antimatter-dimensions-chinese"` 且 `schema === 1` 的备份。

## 后续增强

1. 增加上传前口令加密。
2. 增加冲突检测：比较 Gist `savedAt` 和本地最后保存时间。
3. 增加 PWA 离线缓存和启动时恢复引导。
4. 已增加 GitHub Gist 创建和恢复流程的 Playwright 网络 mock 回归。
