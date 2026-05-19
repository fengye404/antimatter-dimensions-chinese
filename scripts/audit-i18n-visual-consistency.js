/* eslint-disable max-params, no-console, no-new-func */

const fs = require("fs");
const http = require("http");
const path = require("path");

const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const REPORT = path.join(ROOT, "docs", "i18n-visual-audit-report.md");
const PORT = Number(process.env.I18N_VISUAL_AUDIT_PORT || 48323);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const STAGES = [
  {
    key: "fresh",
    title: "新存档",
    setup: null
  },
  {
    key: "infinity",
    title: "无限阶段",
    setup: () => {
      player.records.totalAntimatter = new Decimal("1e1200");
      player.records.thisInfinity.maxAM = new Decimal("1e1200");
      player.infinityPoints = new Decimal("1e80");
      player.infinities = new Decimal(1);
      player.break = true;
      player.replicanti.unl = true;
      player.replicanti.amount = new Decimal("1e10");
      for (let tier = 1; tier <= 8; tier++) InfinityDimension(tier).isUnlocked = true;
    }
  },
  {
    key: "reality",
    title: "现实阶段",
    setup: () => {
      player.records.totalAntimatter = new Decimal("1e6000");
      player.records.thisInfinity.maxAM = new Decimal("1e6000");
      player.infinityPoints = new Decimal("1e500");
      player.eternityPoints = new Decimal("1e5000");
      player.eternities = new Decimal(100);
      player.realities = 1;
      player.reality.realityMachines = new Decimal("1e6");
      player.reality.maxRM = new Decimal("1e6");
      player.replicanti.unl = true;
      player.dilation.studies.push(1, 6);
    }
  }
];

const OPTION_MODALS = [
  { key: "notation", title: "指数记数法设置" },
  { key: "hotkeys", title: "快捷键列表" },
  { key: "confirmationOptions", title: "确认选项" },
  { key: "awayProgressOptions", title: "离线进度选项" },
  { key: "backupWindows", title: "自动备份存档" }
];

const INTENTIONAL_NON_UI_SELECTORS = [
  ".CodeMirror",
  ".CodeMirror *",
  "code",
  "pre",
  ".fa",
  ".fas",
  ".far",
  ".fab",
  ".o-celestial-nav__symbol",
  ".c-glyph-component",
  ".c-glyph-component *",
  ".c-automator-block-row",
  ".c-automator-block-row *",
  ".c-automator-docs-page__indented",
  ".c-automator-docs-page__indented *"
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
  if (extension === ".ttf") return "font/ttf";
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

function uniqueItems(items, keyFn) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

async function waitForGame(page) {
  await page.waitForFunction(() => window.Tabs && window.GameUI && document.querySelector("#ui"));
  await page.waitForTimeout(500);
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
    const stage = window.__i18nVisualAuditStages.find(item => item.key === key);
    if (stage.setup) stage.setup();
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
    Modal.hide();
    const tab = Tabs.all.find(item => item.config.key === tabKey);
    const subtab = tab.subtabs.find(item => item.config.key === subtabKey);
    subtab.show(true);
    GameUI.update();
  }, entry);
  await page.waitForTimeout(300);
}

async function showOptionModal(page, modal) {
  await page.evaluate(key => {
    Modal.hide();
    Modal[key].show();
    GameUI.update();
  }, modal.key);
  await page.waitForTimeout(250);
}

async function showH2PModal(page) {
  await page.evaluate(() => {
    Modal.hide();
    Modal.h2p.show();
    GameUI.update();
  });
  await page.waitForTimeout(250);
}

