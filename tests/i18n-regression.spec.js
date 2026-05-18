const { test, expect } = require("@playwright/test");

function visibleText(page) {
  return page.locator("body").innerText({ timeout: 10000 });
}

test.describe("Chinese localization regression", () => {
  test("renders the early game UI in Chinese", async({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/反物质维度/u);
    await expect(page.locator("body")).toContainText("你有");
    await expect(page.locator("body")).toContainText("反物质");
    await expect(page.locator("body")).toContainText("维度");
    await expect(page.locator("body")).toContainText("选项");
  });

  test("keeps the localized shop tab visible and disables payments", async({ page }) => {
    await page.goto("/");
    await page.getByText("商店", { exact: true }).first().click();

    const text = await visibleText(page);
    expect(text).toContain("中文版说明");
    expect(text).toContain("不提供购买入口");
    expect(text).toContain("中文版已禁用购买");
    expect(text).not.toContain("Buy More");
    expect(text).not.toContain("Login with Google");
    expect(text).not.toContain("In-app Purchases");
  });
});
