/* eslint-disable no-console, no-new-func, max-params */

const fs = require("fs");
const http = require("http");
const path = require("path");

const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const REPORT = path.join(ROOT, "docs", "i18n-audit-report.md");
const PORT = Number(process.env.I18N_AUDIT_PORT || 48322);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const STAGES = [
  {
    key: "fresh",
    title: "新存档",
    setup: () => {
      // Keep the real early-game state; this catches first-session UI regressions.
    }
  },
  {
    key: "infinity",
    title: "无限阶段",
    setup: () => {
      const one = new Decimal(1);
      player.records.totalAntimatter = new Decimal("1e1200");
      player.records.thisInfinity.maxAM = new Decimal("1e1200");
      player.records.bestInfinity.bestIPminEternity = new Decimal("1e60");
      player.infinityPoints = new Decimal("1e80");
      player.infinities = one;
      player.break = true;
      player.replicanti.unl = true;
      player.replicanti.amount = new Decimal("1e10");

      for (let tier = 1; tier <= 8; tier++) {
        InfinityDimension(tier).isUnlocked = true;
      }
    }
  },
  {
    key: "eternity",
    title: "永恒阶段",
    setup: () => {
      const one = new Decimal(1);
      player.records.totalAntimatter = new Decimal("1e5000");
      player.records.thisInfinity.maxAM = new Decimal("1e5000");
      player.infinityPoints = new Decimal("1e400");
      player.infinities = new Decimal(100);
      player.eternityPoints = new Decimal("1e80");
      player.eternities = one;
      player.timestudy.theorem = new Decimal(1000);
      player.challenge.eternity.unlocked = 1;
      player.replicanti.unl = true;

      for (let tier = 1; tier <= 8; tier++) {
        InfinityDimension(tier).isUnlocked = true;
        TimeDimension(tier).amount = new Decimal(1);
      }
    }
  },
  {
    key: "reality",
    title: "现实阶段",
    setup: () => {
      player.records.totalAntimatter = new Decimal("1e6000");
      player.records.thisInfinity.maxAM = new Decimal("1e6000");
      player.infinityPoints = new Decimal("1e500");
      player.infinities = new Decimal(1000);
      player.eternityPoints = new Decimal("1e5000");
      player.eternities = new Decimal(100);
      player.dilation.studies.push(1, 6);
      player.dilation.tachyonParticles = new Decimal("1e8");
      player.dilation.dilatedTime = new Decimal("1e8");
      player.realities = 1;
      player.reality.realityMachines = new Decimal("1e6");
      player.reality.maxRM = new Decimal("1e6");
      player.reality.perkPoints = 100;
      player.blackHole[0].unlocked = true;
      player.replicanti.unl = true;
    }
  }
];

const OPTION_MODALS = [
  { key: "notation", title: "指数记数法设置" },
  { key: "hotkeys", title: "快捷键列表" },
  { key: "newsOptions", title: "新闻选项" },
  { key: "infoDisplayOptions", title: "信息显示选项" },
  { key: "confirmationOptions", title: "确认选项" },
  { key: "awayProgressOptions", title: "离线进度选项" },
  { key: "animationOptions", title: "动画选项" },
  { key: "hiddenTabs", title: "修改可见标签页" },
  { key: "backupWindows", title: "自动备份存档" }
];

const TEXT_ALLOWLIST = [
  /^AD$/u,
  /^AM$/u,
  /^AMOLED$/u,
  /^AMOLED 都市$/u,
  /^EP$/u,
  /^IP$/u,
  /^RM$/u,
  /^STD$/u,
  /^TT$/u,
  /^Emoji$/u,
  /^e\d+/iu,
  /^OAuth$/u,
  /^Steam$/u,
  /^Google$/u,
  /^Discord$/u,
  /^GitHub$/u,
  /^PlayFab$/u,
  /^Antimatter Dimensions$/u,
  /^Teresa$/u,
  /^Effarig$/u,
  /^V$/u,
  /^Ra$/u,
  /^Lai'tela$/u,
  /^Pelle$/u,
  /^Chrome$/u,
  /^Firefox$/u,
  /^Safari$/u,
  /^Edge$/u,
  /^SHIFT$/u,
  /^Shift$/u,
  /^ALT$/u,
  /^Alt$/u,
  /^CTRL$/u,
  /^Ctrl$/u,
  /^ON$/u,
  /^OFF$/u,
  /^ENTER$/u,
  /^ESC$/u,
  /^TAB$/u,
  /^Blob$/u,
  /^Blob.+$/u,
  /^AI$/u,
  /^Kms$/u,
  /^eyJ$/u,
  /^In19$/u,
  /^fX0=$/u,
  /^fQ==$/u,
  /^https?:\/\/\S+$/u
];

