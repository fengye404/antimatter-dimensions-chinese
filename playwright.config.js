const { defineConfig, devices } = require("@playwright/test");

process.env.NO_PROXY = [process.env.NO_PROXY, "127.0.0.1", "localhost"].filter(Boolean).join(",");
// eslint-disable-next-line camelcase,dot-notation
process.env["no_proxy"] = [process.env["no_proxy"], "127.0.0.1", "localhost"].filter(Boolean).join(",");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60000,
  workers: 1,
  expect: {
    timeout: 15000,
  },
  use: {
    ...devices["Desktop Chrome"],
    channel: "chrome",
    baseURL: "http://127.0.0.1:48321",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 48321 --directory dist",
    url: "http://127.0.0.1:48321",
    reuseExistingServer: false,
    timeout: 10000,
  },
});
