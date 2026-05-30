const { test, expect } = require("@playwright/test");

test.describe("Mobile modern UI", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });

  test("uses a bottom navigation and keeps the antimatter tab inside the viewport", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.Tab && window.GameUI);

    const viewport = page.viewportSize();
    const sidebarBox = await page.locator(".c-modern-sidebar").boundingBox();
    expect(sidebarBox).not.toBeNull();
    expect(sidebarBox.y).toBeGreaterThan(viewport.height - 120);
    expect(sidebarBox.x).toBeGreaterThanOrEqual(0);
    expect(sidebarBox.x + sidebarBox.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(sidebarBox.width).toBeGreaterThanOrEqual(viewport.width - 40);

    const containerMetrics = await page.locator(".game-container").evaluate(element => {
      const style = getComputedStyle(element);
      return {
        marginLeft: style.marginLeft,
        overflowY: style.overflowY,
        width: element.getBoundingClientRect().width,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      };
    });
    expect(containerMetrics.marginLeft).toBe("0px");
    expect(containerMetrics.overflowY).toBe("visible");
    expect(containerMetrics.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(containerMetrics.scrollWidth).toBeLessThanOrEqual(containerMetrics.clientWidth + 2);

    const pageScrollMetrics = await page.evaluate(() => ({
      bodyOverflowY: getComputedStyle(document.body).overflowY,
      htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
      scrollHeight: document.scrollingElement.scrollHeight,
      clientHeight: document.scrollingElement.clientHeight,
    }));
    expect(pageScrollMetrics.bodyOverflowY).toBe("auto");
    expect(pageScrollMetrics.htmlOverflowY).toBe("auto");
    expect(pageScrollMetrics.scrollHeight).toBeGreaterThan(pageScrollMetrics.clientHeight);

    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    const dimensionRow = page.locator(".l-dimension-row-antimatter-dim").first();
    await expect(dimensionRow).toBeVisible();
    const rowGridColumns = await dimensionRow.evaluate(element => getComputedStyle(element).gridTemplateColumns);
    expect(rowGridColumns.split(" ").length).toBeGreaterThanOrEqual(3);

    const buyButtonBox = await dimensionRow.locator(".o-primary-btn--new").boundingBox();
    expect(buyButtonBox).not.toBeNull();
    expect(buyButtonBox.x).toBeGreaterThanOrEqual(0);
    expect(buyButtonBox.x + buyButtonBox.width).toBeLessThanOrEqual(viewport.width + 1);

    const activeSubtabsBox = await page.locator(".c-modern-sidebar .o-tab-btn--active .subtabs").boundingBox();
    expect(activeSubtabsBox).not.toBeNull();
    expect(activeSubtabsBox.y + activeSubtabsBox.height).toBeLessThanOrEqual(sidebarBox.y + 1);

    const resetButtonBoxes = await page.locator(".reset-container .o-primary-btn--dimension-reset")
      .evaluateAll(elements => elements.map(element => {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
        };
      }));
    for (const resetButtonBox of resetButtonBoxes) {
      expect(resetButtonBox.bottom).toBeLessThanOrEqual(sidebarBox.y);
    }
  });

  test("keeps secondary tabs usable without desktop-width overflow", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.Tab && window.GameUI);

    const checks = [
      {
        name: "achievements",
        show: () => window.Tab.achievements.normal.show(true),
        target: ".l-achievement-grid",
      },
      {
        name: "options-saving",
        show: () => window.Tab.options.saving.show(true),
        target: ".l-options-grid",
      },
      {
        name: "options-visual",
        show: () => window.Tab.options.visual.show(true),
        target: ".l-options-grid",
      },
      {
        name: "automation",
        show: () => window.Tab.automation.autobuyers.show(true),
        target: ".l-autobuyers-tab",
      },
      {
        name: "challenges",
        show: () => window.Tab.challenges.normal.show(true),
        target: ".l-challenge-grid",
      },
      {
        name: "shop",
        show: () => window.Tab.shop.show(true),
        target: ".l-shop-buttons-container",
      },
    ];

    for (const check of checks) {
      await page.evaluate(check.show);
      await page.waitForTimeout(200);
      await page.evaluate(() => window.scrollTo(0, 0));

      const metrics = await page.evaluate(selector => {
        const viewportWidth = window.innerWidth;
        const nav = document.querySelector(".c-modern-sidebar").getBoundingClientRect();
        const target = document.querySelector(selector).getBoundingClientRect();
        const scroller = document.scrollingElement;
        const visibleInteractiveElements = [...document.querySelectorAll(
          "button, input, .o-primary-btn, .l-achievement-grid__cell, .l-challenge-grid__cell"
        )]
          .filter(element => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
          })
          .map(element => {
            const rect = element.getBoundingClientRect();
            return {
              left: rect.left,
              right: rect.right,
              bottom: rect.bottom,
            };
          });
        return {
          targetLeft: target.left,
          targetRight: target.right,
          scrollWidth: scroller.scrollWidth,
          clientWidth: scroller.clientWidth,
          navTop: nav.top,
          visibleInteractiveElements,
          viewportWidth,
        };
      }, check.target);

      expect(metrics.targetLeft, `${check.name} target should not overflow left`).toBeGreaterThanOrEqual(-1);
      expect(metrics.targetRight, `${check.name} target should not overflow right`).toBeLessThanOrEqual(metrics.viewportWidth + 1);
      expect(metrics.scrollWidth, `${check.name} document should not horizontally scroll`)
        .toBeLessThanOrEqual(metrics.clientWidth + 2);

      for (const element of metrics.visibleInteractiveElements) {
        expect(element.left, `${check.name} interactive element should stay on screen`).toBeGreaterThanOrEqual(-1);
        expect(element.right, `${check.name} interactive element should stay on screen`)
          .toBeLessThanOrEqual(metrics.viewportWidth + 1);
      }
    }
  });

  test("keeps save controls above the floating navigation on first view", async({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => window.Tab && window.GameUI);

    await page.evaluate(() => Tab.options.saving.show(true));
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));

    const metrics = await page.evaluate(() => {
      const nav = document.querySelector(".c-modern-sidebar").getBoundingClientRect();
      const controls = [...document.querySelectorAll(".l-options-grid:first-of-type .o-primary-btn")]
        .filter(element => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 &&
            rect.top < window.innerHeight && rect.bottom > 0 &&
            style.display !== "none" && style.visibility !== "hidden";
        })
        .map(element => {
          const rect = element.getBoundingClientRect();
          return {
            text: element.innerText.replace(/\s+/gu, " ").trim(),
            bottom: rect.bottom,
          };
        });

      return {
        navTop: nav.top,
        controls,
      };
    });

    for (const control of metrics.controls) {
      expect(control.bottom, `${control.text} should not sit under the bottom navigation`)
        .toBeLessThanOrEqual(metrics.navTop - 4);
    }
  });
});