const ALLOWED_ENGLISH_TOKENS = [
  "AD", "AM", "AMOLED", "EP", "IP", "RM", "STD", "TT", "Emoji", "OAuth", "Steam", "Google", "Discord",
  "GitHub", "PlayFab", "Android", "JavaScript", "DLC",
  "Antimatter Dimensions", "Teresa", "Effarig", "Ra", "Pelle", "Chrome", "Firefox", "Safari", "Edge",
  "SHIFT", "Shift", "ALT", "Alt", "CTRL", "Ctrl", "ENTER", "ESC", "TAB", "ON", "OFF", "Blob", "AI", "Kms",
  "Cookie", "Qa", "Qt", "Sp", "No", "EC", "NC", "ID", "BH", "DT", "TP", "eyJ", "In19", "fX0=", "fQ=="
];

function contentType(filePath) {
  const extension = path.extname(filePath);
  if (extension === ".html") return "text/html";
  if (extension === ".js") return "text/javascript";
  if (extension === ".css") return "text/css";
  if (extension === ".json") return "application/json";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".woff2") return "font/woff2";
  return "application/octet-stream";
}

function createStaticServer() {
  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url, BASE_URL);
    const decodedPath = decodeURIComponent(requestUrl.pathname);
    const cleanPath = decodedPath === "/" ? "/index.html" : decodedPath;
    const filePath = path.normalize(path.join(DIST, cleanPath));

    if (!filePath.startsWith(DIST)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not Found");
        return;
      }

      response.writeHead(200, { "Content-Type": contentType(filePath) });
      response.end(data);
    });
  });
}

