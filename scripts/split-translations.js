#!/usr/bin/env node
/**
 * 翻译文件拆分脚本
 * 将旧版 chs.js 的翻译内容拆分为分类 JSON 文件
 * 同时修复已知的翻译质量问题
 */

const fs = require('fs');
const path = require('path');

// 读取备份的 chs.js
const chsContent = fs.readFileSync(path.resolve(__dirname, '../../antimatter-dimensions-backup/chs.js'), 'utf-8');

// 提取 cnItems 对象内容（行 13-1743）
const cnItemsMatch = chsContent.match(/var cnItems = \{[\s\S]*?\n\}/);
if (!cnItemsMatch) {
  console.error('无法匹配 cnItems');
  process.exit(1);
}

// 提取所有键值对 - 使用更简单的逐行方式
const lines = chsContent.split('\n');
const entries = [];
let inCnItems = false;
let currentKey = null;
let currentValue = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('var cnItems = {')) {
    inCnItems = true;
    continue;
  }
  if (inCnItems && /^var cn(Postfix|ExcludeWhole|ExcludePostfix)/.test(line)) {
    inCnItems = false;
    break;
  }
  if (inCnItems && line.trim().startsWith('}')) {
    inCnItems = false;
    break;
  }
  if (!inCnItems) continue;

  // 匹配 'key': 'value' 格式
  const match = line.match(/^\s*['"](.+?)['"]\s*:\s*['"](.*)['"],?\s*$/);
  if (match) {
    entries.push({ key: match[1], value: match[2] });
  }
}

console.log(`提取了 ${entries.length} 个翻译条目`);

// 翻译质量修复映射
const qualityFixes = {
  '这个模态框': '这个弹窗',
  '模态框': '弹窗',
  '消息传递应用程序': '消息应用',
  '可能可能不可靠': '可能不可靠',
  '在不同地方转移您的保存': '将存档转移到其他设备',
};

function applyQualityFixes(text) {
  let result = text;
  for (const [from, to] of Object.entries(qualityFixes)) {
    result = result.replace(new RegExp(from, 'g'), to);
  }
  // UI → 界面
  result = result.replace(/\bUI\b/g, '界面');
  // 截断 → 删减
  result = result.replace(/截断/g, '删减');
  return result;
}

// 分类关键词
const shopKeywords = ['STD', 'Shop', 'shop', 'coin', 'purchase', 'IAP', 'cosmetic', 'Google', 'login', 'Login', 'Cloud', 'cloud'];
const achievementKeywords = ['Achievement', 'achievement', 'Secret Achievement'];
const howtoplayKeywords = ['How to Play', 'How To Play', 'Welcome to', 'tutorial'];
const gameplayKeywords = [
  'Dimension', 'dimension', 'Antimatter', 'antimatter', 'Infinity', 'infinity',
  'Eternity', 'eternity', 'Reality', 'reality', 'Replicanti', 'replicanti',
  'Tickspeed', 'tickspeed', 'Galaxy', 'galaxy', 'Boost', 'boost',
  'Sacrifice', 'sacrifice', 'Crunch', 'crunch', 'Dilation', 'dilation',
  'Tachyon', 'tachyon', 'Glyph', 'glyph', 'Black Hole', 'Celestial',
  'Time Study', 'Time Theorem', 'Perk', 'Automator', 'Challenge'
];
const uiKeywords = [
  'Save', 'save', 'Export', 'export', 'Import', 'import', 'Settings', 'Options',
  'Toggle', 'toggle', 'Enable', 'Disable', 'ON', 'OFF', 'Button', 'button',
  'Tab', 'tab', 'Click', 'click', 'Display', 'Hotkey', 'hotkey', 'Modal',
  'Confirm', 'Cancel', 'Close', 'Open', 'Hide', 'Show', 'Notification',
  'Animation', 'Visual', 'Theme', 'theme', 'Classic', 'Modern', 'Dark',
  'Commas', 'Standard', 'Notation', 'notation'
];

// 分类函数
function categorize(key) {
  // 长文本（超过200字符）基本是 howtoplay 内容
  if (key.length > 200) return 'howtoplay';
  
  // 成就相关
  if (key.includes('Achievement') || key.includes('achievement') || 
      /^\(S\d+\)$/.test(key) || /\(S\d+\)/.test(key)) return 'achievements';
  
  // 商店相关
  if (shopKeywords.some(kw => key.includes(kw))) return 'shop';
  
  // How to Play 相关
  if (howtoplayKeywords.some(kw => key.includes(kw))) return 'howtoplay';
  
  // UI 相关 (短文本更可能是 UI)
  if (key.length < 30 && uiKeywords.some(kw => key.includes(kw))) return 'ui';
  
  // 游戏玩法
  if (gameplayKeywords.some(kw => key.includes(kw))) return 'gameplay';
  
  // 默认分类
  if (key.length < 20) return 'ui';  // 短文本归 UI
  return 'misc';
}

// 执行分类
const categories = {
  ui: {},
  gameplay: {},
  howtoplay: {},
  achievements: {},
  shop: {},
  misc: {}
};

for (const { key, value } of entries) {
  if (key === '_OTHER_') continue;
  if (value === '') continue;  // 跳过空翻译
  
  const category = categorize(key);
  const fixedValue = applyQualityFixes(value);
  categories[category][key] = fixedValue;
}

// 输出统计
console.log('\n分类统计：');
for (const [cat, items] of Object.entries(categories)) {
  console.log(`  ${cat}: ${Object.keys(items).length} 条`);
}

// 写入 JSON 文件
const outputDir = path.resolve(__dirname, '../i18n/zh-CN');
for (const [cat, items] of Object.entries(categories)) {
  const filePath = path.join(outputDir, `${cat}.json`);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
  console.log(`已写入: ${filePath}`);
}

// 提取核心术语表
const glossary = {
  "Antimatter": "反物质",
  "Antimatter Dimensions": "反物质维度",
  "Infinity": "无限",
  "Infinity Points": "无限点数",
  "Infinity Dimensions": "无限维度",
  "Eternity": "永恒",
  "Eternity Points": "永恒点数",
  "Eternity Dimensions": "永恒维度",
  "Reality": "现实",
  "Reality Machines": "现实机器",
  "Time Dimensions": "时间维度",
  "Time Theorems": "时间定理",
  "Time Studies": "时间研究",
  "Time Dilation": "时间膨胀",
  "Dilated Time": "膨胀时间",
  "Tachyon Particles": "快子粒子",
  "Tachyon Galaxies": "快子星系",
  "Dimension Boost": "维度提升",
  "Dimension Boosts": "维度提升",
  "Antimatter Galaxy": "反物质星系",
  "Antimatter Galaxies": "反物质星系",
  "Tickspeed": "计数频率",
  "Big Crunch": "大坍缩",
  "Dimensional Sacrifice": "维度牺牲",
  "Replicanti": "复制体",
  "Replicanti Galaxy": "复制体星系",
  "Replicanti Galaxies": "复制体星系",
  "Glyphs": "符文",
  "Black Hole": "黑洞",
  "Celestials": "天体",
  "Automator": "自动化脚本",
  "Autobuyer": "自动购买器",
  "Autobuyers": "自动购买器",
  "Perks": "特权",
  "Perk Points": "特权点数",
  "Achievements": "成就",
  "Challenges": "挑战",
  "Normal Challenges": "普通挑战",
  "Infinity Challenges": "无限挑战",
  "Eternity Challenges": "永恒挑战",
  "Break Infinity": "打破无限",
  "Infinity Power": "无限之力",
  "Time Shards": "时间碎片",
  "STD Coins": "STD币"
};

const glossaryPath = path.resolve(__dirname, '../i18n/glossary.json');
fs.writeFileSync(glossaryPath, JSON.stringify(glossary, null, 2), 'utf-8');
console.log(`\n已写入术语表: ${glossaryPath}`);

// 提取 cnPostfix
const postfixMatch = chsContent.match(/var cnPostfix = \{([\s\S]*?)\n\}/);
// 提取 cnExcludeWhole
const excludeMatch = chsContent.match(/var cnExcludeWhole = \[([\s\S]*?)\n\];/);
// 提取 cnRegReplace  
const regReplaceMatch = chsContent.match(/var cnRegReplace = new Map\(\[([\s\S]*?)\n\]\);/);

// 保存原始正则数据供翻译引擎使用
const engineData = {
  postfix: postfixMatch ? postfixMatch[0] : '',
  excludeWhole: excludeMatch ? excludeMatch[0] : '',
  regReplace: regReplaceMatch ? regReplaceMatch[0] : ''
};

const engineDataPath = path.resolve(__dirname, '../i18n/regex-data.js');
let regexDataContent = '// 正则和后缀数据 - 从 chs.js 自动提取\n// 这些数据在翻译引擎中使用\n\n';
regexDataContent += (engineData.postfix || 'var cnPostfix = {};') + '\n\n';
regexDataContent += (engineData.excludeWhole || 'var cnExcludeWhole = [];') + '\n\n';
regexDataContent += 'var cnExcludePostfix = [];\n\n';
regexDataContent += (engineData.regReplace || 'var cnRegReplace = new Map([]);') + '\n';

fs.writeFileSync(engineDataPath, regexDataContent, 'utf-8');
console.log(`已写入正则数据: ${engineDataPath}`);

console.log('\n✅ 翻译文件拆分完成！');