async function collectVisualIssues(page, stage, surface, rootSelector = "body") {
  const issues = await page.evaluate(({ selector, ignoredSelectors }) => {
    const root = document.querySelector(selector);
    if (!root) return [];

    const hasCJK = text => /[\u3400-\u9fff]/u.test(text);
    const hasLetters = text => /[A-Za-z]{3,}/u.test(text);
    const isVisible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        rect.width > 0 &&
        rect.height > 0;
    };
    const isIgnored = element => ignoredSelectors.some(item => element.matches(item) || element.closest(item));
    const directText = element => [...element.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join(" ");

    return [...root.querySelectorAll("*")]
      .filter(isVisible)
      .filter(element => !isIgnored(element))
      .flatMap(element => {
        const text = (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)
          ? element.placeholder || element.value || directText(element)
          : directText(element);
        const normalized = text.replace(/\s+/gu, " ").trim();
        if (!normalized || !hasCJK(normalized)) return [];

        const style = getComputedStyle(element);
        const fontSize = Number.parseFloat(style.fontSize);
        const lineHeight = style.lineHeight === "normal"
          ? fontSize * 1.2
          : Number.parseFloat(style.lineHeight);
        const rect = element.getBoundingClientRect();
        const elementPath = [
          element.tagName.toLowerCase(),
          element.id ? `#${element.id}` : "",
          [...element.classList].slice(0, 3).map(name => `.${name}`).join("")
        ].join("");
        const found = [];

        if (/Typewriter/u.test(style.fontFamily)) {
          found.push({
            type: "中文文本使用 Typewriter",
            text: normalized,
            element: elementPath,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            width: Math.round(rect.width)
          });
        }

        if (hasLetters(normalized) && /Typewriter/u.test(style.fontFamily)) {
          found.push({
            type: "中英混排仍使用 Typewriter",
            text: normalized,
            element: elementPath,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            width: Math.round(rect.width)
          });
        }

        if (normalized.length >= 12 && lineHeight / fontSize < 1.25) {
          found.push({
            type: "中文长文本行高过紧",
            text: normalized,
            element: elementPath,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            width: Math.round(rect.width)
          });
        }

        if (fontSize < 11 && normalized.length >= 4) {
          found.push({
            type: "中文字号过小",
            text: normalized,
            element: elementPath,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            width: Math.round(rect.width)
          });
        }

        return found;
      });
  }, {
    selector: rootSelector,
    ignoredSelectors: INTENTIONAL_NON_UI_SELECTORS
  });

  return issues.map(issue => ({ stage, surface, ...issue }));
}

function renderReport(results) {
  const generatedAt = new Date().toISOString();
  const lines = [
    "# 中文化视觉一致性审计报告",
    "",
    `生成时间：${generatedAt}`,
    "",
    "本报告由 `npm run audit:i18n:visual` 生成，用真实浏览器遍历主要游戏阶段、可见 Tab/Subtab 和高频弹窗。",
    "审计重点是中文 UI 是否仍落回原版 Typewriter 字体、中文长文本行高是否过紧、中文字号是否异常，以及中英混排是否使用不一致字体。",
    "代码编辑器、自动机代码块、图标字体、符文图标等非普通 UI 文本会被排除。",
    "",
    `视觉一致性候选问题总数：${results.length}`,
    ""
  ];

  if (results.length === 0) {
    lines.push("未发现候选视觉一致性问题。");
    return `${lines.join("\n")}\n`;
  }

  const grouped = new Map();
  for (const result of results) {
    const key = `${result.stage} / ${result.surface} / ${result.type}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(result);
  }

  for (const [group, values] of grouped) {
    lines.push(`## ${group}`);
    lines.push("");
    const uniqueValues = uniqueItems(values, item => `${item.element}|${item.text}|${item.fontFamily}`);
    for (const value of uniqueValues.slice(0, 20)) {
      lines.push(`- \`${value.element}\` ${value.fontSize}/${value.lineHeight} ${value.fontFamily}`);
      lines.push(`  文本：${value.text}`);
    }
    if (uniqueValues.length > 20) lines.push(`- 另有 ${uniqueValues.length - 20} 项同类问题。`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    throw new Error("dist/index.html 不存在，请先运行 npm run build:chinese");
  }

  const server = createStaticServer();
  await new Promise(resolve => server.listen(PORT, "127.0.0.1", resolve));

  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const results = [];

  try {
    await page.goto(BASE_URL);
    await waitForGame(page);
    await page.evaluate(serializedStages => {
      window.__i18nVisualAuditStages = serializedStages.map(stage => ({
        key: stage.key,
        setup: stage.setup ? Function(`return (${stage.setup})`)() : null
      }));
    }, STAGES.map(stage => ({ key: stage.key, setup: stage.setup?.toString() ?? null })));

    for (const stage of STAGES) {
      await resetGame(page);
      await applyStage(page, stage.key);

      for (const entry of await visibleSubtabs(page)) {
        await showSubtab(page, entry);
        results.push(...await collectVisualIssues(page, stage.title, `${entry.tabName} / ${entry.subtabName}`));
      }

      for (const modal of OPTION_MODALS) {
        await showOptionModal(page, modal);
        results.push(...await collectVisualIssues(page, stage.title, `选项弹窗 / ${modal.title}`, ".c-modal.l-modal"));
      }

      await showH2PModal(page);
      results.push(...await collectVisualIssues(page, stage.title, "游戏玩法弹窗", ".l-h2p-modal"));
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  const uniqueResults = uniqueItems(results, item =>
    `${item.stage}|${item.surface}|${item.type}|${item.element}|${item.text}|${item.fontFamily}`);
  fs.writeFileSync(REPORT, renderReport(uniqueResults));
  console.log(`i18n visual audit report written to ${REPORT}`);
  console.log(`candidate visual consistency issues: ${uniqueResults.length}`);
  if (uniqueResults.length > 0) process.exitCode = 1;
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
