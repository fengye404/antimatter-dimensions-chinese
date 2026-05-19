const { test, expect } = require("@playwright/test");

function visibleText(page) {
  return page.locator("body").innerText({ timeout: 10000 });
}

async function openModal(page, modalName) {
  await page.evaluate(name => {
    Modal.hide();
    Modal[name].show();
  }, modalName);
}

test.describe("Chinese localization regression", () => {
  test("renders the early game UI in Chinese", async({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/反物质维度/u);
    await expect(page.locator("body")).toContainText("你有");
    await expect(page.locator("body")).toContainText("反物质");
    await expect(page.locator("body")).toContainText("维度");
    await expect(page.locator("body")).toContainText("选项");
    await expect(page.locator("body")).toContainText("补至 10 个");
    await expect(page.locator("body")).toContainText("购买 10 个维度的倍率");
    await expect(page.locator("body")).toContainText("时间间隔花费");
    await expect(page.locator("body")).not.toContainText("Buy 10 Dimension purchase multiplier");
    await expect(page.locator("body")).not.toContainText("Until 10");
    await expect(page.locator("body")).not.toContainText("Tickspeed Cost");
  });

  test("renders core option panels with source-level Chinese labels", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.Tab);

    await page.evaluate(() => Tab.options.visual.show(true));
    await expect(page.locator("body")).toContainText("主题：");
    await expect(page.locator("body")).toContainText("记数法：");
    await expect(page.locator("body")).toContainText("更新间隔：");
    await expect(page.locator("body")).not.toContainText("Notation:");

    await page.evaluate(() => Tab.options.gameplay.show(true));
    await expect(page.locator("body")).toContainText("快捷键：");
    await expect(page.locator("body")).toContainText("离线模拟游戏刻数量");
    await expect(page.locator("body")).not.toContainText("Hotkeys:");
  });

  test("keeps the localized shop tab visible and enables free local purchases", async({ page }) => {
    await page.goto("/");
    await expect(page.getByText("商店", { exact: true }).first()).toBeVisible();
    await page.getByText("商店", { exact: true }).first().click();

    const text = await visibleText(page);
    expect(text).toContain("中文版说明");
    expect(text).toContain("可直接免费购买");
    expect(text).toContain("免费购买不会消耗 STD");
    expect(text).toContain("免费购买（原价：30 STD）");
    expect(text).not.toContain("中文版已禁用购买");
    expect(text).not.toContain("Buy More");
    expect(text).not.toContain("Login with Google");
    expect(text).not.toContain("In-app Purchases");

    await page.getByRole("button", { name: /免费购买（原价：30 STD）/u }).first().click();
    await expect(page.locator("body")).toContainText("当前 ×2，下一级 ×4");
  });

  test("uses a consistent Chinese UI font stack for localized text", async({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");

    const fontReport = await page.evaluate(() => {
      const selectors = ["body", "#page", ".o-tab-btn", ".o-primary-btn"];
      return selectors.map(selector => {
        const element = document.querySelector(selector);
        return {
          selector,
          fontFamily: element ? getComputedStyle(element).fontFamily : null,
        };
      });
    });

    for (const entry of fontReport) {
      expect(
        entry.fontFamily,
        `${entry.selector} should not render CJK UI with Typewriter`
      ).not.toMatch(/Typewriter/u);
      expect(
        entry.fontFamily,
        `${entry.selector} should use the Chinese UI font stack`
      ).toMatch(/PingFang|Microsoft YaHei|Noto Sans CJK|Source Han Sans|Segoe UI|-apple-system/u);
    }
  });

  test("does not request decorative loading or animated background media on initial load", async({ page }) => {
    const requestedPaths = [];
    page.on("request", request => requestedPaths.push(new URL(request.url()).pathname));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(requestedPaths).not.toContain("/images/loading.webp");
    expect(requestedPaths).not.toContain("/images/loading.png");
    expect(requestedPaths).not.toContain("/images/stars-bg.png");
    expect(requestedPaths).not.toContain("/images/stars-bg.webm");
    expect(requestedPaths).not.toContain("/images/realityanimbg.webm");
  });

  test("serves commit-versioned JS and CSS assets", async({ page }) => {
    await page.goto("/");

    const assets = await page.evaluate(() => [
      ...Array.from(document.querySelectorAll("script[src]"), script => script.src),
      ...Array.from(document.querySelectorAll("link[rel='stylesheet'][href]"), link => link.href),
    ]);

    expect(assets.some(url => /\/js\/app\.js\?v=[a-f0-9]+/u.test(url))).toBe(true);
    expect(assets.some(url => /\/js\/chunk-vendors\.js\?v=[a-f0-9]+/u.test(url))).toBe(true);
    expect(assets.some(url => /\/stylesheets\/styles\.css\?v=[a-f0-9]+/u.test(url))).toBe(true);
  });

  test("localizes the How to Play modal body instead of leaving large English paragraphs", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.GameDatabase && window.Modal && window.ui);
    await page.evaluate(() => {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.find(tab => tab.name === "Customization");
      Modal.h2p.show();
    });
    await page.locator(".o-h2p-tab-button", { hasText: "定制" }).click();

    await expect(page.locator(".c-h2p-title")).toContainText("游戏玩法");
    await expect(page.locator(".c-h2p-search-bar")).toHaveAttribute("placeholder", "搜索玩法条目...");
    await expect(page.locator(".c-h2p-body--title")).toContainText("定制");
    await expect(page.locator("#h2p-body")).toContainText("游戏提供两套界面布局");
    await expect(page.locator("#h2p-body")).toContainText("混合科学记数法");
    await expect(page.locator("#h2p-body")).not.toContainText("The game has two different UI layouts");
    await expect(page.locator("#h2p-body")).not.toContainText("The notation used to display numbers");
  });

  test("localizes early How to Play mechanic entries without mixed English paragraphs", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.Modal);
    await page.evaluate(() => Modal.h2p.show());

    await page.locator(".o-h2p-tab-button", { hasText: "效果叠加" }).click();
    await expect(page.locator("#h2p-body")).toContainText("多个叠加效果会彼此相加");
    await expect(page.locator("#h2p-body")).toContainText("按“叠加、相乘、幂次”的顺序");
    await expect(page.locator("#h2p-body")).not.toContainText("These effects are typically denoted");
    await expect(page.locator("#h2p-body")).not.toContainText("replacing an older value");

    await page.locator(".o-h2p-tab-button", { hasText: "反物质维度" }).click();
    await expect(page.locator("#h2p-body")).toContainText("第一反物质维度产出反物质");
    await expect(page.locator("#h2p-body")).toContainText("快捷键：1 到 8");
    await expect(page.locator("#h2p-body")).not.toContainText("Beside the Dimension there is a multiplier");
    await expect(page.locator("#h2p-body")).not.toContainText("Hotkeys:");

    await page.locator(".o-h2p-tab-button", { hasText: "自动购买器" }).click();
    await expect(page.locator("#h2p-body")).toContainText("自动购买器会在你负担得起时自动购买");
    await expect(page.locator("#h2p-body")).toContainText("可以把它理解为总开关");
    await expect(page.locator("#h2p-body")).not.toContainText("The cooldown period before the autobuyer");
    await expect(page.locator("#h2p-body")).not.toContainText("Dynamic Amount");
  });

  test("localizes the content summary modal", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.Modal);
    await page.evaluate(() => Modal.catchup.show(0));
    await page.locator(".o-catchup-group-title", { hasText: "反物质产出" }).click();

    await expect(page.locator(".c-modal")).toContainText("内容概要");
    await expect(page.locator(".c-modal")).toContainText("在“游戏玩法”中查看更详细的信息");
    await expect(page.locator(".c-modal")).toContainText("每个反物质维度都会持续产出下一层级的维度");
    await expect(page.locator(".c-modal")).toContainText("时间间隔升级会让反物质维度");
    await expect(page.locator(".c-modal")).toContainText("接下来优先提高反物质");
    await expect(page.locator(".c-modal")).not.toContainText("icons to view more detailed information");
    await expect(page.locator(".c-modal")).not.toContainText("Every Antimatter Dimension continuously produces");
    await expect(page.locator(".c-modal")).not.toContainText("Tickspeed Upgrades make Antimatter Dimensions");
    await expect(page.locator(".c-modal")).not.toContainText("Based on your current progression");
  });

  test("localizes high-frequency options modals", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.Modal);

    await openModal(page, "notation");
    await expect(page.locator("body")).toContainText("指数记数法设置");
    await expect(page.locator("body")).toContainText("指数加逗号的最小位数");
    await expect(page.locator("body")).toContainText("指数格式化示例");
    await expect(page.locator("body")).not.toContainText("Exponent Notation Settings");
    await expect(page.locator("body")).not.toContainText("Minimum for commas in exponent");

    await openModal(page, "hotkeys");
    await expect(page.locator("body")).toContainText("快捷键列表");
    await expect(page.locator("body")).toContainText("购买 1 个维度");
    await expect(page.locator("body")).toContainText("自动购买器控制");
    await expect(page.locator("body")).not.toContainText("Hotkey List");
    await expect(page.locator("body")).not.toContainText("Buy 1 Dimension");

    await openModal(page, "newsOptions");
    await expect(page.locator("body")).toContainText("新闻选项");
    await expect(page.locator("body")).toContainText("重复缓冲区");
    await expect(page.locator("body")).not.toContainText("News Options");
    await expect(page.locator("body")).not.toContainText("message repeat buffer");

    await openModal(page, "infoDisplayOptions");
    await expect(page.locator("body")).toContainText("信息显示选项");
    await expect(page.locator("body")).toContainText("显示百分比收益");
    await expect(page.locator("body")).not.toContainText("Info Display Options");

    await openModal(page, "confirmationOptions");
    await expect(page.locator("body")).toContainText("确认选项");
    await expect(page.locator("body")).not.toContainText("Confirmation Options");

    await openModal(page, "awayProgressOptions");
    await expect(page.locator("body")).toContainText("离线进度选项");
    await expect(page.locator("body")).not.toContainText("Away Progress Options");

    await openModal(page, "animationOptions");
    await expect(page.locator("body")).toContainText("动画选项");
    await expect(page.locator("body")).not.toContainText("Animation Options");

    await openModal(page, "hiddenTabs");
    await expect(page.locator("body")).toContainText("修改可见标签页");
    await expect(page.locator("body")).not.toContainText("Modify Visible Tabs");
  });

  test("localizes imperative news ticker messages", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.GameDatabase && document.querySelector(".c-news-ticker")?.__vue__);

    await page.evaluate(() => {
      nextNewsMessageId = "a294";
      document.querySelector(".c-news-ticker").__vue__.prepareNextMessage();
    });

    await expect(page.locator(".c-news-line")).toContainText("如果你看到一条新闻");
    await expect(page.locator(".c-news-line")).not.toContainText("If you see a news message");
  });
});
