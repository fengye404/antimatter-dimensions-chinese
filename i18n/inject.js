#!/usr/bin/env node
/**
 * 中文翻译注入脚本
 * 
 * 功能:
 * 1. 读取构建输出的 index.html
 * 2. 合并所有翻译 JSON 文件为一个数据对象
 * 3. 将翻译数据和翻译引擎注入到 HTML 中
 * 4. 复制翻译资源到 dist/ 目录
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '../dist');
const I18N_DIR = path.resolve(__dirname, '.');
const ZH_CN_DIR = path.resolve(__dirname, 'zh-CN');

console.log('[inject] 开始注入中文翻译...');

// 1. 检查 dist/index.html 是否存在
const indexPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('[inject] 错误: dist/index.html 不存在，请先运行 npm run build');
  process.exit(1);
}

// 2. 加载所有翻译 JSON 文件
const translationFiles = ['ui', 'gameplay', 'howtoplay', 'achievements', 'shop', 'misc'];
let allTranslations = {};

for (const file of translationFiles) {
  const filePath = path.join(ZH_CN_DIR, `${file}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    Object.assign(allTranslations, data);
    console.log(`[inject] 加载 ${file}.json: ${Object.keys(data).length} 条`);
  } else {
    console.warn(`[inject] 警告: ${file}.json 不存在`);
  }
}

console.log(`[inject] 翻译总条目: ${Object.keys(allTranslations).length}`);

// 3. 加载正则数据
const regexDataPath = path.join(I18N_DIR, 'regex-data.js');
let postfixData = {};
let excludeWholePatterns = [];
let regReplacePatterns = [];

if (fs.existsSync(regexDataPath)) {
  const regexContent = fs.readFileSync(regexDataPath, 'utf-8');
  
  // 提取 cnPostfix
  const postfixMatch = regexContent.match(/var cnPostfix = \{([\s\S]*?)\n\}/);
  if (postfixMatch) {
    try {
      // 简化处理: 从原始文件重新读取
      const backupChs = fs.readFileSync(
        path.resolve(__dirname, '../../antimatter-dimensions-backup/chs.js'), 'utf-8'
      );
      
      // 提取后缀 - 保持简单的空格处理
      postfixData = {
        " scroll speed": " 滚动速度",
        " AI messages": " AI信息",
        " rows)": " 行)"
      };
    } catch(e) {
      console.warn('[inject] 警告: 无法加载 cnPostfix 数据');
    }
  }
  
  // 提取 cnExcludeWhole (转为字符串数组保持正则源码)
  const excludeLines = regexContent.match(/var cnExcludeWhole = \[([\s\S]*?)\n\];/);
  if (excludeLines) {
    const excludeContent = excludeLines[1];
    const regexMatches = excludeContent.match(/\/(?:[^/\\]|\\.)+\/[gimsuy]*/g);
    if (regexMatches) {
      excludeWholePatterns = regexMatches.map(r => {
        const lastSlash = r.lastIndexOf('/');
        return r.slice(1, lastSlash);
      });
    }
  }
  
  // 提取 cnRegReplace (转为 [pattern_string, replacement] 数组)
  const regReplaceBlock = regexContent.match(/var cnRegReplace = new Map\(\[([\s\S]*?)\n\]\);/);
  if (regReplaceBlock) {
    const content = regReplaceBlock[1];
    const ruleMatches = content.matchAll(/\[\/(.+?)\/([gimsuy]*),\s*'(.+?)'\]/g);
    for (const match of ruleMatches) {
      regReplacePatterns.push([match[1], match[3]]);
    }
  }
  
  console.log(`[inject] 排除规则: ${excludeWholePatterns.length}`);
  console.log(`[inject] 正则替换: ${regReplacePatterns.length}`);
}

// 4. 构建翻译数据 JSON
const i18nDataObject = {
  translations: allTranslations,
  postfix: postfixData,
  excludeWhole: excludeWholePatterns,
  regReplace: regReplacePatterns
};

const i18nDataJson = JSON.stringify(i18nDataObject);

// 5. 读取翻译引擎
const enginePath = path.join(I18N_DIR, 'translation-engine.js');
const engineCode = fs.readFileSync(enginePath, 'utf-8');

// 5.5 读取商店货币脚本
const shopHackPath = path.join(I18N_DIR, 'shop-hack.js');
let shopHackCode = '';
if (fs.existsSync(shopHackPath)) {
  shopHackCode = fs.readFileSync(shopHackPath, 'utf-8');
  console.log('[inject] 加载 shop-hack.js');
}

// 6. 构造注入的 script 块
const injectionScript = `
<script>
// Antimatter Dimensions 中文翻译数据
window.__AD_I18N__ = ${i18nDataJson};
</script>
<script>
// 翻译引擎
${engineCode}
</script>
${shopHackCode ? `<script>
// 商店货币解锁
${shopHackCode}
</script>` : ''}
`;

// 7. 注入到 index.html 的 </body> 前
let htmlContent = fs.readFileSync(indexPath, 'utf-8');

if (htmlContent.includes('</body>')) {
  htmlContent = htmlContent.replace('</body>', () => injectionScript + '</body>');
  console.log('[inject] 已注入翻译到 </body> 前');
} else {
  // 如果没有 </body>，追加到末尾
  htmlContent += injectionScript;
  console.log('[inject] 已追加翻译到文件末尾');
}

// 8. 修改页面 title
htmlContent = htmlContent.replace('<title>Antimatter Dimensions</title>', '<title>反物质维度</title>');

// 9. 写入修改后的 HTML
fs.writeFileSync(indexPath, htmlContent, 'utf-8');
console.log(`[inject] 已写入: ${indexPath}`);

// 10. 复制词汇表到 dist
const glossaryPath = path.join(I18N_DIR, 'glossary.json');
if (fs.existsSync(glossaryPath)) {
  fs.copyFileSync(glossaryPath, path.join(DIST_DIR, 'glossary.json'));
  console.log('[inject] 已复制 glossary.json 到 dist/');
}

console.log('\n✅ 中文版注入完成！');
console.log(`   输出目录: ${DIST_DIR}`);
