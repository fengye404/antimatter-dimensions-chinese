/* eslint-disable no-console, no-new-func, max-lines, max-statements */

const fs = require("fs");
const http = require("http");
const path = require("path");

const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const REPORT = path.join(ROOT, "docs", "deep-playthrough-audit-report.md");
const SCREENSHOTS = path.join(ROOT, "tests", "screenshots", "deep-playthrough");
const PORT = Number(process.env.DEEP_AUDIT_PORT || 48324);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const MAX_SCREENSHOTS = Number(process.env.DEEP_AUDIT_MAX_SCREENSHOTS || 20);

const VIEWPORTS = [
  { key: "mobile", title: "手机", width: 390, height: 844, isMobile: true, hasTouch: true },
  { key: "desktop", title: "桌面", width: 1440, height: 960, isMobile: false, hasTouch: false },
];

const STAGES = [
  { key: "fresh", title: "新存档" },
  { key: "infinity", title: "无限阶段" },
  { key: "eternity", title: "永恒阶段" },
  { key: "dilation", title: "时间膨胀阶段" },
  { key: "reality", title: "现实阶段" },
  { key: "celestials", title: "天体阶段" },
  { key: "pelle", title: "Pelle 终局阶段" },
];

const STAGE_ORDER = new Map(STAGES.map((stage, index) => [stage.key, index]));

const MODAL_SCENARIOS = [
  { key: "notation", title: "指数记数法设置", minStage: "fresh", open: "Modal.notation.show();" },
  { key: "hotkeys", title: "快捷键列表", minStage: "fresh", open: "Modal.hotkeys.show();" },
  { key: "newsOptions", title: "新闻选项", minStage: "fresh", open: "Modal.newsOptions.show();" },
  { key: "infoDisplayOptions", title: "信息显示选项", minStage: "fresh", open: "Modal.infoDisplayOptions.show();" },
  { key: "confirmationOptions", title: "确认选项", minStage: "fresh", open: "Modal.confirmationOptions.show();" },
  { key: "awayProgressOptions", title: "离线进度选项", minStage: "fresh", open: "Modal.awayProgressOptions.show();" },
  { key: "animationOptions", title: "动画选项", minStage: "fresh", open: "Modal.animationOptions.show();" },
  { key: "hiddenTabs", title: "可见标签页", minStage: "fresh", open: "Modal.hiddenTabs.show();" },
  { key: "backupWindows", title: "自动备份窗口", minStage: "fresh", open: "Modal.backupWindows.show();" },
  {
    key: "catchup",
    title: "离线进度结算",
    minStage: "fresh",
    maxStage: "reality",
    open: `
      const before = JSON.parse(JSON.stringify(player));
      const after = JSON.parse(JSON.stringify(player));
      after.antimatter = new Decimal(before.antimatter || 0).plus(1000);
      Modal.awayProgress.show({ playerBefore: before, playerAfter: after, seconds: 3600 });
    `
  },
  {
    key: "dimensionBoost",
    title: "维度提升确认",
    minStage: "fresh",
    maxStage: "eternity",
    open: "Modal.dimensionBoost.show({ bulk: true });"
  },
  {
    key: "antimatterGalaxy",
    title: "反物质星系确认",
    minStage: "infinity",
    maxStage: "eternity",
    open: "Modal.antimatterGalaxy.show({ bulk: true });"
  },
  { key: "studyString", title: "时间研究导入", minStage: "eternity", open: "Modal.studyString.show({ id: -1 });" },
  { key: "preferredTree", title: "首选时间研究树", minStage: "eternity", open: "Modal.preferredTree.show();" },
  { key: "glyphDisplayOptions", title: "Glyph 显示选项", minStage: "reality", open: "Modal.glyphDisplayOptions.show();" },
  { key: "realityGlyph", title: "现实 Glyph 制作", minStage: "reality", open: "Modal.realityGlyph.show();" },
  { key: "glyphSetSaveDelete", title: "Glyph 套装存档", minStage: "reality", open: "Modal.glyphSetSaveDelete.show({ glyphSetId: 0 });" },
  {
    key: "automatorScriptTemplate",
    title: "自动机模板",
    minStage: "reality",
    open: "Modal.automatorScriptTemplate.show(GameDatabase.reality.automator.templates.scripts[0]);"
  },
  {
    key: "switchAutomatorEditorMode",
    title: "自动机编辑器切换",
    minStage: "reality",
    open: "Modal.switchAutomatorEditorMode.show({ lostBlocks: 2 });"
  },
  { key: "enslavedHints", title: "无名之辈提示", minStage: "celestials", open: "Modal.enslavedHints.show();" },
  { key: "singularityMilestones", title: "奇点里程碑", minStage: "celestials", open: "Modal.singularityMilestones.show();" },
  { key: "pelleEffects", title: "Pelle 效果", minStage: "pelle", open: "Modal.pelleEffects.show();" },
  { key: "armageddon", title: "末日重置确认", minStage: "pelle", open: "Modal.armageddon.show();" },
];

