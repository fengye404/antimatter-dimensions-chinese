#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * 中文版构建后处理脚本
 *
 * 当前中文化已经迁移到 src/ 源码层。这个脚本只处理构建产物里的
 * HTML 元数据、静态资源版本号和辅助资源复制，不再注入 DOM 翻译引擎。
 */

const fs = require("fs");
const path = require("path");

const DIST_DIR = path.resolve(__dirname, "../dist");
const I18N_DIR = path.resolve(__dirname, ".");

function getBuildVersion() {
  const commitPath = path.join(DIST_DIR, "commit.json");
  if (!fs.existsSync(commitPath)) return Date.now().toString();

  try {
    const commit = JSON.parse(fs.readFileSync(commitPath, "utf-8"));
    return (commit.sha || Date.now().toString()).slice(0, 12);
  } catch (error) {
    console.warn(`[inject] 警告: 无法读取 commit.json，使用时间戳版本: ${error.message}`);
    return Date.now().toString();
  }
}

function cacheBustLocalAssets(html, version) {
  const cssPattern = /(href="(?:stylesheets|css)\/[^"]+\.css)(?:\?[^"]*)?"/gu;
  const jsPattern = /(src="js\/[^"]+\.js)(?:\?[^"]*)?"/gu;

  return html
    .replace(cssPattern, `$1?v=${version}"`)
    .replace(jsPattern, `$1?v=${version}"`);
}

console.log("[inject] 开始处理中文版构建产物...");

const indexPath = path.join(DIST_DIR, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error("[inject] 错误: dist/index.html 不存在，请先运行 npm run build");
  process.exit(1);
}

let htmlContent = fs.readFileSync(indexPath, "utf-8");
htmlContent = htmlContent
  .replace(/<html(?:\s+lang="[^"]*")?>/u, "<html lang=\"zh-CN\">")
  .replace("<title>Antimatter Dimensions</title>", "<title>反物质维度</title>")
  .replace(
    /<meta name="Antimatter Dimensions" content="[^"]*"\s*>/u,
    "<meta name=\"反物质维度\" content=\"一款关于巨大数字不断增长的增量游戏。\">"
  );

const buildVersion = getBuildVersion();
htmlContent = cacheBustLocalAssets(htmlContent, buildVersion);
console.log(`[inject] 已为本地 JS/CSS 添加版本参数: ${buildVersion}`);

fs.writeFileSync(indexPath, htmlContent, "utf-8");
console.log(`[inject] 已写入: ${indexPath}`);

const glossaryPath = path.join(I18N_DIR, "glossary.json");
if (fs.existsSync(glossaryPath)) {
  fs.copyFileSync(glossaryPath, path.join(DIST_DIR, "glossary.json"));
  console.log("[inject] 已复制 glossary.json 到 dist/");
}

console.log("\n✅ 中文版构建后处理完成！");
console.log(`   输出目录: ${DIST_DIR}`);