function normalizeText(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function shouldKeepCandidate(text) {
  if (text.length < 3) return false;
  if (TEXT_ALLOWLIST.some(pattern => pattern.test(text))) return false;
  if (/^[\d\s.,:+\-*/^%()[\]{}<>=$∞ΩΔΨ×]+$/u.test(text)) return false;
  const stripped = ALLOWED_ENGLISH_TOKENS
    .reduce((value, token) => value.replaceAll(token, ""), text);
  if (!/[A-Za-z]{3,}/u.test(stripped)) return false;
  return true;
}

async function collectVisibleEnglish(page, stage, tab, subtab, rootSelector = "body") {
  const lines = await page.evaluate(selector => {
    const root = document.querySelector(selector);
    if (!root) return [];
    const ignored = [...root.querySelectorAll(".c-news-ticker")]
      .map(node => node.innerText.trim())
      .filter(Boolean);
    return root.innerText
      .split(/\n+/u)
      .filter(line => !ignored.includes(line.trim()));
  }, rootSelector);

  return lines
    .map(normalizeText)
    .filter(shouldKeepCandidate)
    .map(text => ({ stage, tab, subtab, text }));
}

async function collectAchievementTooltipEnglish(page, stage, tab, subtab) {
  const results = [];
  const cells = page.locator(".l-achievement-grid__cell");
  const count = Math.min(await cells.count(), 24);

  for (let index = 0; index < count; index++) {
    await cells.nth(index).hover();
    await page.waitForTimeout(80);
    const tooltipLines = await page.evaluate(() => [...document.querySelectorAll(".o-achievement__tooltip")]
      .map(node => node.innerText)
      .filter(Boolean)
      .flatMap(text => text.split(/\n+/u)));

    results.push(...tooltipLines
      .map(normalizeText)
      .filter(shouldKeepCandidate)
      .map(text => ({ stage, tab, subtab: `${subtab} / 悬浮提示`, text })));
  }

  return results;
}

async function waitForGame(page) {
  await page.waitForFunction(() => window.Tabs && window.GameUI && document.querySelector("#ui"));
  await stabilizeNewsTicker(page);
  await page.waitForTimeout(500);
}

async function stabilizeNewsTicker(page) {
  await page.evaluate(() => {
    const ticker = document.querySelector(".c-news-ticker")?.__vue__;
    if (!ticker || !window.GameDatabase?.news) return;

    const fixedNews = GameDatabase.news.find(item => item.id === "a294");
    if (!fixedNews) return;

    NewsHandler.nextNewsMessageId = "a294";
    ticker.currentNews = fixedNews;
    ticker.prepareNextMessage();
  });
}

async function resetGame(page) {
  await page.evaluate(() => {
    localStorage.clear();
    GameStorage.hardReset();
  });
  await waitForGame(page);
}

async function applyStage(page, stageKey) {
  await page.evaluate(key => {
    const stage = window.__i18nAuditStages.find(item => item.key === key);
    stage.setup();
    GameUI.update();
  }, stageKey);
  await page.waitForTimeout(250);
}

function visibleSubtabs(page) {
  return page.evaluate(() => Tabs.all
    .filter(tab => tab.isAvailable)
    .flatMap(tab => tab.subtabs
      .filter(subtab => subtab.isAvailable)
      .map(subtab => ({
        tabKey: tab.config.key,
        tabName: tab.name,
        subtabKey: subtab.config.key,
        subtabName: subtab.name
      }))));
}

async function showSubtab(page, entry) {
  await page.evaluate(({ tabKey, subtabKey }) => {
    const tab = Tabs.all.find(item => item.config.key === tabKey);
    const subtab = tab.subtabs.find(item => item.config.key === subtabKey);
    subtab.show(true);
    GameUI.update();
  }, entry);
  await stabilizeNewsTicker(page);
  await page.waitForTimeout(350);
}

async function showOptionModal(page, modal) {
  await page.evaluate(key => {
    Modal.hide();
    Modal[key].show();
    GameUI.update();
  }, modal.key);
  await page.waitForTimeout(250);
}

async function showCatchupModal(page) {
  await page.evaluate(() => {
    Modal.hide();
    Modal.catchup.show(0);
    GameUI.update();
  });
  await page.waitForTimeout(250);

  const groupCount = await page.locator(".c-modal.l-modal .o-catchup-group-title").count();
  for (let index = 0; index < groupCount; index++) {
    await page.locator(".c-modal.l-modal .o-catchup-group-title").nth(index).click();
  }
  await page.waitForTimeout(250);
}

async function collectH2PEnglish(page, stageTitle) {
  const results = [];

  await page.evaluate(() => {
    Modal.hide();
    Modal.h2p.show();
    GameUI.update();
  });
  await page.waitForTimeout(250);

  const tabCount = await page.locator(".l-h2p-modal .o-h2p-tab-button").count();
  for (let index = 0; index < tabCount; index++) {
    const tabButton = page.locator(".l-h2p-modal .o-h2p-tab-button").nth(index);
    const tabName = normalizeText(await tabButton.innerText());
    await tabButton.click();
    await page.waitForTimeout(100);

    const visible = await collectVisibleEnglish(page, stageTitle, "游戏玩法", tabName, ".l-h2p-modal");
    results.push(...visible);
  }

  return results;
}

function renderReport(results) {
  const generatedAt = new Date().toISOString();
  const grouped = new Map();

  for (const result of results) {
    const key = `${result.stage} / ${result.tab} / ${result.subtab}`;
    if (!grouped.has(key)) grouped.set(key, new Set());
    grouped.get(key).add(result.text);
  }

  const lines = [
    "# 中文化可见文本审计报告",
    "",
    `生成时间：${generatedAt}`,
    "",
    "本报告由 `npm run audit:i18n` 生成，用真实浏览器遍历主要游戏阶段和可见 Tab/Subtab。",
    "报告还会主动打开一组高频选项弹窗，以覆盖点击后才出现的设置说明。",
    "为避免随机新闻污染审计结果，新闻滚动条由专门 E2E 覆盖，本报告不统计新闻文本。",
    "命中项不是自动判错清单，专有名词、缩写和浏览器品牌可能允许保留英文；其余应进入翻译修复队列。",
    "",
    `候选英文残留总数：${results.length}`,
    ""
  ];

  if (results.length === 0) {
    lines.push("未发现候选英文残留。");
    return `${lines.join("\n")}\n`;
  }

  for (const [group, values] of grouped) {
    lines.push(`## ${group}`);
    lines.push("");

    for (const value of [...values].sort((left, right) => left.localeCompare(right))) {
      lines.push(`- ${value}`);
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    throw new Error("dist/index.html 不存在，请先运行 bash scripts/build-chinese.sh");
  }

  const server = createStaticServer();
  await new Promise(resolve => server.listen(PORT, "127.0.0.1", resolve));

  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage();
  const results = [];

  try {
    await page.goto(BASE_URL);
    await waitForGame(page);
    await page.evaluate(serializedStages => {
      window.__i18nAuditStages = serializedStages.map(stage => ({
        key: stage.key,
        setup: Function(`return (${stage.setup})`)()
      }));
    }, STAGES.map(stage => ({ key: stage.key, setup: stage.setup.toString() })));

    for (const stage of STAGES) {
      await resetGame(page);
      await applyStage(page, stage.key);

      for (const entry of await visibleSubtabs(page)) {
        await showSubtab(page, entry);
        const visible = await collectVisibleEnglish(page, stage.title, entry.tabName, entry.subtabName);
        results.push(...visible);
        if (entry.tabName.includes("成就") || entry.subtabName.includes("成就")) {
          results.push(...await collectAchievementTooltipEnglish(page, stage.title, entry.tabName, entry.subtabName));
        }
      }

      for (const modal of OPTION_MODALS) {
        await showOptionModal(page, modal);
        const visible = await collectVisibleEnglish(page, stage.title, "选项弹窗", modal.title, ".c-modal.l-modal");
        results.push(...visible);
      }

      await showCatchupModal(page);
      const catchupVisible = await collectVisibleEnglish(page, stage.title, "统计弹窗", "内容概要", ".c-modal.l-modal");
      results.push(...catchupVisible);

      results.push(...await collectH2PEnglish(page, stage.title));
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  fs.writeFileSync(REPORT, renderReport(results));
  console.log(`i18n audit report written to ${REPORT}`);
  console.log(`candidate visible English entries: ${results.length}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
