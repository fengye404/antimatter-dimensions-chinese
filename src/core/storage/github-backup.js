const CONFIG_KEY = "adChineseGithubBackupConfig";
const DEFAULT_FILE_NAME = "antimatter-dimensions-chinese-save.json";
const MIN_AUTO_SYNC_INTERVAL = 5 * 60 * 1000;

function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY)) ?? {};
  } catch (e) {
    return {};
  }
}

function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

function currentSaveKey() {
  return window.GameStorage?.localStorageKey ?? "dimensionSave";
}

function relevantStorageKeys() {
  const keys = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (key === currentSaveKey() || /^backup(?:Test)?Save-/u.test(key) || /^backup(?:Test)?Times/u.test(key)) {
      keys.push(key);
    }
  }
  return keys.sort();
}

function makePayload(reason) {
  const saves = {};
  for (const key of relevantStorageKeys()) {
    saves[key] = localStorage.getItem(key);
  }

  return {
    schema: 1,
    app: "antimatter-dimensions-chinese",
    reason,
    savedAt: new Date().toISOString(),
    saveKey: currentSaveKey(),
    currentSlot: window.GameStorage?.currentSlot ?? 0,
    gameVersion: window.player?.version ?? null,
    saves
  };
}

async function githubFetch(path, options = {}) {
  const config = loadConfig();
  if (!config.token) throw new Error("尚未保存 GitHub Token。");

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GitHub 请求失败：${response.status} ${message.slice(0, 200)}`);
  }

  return response.json();
}

export const GitHubBackup = {
  config: loadConfig(),
  isSyncing: false,
  queuedTimer: null,

  get enabled() {
    return Boolean(this.config.enabled);
  },

  get hasToken() {
    return Boolean(this.config.token);
  },

  get fileName() {
    return this.config.fileName || DEFAULT_FILE_NAME;
  },

  getStatus() {
    this.config = loadConfig();
    return {
      enabled: this.enabled,
      hasToken: this.hasToken,
      gistId: this.config.gistId || "",
      gistUrl: this.config.gistUrl || "",
      lastSyncAt: this.config.lastSyncAt || 0,
      lastError: this.config.lastError || "",
      isSyncing: this.isSyncing
    };
  },

  configure({ token, gistId, enabled }) {
    this.config = loadConfig();
    if (token) this.config.token = token.trim();
    if (gistId !== undefined) {
      this.config.gistId = gistId.trim();
      if (!this.config.gistId) delete this.config.gistId;
    }
    this.config.enabled = Boolean(enabled);
    this.config.fileName = DEFAULT_FILE_NAME;
    this.config.lastError = "";
    saveConfig(this.config);
  },

  clear() {
    localStorage.removeItem(CONFIG_KEY);
    this.config = {};
  },

  queueAutoSync(reason = "auto-save") {
    this.config = loadConfig();
    if (!this.enabled || !this.hasToken || this.isSyncing) return;
    if (Date.now() - (this.config.lastSyncAt || 0) < MIN_AUTO_SYNC_INTERVAL) return;
    clearTimeout(this.queuedTimer);
    this.queuedTimer = setTimeout(() => this.syncNow(reason), 1500);
  },

  async syncNow(reason = "manual") {
    this.config = loadConfig();
    if (!this.hasToken) throw new Error("请先保存 GitHub Token。");
    if (this.isSyncing) return;

    this.isSyncing = true;
    const content = JSON.stringify(makePayload(reason), null, 2);
    const body = {
      description: "反物质维度中文版存档备份",
      public: false,
      files: {
        [this.fileName]: { content }
      }
    };

    try {
      const gist = this.config.gistId
        ? await githubFetch(`/gists/${this.config.gistId}`, {
          method: "PATCH",
          body: JSON.stringify(body)
        })
        : await githubFetch("/gists", {
          method: "POST",
          body: JSON.stringify(body)
        });

      this.config.gistId = gist.id;
      this.config.gistUrl = gist.html_url;
      this.config.lastSyncAt = Date.now();
      this.config.lastError = "";
      saveConfig(this.config);
      if (window.GameUI) GameUI.notify.info("GitHub 备份已完成");
    } catch (error) {
      this.config.lastError = error.message;
      saveConfig(this.config);
      if (window.GameUI) GameUI.notify.error("GitHub 备份失败");
      throw error;
    } finally {
      this.isSyncing = false;
    }
  },

  async restoreLatest() {
    this.config = loadConfig();
    if (!this.hasToken) throw new Error("请先保存 GitHub Token。");
    if (!this.config.gistId) throw new Error("尚未关联 GitHub Gist。");

    const gist = await githubFetch(`/gists/${this.config.gistId}`);
    const file = gist.files?.[this.fileName] ?? Object.values(gist.files ?? {})
      .find(item => item.filename === this.fileName);
    if (!file?.content) throw new Error("Gist 中没有找到中文版存档文件。");

    const payload = JSON.parse(file.content);
    if (payload.app !== "antimatter-dimensions-chinese" || payload.schema !== 1) {
      throw new Error("Gist 文件格式不属于反物质维度中文版备份。");
    }

    for (const [key, value] of Object.entries(payload.saves ?? {})) {
      if (typeof value === "string") localStorage.setItem(key, value);
    }
    if (window.GameStorage) {
      GameStorage.load();
      GameUI.update();
      GameUI.notify.info("已从 GitHub 恢复存档");
    }
  }
};
