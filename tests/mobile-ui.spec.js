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
    expect(sidebarBox.width).toBeGreaterThanOrEqual(viewport.width - 1);

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
    expect(rowGridColumns.split(" ").length).toBe(1);

    const buyButtonBox = await dimensionRow.locator(".o-primary-btn--new").boundingBox();
    expect(buyButtonBox).not.toBeNull();
    expect(buyButtonBox.x).toBeGreaterThanOrEqual(0);
    expect(buyButtonBox.x + buyButtonBox.width).toBeLessThanOrEqual(viewport.width + 1);

    const activeSubtabsBox = await page.locator(".c-modern-sidebar .o-tab-btn--active .subtabs").boundingBox();
    expect(activeSubtabsBox).not.toBeNull();
    expect(activeSubtabsBox.y + activeSubtabsBox.height).toBeLessThanOrEqual(sidebarBox.y + 1);
  });
});
