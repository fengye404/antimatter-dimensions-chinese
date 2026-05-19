# GitHub 自动备份设计

## 背景

PWA 方案可以避免 iOS 免费签名 7 天过期的问题，但 Safari/PWA 的 `localStorage`、`IndexedDB` 和 Cache API 都属于浏览器管理的网站数据，不能保证永远不会被系统或用户清理。因此需要一个不依赖 Apple Developer 账号的云备份方案。

## 方案

使用 GitHub Gist 保存游戏存档备份。

1. 用户自己创建 GitHub Token，并只授予 Gist 读写权限。
2. 游戏在“选项 / 存档”页保存 Token 和可选 Gist ID。
3. 如果没有填写 Gist ID，第一次备份会自动创建一个 secret Gist。
4. 之后每次保存游戏会排队自动同步，最多每 5 分钟上传一次。
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

## 安全边界

1. Token 不写进源码，只保存在用户本机浏览器的 localStorage。
2. 推荐使用 GitHub fine-grained token，并只开放 Gist 读写能力。
3. GitHub secret Gist 是“非公开索引”的链接内容，不是端到端加密保险箱；获得链接或 Token 的人仍可能访问。
4. 不要把 Gist 链接、Token 或浏览器 profile 分享给他人。
5. 后续如果需要更强隐私，可以在上传前加入用户口令加密。

## 失败策略

1. GitHub 不可用时，本地保存照常进行。
2. 备份失败只显示提示，不阻塞游戏保存。
3. 最近错误会显示在“GitHub 自动备份”面板中。
4. 从 GitHub 恢复只接受 `app === "antimatter-dimensions-chinese"` 且 `schema === 1` 的备份。

## 后续增强

1. 增加上传前口令加密。
2. 增加冲突检测：比较 Gist `savedAt` 和本地最后保存时间。
3. 增加 PWA 离线缓存和启动时恢复引导。
4. 增加自动备份状态的 Playwright 网络 mock 回归。
