const { test, expect } = require("@playwright/test");

const GIST_FILE_NAME = "antimatter-dimensions-chinese-save.json";

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PATCH, OPTIONS",
    "access-control-allow-headers": "authorization, content-type, accept",
  };
}

test.describe("GitHub Gist backup", () => {
  test("creates a backup and restores it through the options UI", async({ page }) => {
    let gistContent = "";
    let createRequestBody = null;

    await page.route("https://api.github.com/**", async route => {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();

      if (method === "OPTIONS") {
        await route.fulfill({ status: 204, headers: corsHeaders() });
        return;
      }

      expect(request.headers().authorization).toBe("Bearer ghp_mock_token");
      expect(request.headers().accept).toContain("application/vnd.github+json");

      if (url.pathname === "/gists" && method === "POST") {
        createRequestBody = JSON.parse(request.postData());
        gistContent = createRequestBody.files[GIST_FILE_NAME].content;
        await route.fulfill({
          status: 201,
          headers: corsHeaders(),
          contentType: "application/json",
          body: JSON.stringify({
            id: "mock-gist-id",
            "html_url": "https://gist.github.com/mock/mock-gist-id",
            files: {
              [GIST_FILE_NAME]: {
                filename: GIST_FILE_NAME,
                content: gistContent
              }
            }
          })
        });
        return;
      }

      if (url.pathname === "/gists/mock-gist-id" && method === "GET") {
        await route.fulfill({
          status: 200,
          headers: corsHeaders(),
          contentType: "application/json",
          body: JSON.stringify({
            id: "mock-gist-id",
            "html_url": "https://gist.github.com/mock/mock-gist-id",
            files: {
              [GIST_FILE_NAME]: {
                filename: GIST_FILE_NAME,
                content: gistContent
              }
            }
          })
        });
        return;
      }

      await route.fulfill({
        status: 404,
        headers: corsHeaders(),
        contentType: "application/json",
        body: JSON.stringify({ message: "Unexpected mocked GitHub request" })
      });
    });

    await page.goto("/");
    await page.waitForFunction(() => window.Tab && window.GameStorage && window.GameUI);
    await page.evaluate(() => {
      GameStorage.save(true);
      Tab.options.saving.show(true);
      GameUI.update();
    });

    await page.getByPlaceholder("GitHub Token（保存后不会再次显示）").fill("ghp_mock_token");
    await page.locator(".c-github-backup-panel__toggle input").check();
    await page.getByRole("button", { name: "保存 GitHub 设置" }).click();
    await expect(page.locator(".c-github-backup-panel")).toContainText("Token：已保存");

    await page.getByRole("button", { name: "立即备份到 GitHub" }).click();
    await expect(page.locator(".c-github-backup-panel")).toContainText("https://gist.github.com/mock/mock-gist-id");

    expect(createRequestBody).toMatchObject({
      description: "反物质维度中文版存档备份",
      public: false
    });

    const payload = JSON.parse(gistContent);
    expect(payload).toMatchObject({
      schema: 1,
      app: "antimatter-dimensions-chinese",
      reason: "manual-sync"
    });
    expect(payload.saveKey).toMatch(/^dimension(?:Test)?Save$/u);
    expect(payload.saves[payload.saveKey]).toEqual(expect.any(String));

    await page.evaluate(key => localStorage.setItem(key, "broken-save"), payload.saveKey);
    await expect(page.evaluate(key => localStorage.getItem(key), payload.saveKey)).resolves.toBe("broken-save");

    await page.getByRole("button", { name: "从 GitHub 恢复" }).click();
    await expect.poll(() => page.evaluate(key => localStorage.getItem(key), payload.saveKey))
      .toBe(payload.saves[payload.saveKey]);
  });
});