const ALLOWED_ENGLISH_TOKENS = [
  "AD", "AM", "AMOLED", "ASCII", "Blob", "Chrome", "CodeMirror", "Cookie", "CSS", "Discord", "DLC", "DT",
  "EC", "EP", "Effarig", "Firefox", "Galaxy", "GitHub", "Gist", "Google", "HTML", "ID", "IP", "JavaScript",
  "Lai'tela", "OAuth", "Pelle", "PlayFab", "Ra", "Reality", "RM", "Safari", "Steam", "STD", "Teresa", "Token",
  "TT", "UI", "V", "WKWebView", "iOS", "kB", "MB", "Hz", "AM/s", "IP/min", "EP/min", "SHIFT", "CTRL", "ALT",
  "TAB", "ESC", "ENTER", "ON", "OFF", "Shift", "Ctrl", "Alt", "Tab", "Esc", "Enter", "DMD", "Repl", "Eter",
  "Glyph", "Glyphs", "Replicanti", "Eternities", "Infinite", "eyJ",
];

const ALLOWED_ENGLISH_PATTERNS = [
  /\b(?:AD|ID|TD|AM|IP|EP|DT|TP|TT|RM|DMD)\d*\b/u,
  /\b(?:Repl|Eter|Glyphs?|Replicanti|Eternities)\^[\d.]+/u,
  /\b(?:log|ln|sin|cos|tan|sqrt|pow)\d*\s*\(/iu,
  /\blog\d*\b/iu,
  /\bInfinite%/u,
  /\bAMOLED\b/u,
  /\b(?:Shift|Ctrl|Alt|Tab|Esc|Enter|SHIFT|CTRL|ALT|TAB|ESC|ENTER)\b/u,
  /^[\d\s.,:+\-*/^%()[\]{}<>=$∞ΩΔΨ×A-Za-z₀-₉]+$/u,
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
  if (extension === ".webp") return "image/webp";
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

function normalizeText(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function hasSuspiciousEnglish(text) {
  if (normalizeText(text) === "AMOLED 都市") return false;
  if (!/[A-Za-z]{3,}/u.test(text)) return false;
  if (/^https?:\/\//u.test(text)) return false;
  if (/^[\d\s.,:+\-*/^%()[\]{}<>=$∞ΩΔΨ×A-Za-z]+$/u.test(text) && text.length < 12) return false;

  let stripped = ALLOWED_ENGLISH_TOKENS.reduce((value, token) => value.replaceAll(token, ""), text);
  for (const pattern of ALLOWED_ENGLISH_PATTERNS) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    stripped = stripped.replace(new RegExp(pattern.source, flags), "");
  }
  return /[A-Za-z]{3,}/u.test(stripped);
}

function unique(items, keyFn) {
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
  await page.waitForFunction(() => window.Tabs && window.GameUI && window.GameStorage && document.querySelector("#ui"));
  await page.waitForTimeout(600);
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
    const D = value => new Decimal(value);
    const unhideTabsForAudit = () => {
      player.options.hiddenTabBits = 0;
      player.options.hiddenSubtabBits = player.options.hiddenSubtabBits.map(() => 0);
    };
    const unlockAchievements = () => {
      player.achievementBits = player.achievementBits.map(() => 0xffffffff);
      player.secretAchievementBits = player.secretAchievementBits.map(() => 0xffffffff);
    };
    const unlockChallenges = () => {
      player.challenge.normal.completedBits = 0xffffffff;
      player.challenge.infinity.completedBits = 0xffffffff;
      player.challenge.eternity.requirementBits = 0xffffffff;
      for (let id = 1; id <= 12; id++) player.challenge.eternity[`eterc${id}`] = 5;
    };
    const unlockDimensions = () => {
      for (let tier = 1; tier <= 8; tier++) {
        const ad = AntimatterDimension(tier);
        ad.amount = D("1e100");
        ad.bought = 10;
        if (tier <= 8) {
          InfinityDimension(tier).isUnlocked = true;
          InfinityDimension(tier).amount = D("1e50");
          TimeDimension(tier).amount = D("1e30");
        }
      }
    };
    const setInfinity = () => {
      player.records.totalAntimatter = D("1e2000");
      player.records.thisInfinity.maxAM = D("1e2000");
      player.antimatter = D("1e2000");
      player.infinityPoints = D("1e180");
      player.infinities = D(1000);
      player.break = true;
      player.auto.bigCrunch.interval = 100;
      player.replicanti.unl = true;
      player.replicanti.amount = D("1e120");
      unlockDimensions();
      unlockChallenges();
    };
    const setEternity = () => {
      setInfinity();
      player.records.totalAntimatter = D("1e6000");
      player.records.thisInfinity.maxAM = D("1e6000");
      player.infinityPoints = D("1e1400");
      player.eternityPoints = D("1e900");
      player.eternities = D(100000);
      player.timestudy.theorem = D(20000);
      player.challenge.eternity.unlocked = 12;
    };
    const setDilation = () => {
      setEternity();
      player.eternityPoints = D("1e6000");
      player.dilation.studies = [1, 2, 3, 4, 5, 6];
      player.dilation.tachyonParticles = D("1e50");
      player.dilation.dilatedTime = D("1e50");
      player.dilation.totalTachyonParticles = D("1e50");
    };
    const setReality = () => {
      setDilation();
      player.realities = 250;
      player.reality.realityMachines = D("1e120");
      player.reality.maxRM = D("1e120");
      player.reality.imaginaryMachines = 1e9;
      player.reality.iMCap = 1e9;
      player.reality.perkPoints = 5000;
      player.reality.upgradeBits = 0xffffffff;
      player.reality.upgReqs = 0xffffffff;
      player.reality.imaginaryUpgradeBits = 0xffffffff;
      player.reality.imaginaryUpgReqs = 0xffffffff;
      player.reality.perks = new Set(Object.values(GameDatabase.reality.perks).map(perk => perk.id));
      player.blackHole[0].unlocked = true;
      player.blackHole[1].unlocked = true;
    };
    const setCelestials = () => {
      setReality();
      unlockAchievements();
      player.celestials.teresa.pouredAmount = 1e24;
      player.celestials.teresa.unlockBits = 0xffffffff;
      player.celestials.teresa.quoteBits = 0xffffffff;
      player.celestials.effarig.relicShards = 1e30;
      player.celestials.effarig.unlockBits = 0xffffffff;
      player.celestials.effarig.quoteBits = 0xffffffff;
      player.celestials.enslaved.quoteBits = 0xffffffff;
      player.celestials.enslaved.completed = true;
      player.celestials.enslaved.tesseracts = 6;
      player.celestials.v.unlockBits = 0xffffffff;
      player.celestials.v.quoteBits = 0xffffffff;
      player.celestials.v.runUnlocks = player.celestials.v.runUnlocks.map(() => 6);
      player.celestials.ra.unlockBits = 0xffffffff;
      player.celestials.ra.quoteBits = 0xffffffff;
      for (const pet of Object.values(player.celestials.ra.pets)) {
        pet.level = 25;
        pet.memories = 1e9;
        pet.memoryChunks = 1e9;
        pet.memoryUpgrades = 7;
        pet.chunkUpgrades = 5;
      }
      player.celestials.laitela.quoteBits = 0xffffffff;
      player.celestials.laitela.darkMatter = D("1e320");
      player.celestials.laitela.maxDarkMatter = D("1e320");
      player.celestials.laitela.darkEnergy = 1e50;
      player.celestials.laitela.singularities = 1000;
      player.celestials.laitela.dimensions.forEach(dim => {
        dim.amount = D(1);
        dim.intervalUpgrades = 20;
        dim.powerDMUpgrades = 20;
        dim.powerDEUpgrades = 20;
      });
    };

    unhideTabsForAudit();
    if (key === "infinity") setInfinity();
    if (key === "eternity") setEternity();
    if (key === "dilation") setDilation();
    if (key === "reality") setReality();
    if (key === "celestials") setCelestials();
    if (key === "pelle") {
      setCelestials();
      player.celestials.pelle.doomed = true;
      player.celestials.pelle.remnants = 1e9;
      player.celestials.pelle.realityShards = D("1e80");
      player.celestials.pelle.quoteBits = 0xffffffff;
      player.celestials.pelle.upgrades = new Set(Object.values(GameDatabase.celestials.pelle.upgrades)
        .map(upgrade => upgrade.id));
      player.celestials.pelle.galaxyGenerator.unlocked = true;
    }
    GameUI.update();
  }, stageKey);
  await page.waitForTimeout(350);
}

async function allSubtabs(page) {
  return page.evaluate(() => Tabs.all
    .filter(tab => tab.isAvailable)
    .flatMap(tab => tab.subtabs
      .filter(subtab => subtab.isAvailable)
      .map(subtab => ({
    tabKey: tab.config.key,
    tabName: tab.name,
    subtabKey: subtab.config.key,
    subtabName: subtab.name,
  }))));
}

async function showSubtab(page, entry) {
  await page.evaluate(({ tabKey, subtabKey }) => {
    Modal.hide();
    const tab = Tabs.all.find(item => item.config.key === tabKey);
    const subtab = tab?.subtabs.find(item => item.config.key === subtabKey);
    if (!subtab) throw new Error(`Missing subtab ${tabKey}/${subtabKey}`);
    subtab.show(true);
    GameUI.update();
    window.scrollTo(0, 0);
  }, entry);
  await page.waitForTimeout(450);
}

async function collectSurfaceIssues(page, context) {
  const layoutIssues = [];
  const collectLayout = async(position) => page.evaluate(pos => {
    if (pos === "bottom") window.scrollTo(0, document.scrollingElement.scrollHeight);
    if (pos === "top") window.scrollTo(0, 0);

    const viewportWidth = window.innerWidth;
    const scroller = document.scrollingElement;
    const nav = document.querySelector(".c-modern-sidebar")?.getBoundingClientRect();
    const isMobileNav = nav && nav.top > window.innerHeight * 0.45;
    const isVisible = element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 &&
        rect.bottom > 0 && rect.top < window.innerHeight &&
        style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
    };
    const candidates = [...document.querySelectorAll(
      "button, input, select, textarea, .o-primary-btn, .l-achievement-grid__cell, .c-challenge-box, " +
      ".c-shop-button-container, .l-time-study, .c-modal, .c-glyph-component"
    )].filter(isVisible);
    const overflow = candidates
      .map(element => {
        const rect = element.getBoundingClientRect();
        return {
          selector: [
            element.tagName.toLowerCase(),
            element.id ? `#${element.id}` : "",
            [...element.classList].slice(0, 3).map(name => `.${name}`).join("")
          ].join(""),
          text: (element.innerText || element.value || element.getAttribute("aria-label") || "").replace(/\s+/gu, " ").trim(),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
        };
      })
      .filter(item => item.left > -10000)
      .filter(item => item.left < -2 || item.right > viewportWidth + 2);
    const navOverlap = isMobileNav && pos === "bottom"
      ? candidates
        .filter(element => !element.closest(".c-modern-sidebar"))
        .map(element => {
          const rect = element.getBoundingClientRect();
          return {
            selector: [
              element.tagName.toLowerCase(),
              element.id ? `#${element.id}` : "",
              [...element.classList].slice(0, 3).map(name => `.${name}`).join("")
            ].join(""),
            text: (element.innerText || element.value || element.getAttribute("aria-label") || "").replace(/\s+/gu, " ").trim(),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
          };
        })
        .filter(item => item.bottom > nav.top + 4 && item.top < nav.bottom - 4)
      : [];
    return {
      scrollWidth: scroller.scrollWidth,
      clientWidth: scroller.clientWidth,
      overflow,
      navOverlap,
    };
  }, position);

  const topLayout = await collectLayout("top");
  const bottomLayout = await collectLayout("bottom");
  for (const [position, metrics] of [["顶部", topLayout], ["底部", bottomLayout]]) {
    if (metrics.scrollWidth > metrics.clientWidth + 2) {
      layoutIssues.push({ ...context, type: "文档横向溢出", position, text: `${metrics.scrollWidth}px > ${metrics.clientWidth}px` });
    }
    for (const item of metrics.overflow.slice(0, 8)) {
      layoutIssues.push({ ...context, type: "可交互元素越界", position, text: `${item.selector} ${item.left}-${item.right} ${item.text}` });
    }
    for (const item of metrics.navOverlap.slice(0, 8)) {
      layoutIssues.push({ ...context, type: "底部导航遮挡", position, text: `${item.selector} ${item.top}-${item.bottom} ${item.text}` });
    }
  }

  const englishIssues = await page.evaluate(tokens => {
    const allowedPatterns = [
      /\b(?:AD|ID|TD|AM|IP|EP|DT|TP|TT|RM|DMD)\d*\b/u,
      /\b(?:Repl|Eter|Glyphs?|Replicanti|Eternities)\^[\d.]+/u,
      /\b(?:log|ln|sin|cos|tan|sqrt|pow)\d*\s*\(/iu,
      /\blog\d*\b/iu,
      /\bInfinite%/u,
      /\bAMOLED\b/u,
      /\b(?:Shift|Ctrl|Alt|Tab|Esc|Enter|SHIFT|CTRL|ALT|TAB|ESC|ENTER)\b/u,
      /^[\d\s.,:+\-*/^%()[\]{}<>=$∞ΩΔΨ×A-Za-z₀-₉]+$/u,
    ];
    const ignoredSelectors = [
      ".c-news-ticker", ".CodeMirror", ".CodeMirror *", "code", "pre", ".fa", ".fas", ".far", ".fab",
      ".c-glyph-component", ".c-glyph-component *", ".o-celestial-nav__symbol"
    ];
    const ignored = element => ignoredSelectors.some(selector => element.matches(selector) || element.closest(selector));
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 &&
        rect.bottom > 0 && rect.top < window.innerHeight &&
        style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
    };
    const directText = element => [...element.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join(" ");
    const hasEnglish = text => {
      if (!/[A-Za-z]{3,}/u.test(text)) return false;
      let stripped = tokens.reduce((value, token) => value.replaceAll(token, ""), text);
      for (const pattern of allowedPatterns) {
        const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
        stripped = stripped.replace(new RegExp(pattern.source, flags), "");
      }
      return /[A-Za-z]{3,}/u.test(stripped);
    };
    return [...document.querySelectorAll("body *")]
      .filter(visible)
      .filter(element => !ignored(element))
      .map(element => (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)
        ? element.placeholder || element.value || directText(element)
        : directText(element))
      .map(text => text.replace(/\s+/gu, " ").trim())
      .filter(text => text.length >= 3 && hasEnglish(text))
      .slice(0, 30);
  }, ALLOWED_ENGLISH_TOKENS);

  return [
    ...layoutIssues,
    ...englishIssues
      .map(text => ({ ...context, type: "候选英文残留", position: "可见区域", text }))
      .filter(issue => hasSuspiciousEnglish(issue.text)),
  ];
}

async function collectNewsIssues(page, context) {
  const newsItems = await page.evaluate(() => {
    const stripTags = value => String(value).replace(/<[^>]*>/gu, " ").replace(/\s+/gu, " ").trim();
    const sampleSources = [
      "If you see a news message, and then see it again later, does it become an olds message?",
      "There are no typos in any of these news messages. If you see a typo, the tpyo must be in your brain.",
      "A new study has shown that 100% of people who use antimatter dimensions are alive.",
      "This intentionally untranslated diagnostic sentence should be converted by the generic news fallback.",
    ];
    const localizedSamples = sampleSources.map((source, index) => ({
      id: `sample:${index}`,
      text: stripTags(window.__AD_LOCALIZE_NEWS_TEXT__ ? window.__AD_LOCALIZE_NEWS_TEXT__(source) : source),
    }));
    return [
      {
        id: "visible",
        text: stripTags(document.querySelector(".c-news-ticker")?.innerText ?? ""),
      },
      ...localizedSamples,
    ].filter(item => item.text);
  });

  return newsItems
    .filter(item => hasSuspiciousEnglish(item.text))
    .map(item => ({
      ...context,
      type: "新闻英文残留",
      position: `news:${item.id}`,
      text: item.text,
    }));
}

async function collectH2PIssues(page, context) {
  const issues = [];
  await page.evaluate(() => {
    Modal.h2p.show();
    GameUI.update();
  });
  await page.waitForSelector(".l-h2p-modal", { timeout: 5000 });
  const tabCount = await page.locator(".o-h2p-tab-button").count();

  for (let index = 0; index < tabCount; index++) {
    await page.locator(".o-h2p-tab-button").nth(index).click();
    await page.waitForTimeout(60);
    const text = await page.locator(".l-h2p-info").evaluate(element => element.innerText.replace(/\s+/gu, " ").trim());
    const title = await page.locator(".o-h2p-tab-button").nth(index).innerText();
    if (hasSuspiciousEnglish(text)) {
      issues.push({
        ...context,
        type: "玩法说明英文残留",
        position: normalizeText(title),
        text,
      });
    }
  }

  await page.evaluate(() => Modal.hide());
  await page.waitForTimeout(100);
  return issues;
}

async function collectModalIssues(page, context) {
  const currentStageIndex = STAGE_ORDER.get(context.stageKey) ?? 0;
  const scenarios = MODAL_SCENARIOS.filter(scenario =>
    currentStageIndex >= (STAGE_ORDER.get(scenario.minStage) ?? 0) &&
    currentStageIndex <= (STAGE_ORDER.get(scenario.maxStage) ?? Number.POSITIVE_INFINITY));
  const issues = [];

  for (const scenario of scenarios) {
    console.log(`[audit]   modal: ${scenario.title}`);
    const modalContext = {
      ...context,
      surface: `交互弹窗 / ${scenario.title}`,
    };

    try {
      await page.evaluate(openSource => {
        if (Modal.hideAll) Modal.hideAll();
        else Modal.hide();
        new Function(openSource)();
        GameUI.update();
        window.scrollTo(0, 0);
      }, scenario.open);
      await page.waitForTimeout(250);

      const isOpen = await page.evaluate(() =>
        Boolean(document.querySelector(".c-modal, .l-h2p-modal, .c-modal-message, .c-modal-away-progress")));
      if (!isOpen) {
        issues.push({
          ...modalContext,
          type: "弹窗未打开",
          position: scenario.key,
          text: "脚本执行后未检测到可见弹窗",
        });
        continue;
      }

      issues.push(...await collectSurfaceIssues(page, modalContext));
    } catch (error) {
      issues.push({
        ...modalContext,
        type: "弹窗打开失败",
        position: scenario.key,
        text: error.message,
      });
    } finally {
      await page.evaluate(() => {
        if (Modal.hideAll) Modal.hideAll();
        else Modal.hide();
      });
      await page.waitForTimeout(80);
    }
  }

  return issues;
}

function renderReport(results, errors) {
  const lines = [
    "# 深度体验审查报告",
    "",
    `生成时间：${new Date().toISOString()}`,
    "",
    "本报告用真实浏览器按游戏阶段构造存档状态，遍历各 Tab/Subtab、高频弹窗和后期机制弹窗，覆盖手机和桌面视口。",
    "审查目标是以玩家视角发现 UI 不可用、底部导航遮挡、横向溢出、候选英文残留和页面运行错误。",
    "",
    `候选问题总数：${results.length}`,
    `页面错误总数：${errors.length}`,
    "",
  ];

  if (errors.length > 0) {
    lines.push("## 页面错误", "");
    for (const error of errors.slice(0, 40)) {
      lines.push(`- ${error.viewport} / ${error.stage} / ${error.surface}: ${error.message}`);
    }
    if (errors.length > 40) lines.push(`- 另有 ${errors.length - 40} 个错误。`);
    lines.push("");
  }

  if (results.length === 0) {
    lines.push("未发现候选问题。");
    return `${lines.join("\n")}\n`;
  }

  const grouped = new Map();
  for (const result of results) {
    const key = `${result.viewport} / ${result.stage} / ${result.surface} / ${result.type}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(result);
  }

  for (const [group, values] of grouped) {
    lines.push(`## ${group}`, "");
    for (const value of unique(values, item => `${item.position}|${item.text}`).slice(0, 20)) {
      lines.push(`- ${value.position}: ${value.text}`);
    }
    if (values.length > 20) lines.push(`- 另有 ${values.length - 20} 项同类问题。`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    throw new Error("dist/index.html 不存在，请先运行 npm run build:chinese");
  }

  fs.mkdirSync(SCREENSHOTS, { recursive: true });
  const server = createStaticServer();
  await new Promise(resolve => server.listen(PORT, "127.0.0.1", resolve));

  const browser = await chromium.launch({ channel: "chrome" });
  const issues = [];
  const errors = [];
  let screenshotCount = 0;

  try {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile,
        hasTouch: viewport.hasTouch,
        deviceScaleFactor: viewport.isMobile ? 3 : 1,
      });
      page.on("pageerror", error => {
        errors.push({
          viewport: viewport.title,
          stage: "运行时",
          surface: "全局",
          message: error.message,
        });
      });

      try {
        await page.goto(BASE_URL);
        await waitForGame(page);

        for (const stage of STAGES) {
          console.log(`[audit] ${viewport.title} / ${stage.title}`);
          await resetGame(page);
          await applyStage(page, stage.key);
          const globalChecks = [];
          if (stage.key === "fresh") {
            globalChecks.push({
              fn: collectNewsIssues,
              context: {
                viewport: viewport.title,
                stage: stage.title,
                surface: "新闻滚动条全集",
              },
            });
          }
          if (viewport.key === "desktop" && stage.key === "pelle") {
            globalChecks.push({
              fn: collectH2PIssues,
              context: {
                viewport: viewport.title,
                stage: stage.title,
                surface: "玩法说明弹窗全集",
              },
            });
          }
          for (const check of globalChecks) {
            try {
              issues.push(...await check.fn(page, check.context));
            } catch (error) {
              errors.push({
                viewport: viewport.title,
                stage: stage.title,
                surface: check.context.surface,
                message: error.message,
              });
            }
          }

          try {
            issues.push(...await collectModalIssues(page, {
              viewport: viewport.title,
              stage: stage.title,
              stageKey: stage.key,
              surface: "交互弹窗全集",
            }));
          } catch (error) {
            errors.push({
              viewport: viewport.title,
              stage: stage.title,
              surface: "交互弹窗全集",
              message: error.message,
            });
          }

          const entries = await allSubtabs(page);

          for (const entry of entries) {
            console.log(`[audit]   subtab: ${entry.tabName} / ${entry.subtabName}`);
            const context = {
              viewport: viewport.title,
              stage: stage.title,
              surface: `${entry.tabName} / ${entry.subtabName}`,
            };
            try {
              await showSubtab(page, entry);
              const found = await collectSurfaceIssues(page, context);
              issues.push(...found);
              if (found.length > 0 && viewport.key === "mobile" && screenshotCount < MAX_SCREENSHOTS) {
                const name = `${stage.key}--${entry.tabKey}--${entry.subtabKey}`.replace(/[^a-z0-9-]/giu, "-");
                await page.screenshot({ path: path.join(SCREENSHOTS, `${name}.png`), fullPage: true });
                screenshotCount++;
              }
            } catch (error) {
              errors.push({
                viewport: viewport.title,
                stage: stage.title,
                surface: `${entry.tabName} / ${entry.subtabName}`,
                message: error.message,
              });
            }
          }
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  const uniqueIssues = unique(issues, item =>
    `${item.viewport}|${item.stage}|${item.surface}|${item.type}|${item.position}|${normalizeText(item.text)}`);
  fs.writeFileSync(REPORT, renderReport(uniqueIssues, errors));
  console.log(`deep playthrough audit report written to ${REPORT}`);
  console.log(`candidate issues: ${uniqueIssues.length}`);
  console.log(`page errors: ${errors.length}`);
  if (uniqueIssues.length > 0 || errors.length > 0) process.exitCode = 1;
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
