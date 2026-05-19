const NORMAL_NAMES = {
  11: "从零开始",
  12: "100 反物质也不少",
  13: "半衰期 3 实锤",
  14: "求生之路：四维版",
  15: "第五维反物质重拳",
  16: "经费不够做到第九维",
  17: "这真不是靠运气",
  18: "通往无限的九十度",
  21: "向无限进发！",
  22: "假新闻！",
  23: "第九维度是谎言",
  24: "反物质启示录",
  25: "提升到极限",
  26: "越过高墙",
  27: "双星系",
  28: "这样做没有意义吧……",
  31: "忘了削弱它",
  32: "众神甚悦",
  33: "好多无限",
  34: "反正也不需要它",
  35: "不许睡觉",
  36: "幽闭恐惧",
  37: "太快了！",
  38: "我不信神",
  41: "无需 DLC",
  42: "超级桑尼克",
  43: "反表终于翻身了",
  44: "三十秒收工",
  45: "比土豆还快",
  46: "多维空间",
  47: "胆大妄为",
  48: "反挑战达人",
  51: "突破限制",
  52: "自动化时代",
  53: "绝对不值得",
  54: "更快了！",
  55: "永远也没那么久",
  56: "死亡如风",
  57: "众神的馈赠",
  58: "这样挺好。",
  61: "批量采购",
  62: "咦，你还在？",
  63: "新的开始",
  64: "零死亡",
  65: "没那么有挑战",
  66: "比平方土豆还快",
  67: "无限挑战者",
  68: "又为了成就来一次？",
  71: "错误 909：维度未找到",
  72: "无限多到拿不下",
  73: "这个成就不存在",
  74: "一秒不浪费",
  75: "新维度？？？",
  76: "每个维度一个",
  77: "一百万也不少",
  78: "眨眼之间",
  81: "我可太会做游戏了",
  82: "反反挑战达人",
  83: "你居然能拿 50 个星系？！",
  84: "我还有得剩",
  85: "所有无限点数都归我们",
  86: "你真的会弯曲时间吗？",
  87: "两百万次无限",
  88: "又一个无限梗",
  91: "荒谬速度",
  92: "我谁都不让！",
  93: "最大超载",
  94: "4.3333 分钟的无限",
  95: "这样安全吗？",
  96: "时间是相对的",
  97: "像踩到乐高",
  98: "距无限 0 度",
  101: "第八维？没空管它",
  102: "这一英里走到永恒",
  103: "这个成就不存在二",
  104: "那可不算永恒",
  105: "无限时间",
  106: "虫群",
  107: "这还需要攻略吗？",
  108: "这回经费够第九维了",
  111: "我听说你喜欢无限……",
  112: "再也不来",
  113: "永恒就是新的无限",
  114: "你是个错误",
  115: "早知道拿 7 次永恒",
  116: "我真的还要无限吗",
  117: "仓储超市开始卖维度提升了！",
  118: "超过九千了",
  121: "无限点数也能无限吗？",
  122: "你已经死了。",
  123: "再永恒 5 次才更新",
  124: "长久关系",
  125: "像在背后大吃一顿",
  126: "流行音乐",
  127: "但我还想要一个新的重置层……",
  128: "到底怎样才能摆脱你",
  131: "没有无伦理的消费",
  132: "独一无二的雪花",
  133: "我从来就不喜欢无限",
  134: "什么时候才算够？",
  135: "比土豆^286078 还快",
  136: "我说过了，时间是相对的",
  137: "现在你开始用膨胀思考了！",
  138: "原来这样才能摆脱你。",
  141: "回到现实",
  142: "这到底怎么运作？",
  143: "我听说你喜欢换皮……",
  144: "这是星际穿越梗吗？",
  145: "你确定方向没反吗？",
  146: "生存特权",
  147: "现实大师",
  148: "皇家同花顺",
  151: "你真的还是不需要它",
  152: "还有符文吗？",
  153: "更像“真的没关系”",
  154: "我就是速度",
  155: "成就 #15983",
  156: "大学辍学生",
  157: "效果拔群！",
  158: "兄弟，你是不是在洞里？",
  161: "这就是你错的地方，孩子",
  162: "重装游戏并重回服务器",
  163: "其实超简单！几乎不麻烦！",
  164: "无限乘以二",
  165: "完美平衡",
  166: "好好。",
  167: "层级先生？抱歉，名单上没有你",
  168: "哇哦，我们已经走到一半",
  171: "神明很高兴",
  172: "现实漫游指南",
  173: "这个成就不存在三",
  174: "你不是已经有两个了吗？",
  175: "第一位反历史学家",
  176: "妈妈数到 3",
  177: "这一英里走到天体",
  178: "世界毁灭者",
  181: "永恒的反物质维度",
  182: "再来一次",
  183: "既视毁灭感",
  184: "你出局了！",
  185: "八十七年前",
  186: "不健康的执念",
  187: "膨胀时间那一集",
  188: "终点"
};

const SECRET_NAMES = {
  11: "第一个总是免费的",
  12: "以防万一",
  13: "尊重是有回报的",
  14: "我也是",
  15: "来个桶滚！",
  16: "你喜欢受苦吗？",
  17: "30 条命",
  18: "你觉得自己幸运吗？",
  21: "去现实里学习吧",
  22: "油炸",
  23: "站住，罪犯！",
  24: "真的没有人想点一下吗？",
  25: "嘘……这是秘密",
  26: "你失败了",
  27: "这不叫物质维度，对吧？",
  28: "不错。",
  31: "你该下载更多内存",
  32: "小于或等于 0.001",
  33: "稳健的财务决策",
  34: "你知道它们怎么用吧？",
  35: "要告诉他们可以买最大吗……",
  36: "你离开的时候……什么都没发生。",
  37: "你照着说明做了",
  38: "刀锋边缘",
  41: "那个维度不存在",
  42: "我真丢脸",
  43: "刺耳的大合唱",
  44: "现在满意了吗？",
  45: "拖来拖去",
  46: "留到雨天用",
  47: "ALT+",
  48: "栈溢出"
};

const EXACT_DESCRIPTIONS = {
  21: "到达无限。",
  26: "购买一个反物质星系。",
  34: "在没有任何第 8 反物质维度的情况下到达无限。",
  43: "让第 8 反物质维度倍率最高，第 7 维度第二高，并依此类推。",
  63: "开始永恒。",
  74: "在 1 秒内完成无限。",
  78: "在 250 毫秒内完成无限。",
  104: "在 30 秒内完成永恒。",
  122: "在 200 毫秒内完成一次无限。",
  141: "进行第一次现实。"
};

const EXACT_REWARDS = {
  23: "第 8 反物质维度增强 10%。",
  28: "第 1 反物质维度增强 10%。",
  31: "第 1 反物质维度增强 5%。",
  34: "第 1 到第 7 维度增强 2%。",
  36: "起始计数频率乘以 1.02。",
  37: "开局拥有 5000 反物质。",
  41: "解锁两个新的无限升级：2 倍无限点数倍率与离线无限点数产出。",
  58: "每个反物质星系使第 1 维度增强 1%。",
  75: "解锁第 4 无限维度。",
  85: "大坍缩自动购买器的购买数量提高 4。"
};

const SECRET_DESCRIPTIONS = {
  11: "点击这个成就。",
  12: "导出你的存档。",
  13: "尊重游戏设置。",
  14: "发现作者也会做的事。",
  15: "让页面旋转起来。",
  16: "完成特别折磨人的目标。",
  17: "在挑战中失败很多次。",
  18: "赌一把运气。",
  21: "打开时间研究相关页面。",
  22: "把游戏显示炸得很夸张。",
  23: "做一些会被守卫拦下的事。",
  25: "找到秘密主题。",
  26: "失败一次也没关系。",
  27: "证明它确实是反物质维度。",
  28: "做出一个很“Nice”的数字。",
  31: "制造一个内存相关的玩笑。",
  32: "让一个数值小于或等于 0.001。",
  33: "做出一个稳健的财务决定。",
  34: "正确使用成就提示。",
  35: "试试看购买最大值。",
  36: "离线回来后什么也没发生。",
  37: "按说明操作。",
  38: "卡在非常极限的边缘。",
  41: "尝试不存在的维度。",
  42: "让自己有点丢脸。",
  43: "触发大量声音。",
  44: "把某个行为重复到满意为止。",
  45: "拖拽到足够久。",
  46: "为以后留一点资源。",
  47: "按下 ALT 相关组合。",
  48: "让堆栈溢出。"
};

const TERM_REPLACEMENTS = [
  ["Antimatter Dimensions", "反物质维度"],
  ["Antimatter Dimension", "反物质维度"],
  ["Antimatter Galaxies", "反物质星系"],
  ["Antimatter Galaxy", "反物质星系"],
  ["Dimension Boosts", "维度提升"],
  ["Dimension Boost", "维度提升"],
  ["Dimensional Sacrifice", "维度牺牲"],
  ["Infinity Dimensions", "无限维度"],
  ["Infinity Dimension", "无限维度"],
  ["Infinity Points", "无限点数"],
  ["Infinity Point", "无限点数"],
  ["Infinity Power", "无限之力"],
  ["Eternity Points", "永恒点数"],
  ["Eternity Point", "永恒点数"],
  ["Eternity Challenges", "永恒挑战"],
  ["Eternity Challenge", "永恒挑战"],
  ["Infinity Challenges", "无限挑战"],
  ["Infinity Challenge", "无限挑战"],
  ["Time Dimensions", "时间维度"],
  ["Time Dimension", "时间维度"],
  ["Time Studies", "时间研究"],
  ["Time Study", "时间研究"],
  ["Time Theorems", "时间定理"],
  ["Time Theorem", "时间定理"],
  ["Reality Machines", "现实机器"],
  ["Reality Machine", "现实机器"],
  ["Dilated Time", "膨胀时间"],
  ["Tachyon Particles", "快子粒子"],
  ["Tachyon Particle", "快子粒子"],
  ["Replicanti Galaxies", "复制体星系"],
  ["Replicanti Galaxy", "复制体星系"],
  ["Replicanti", "复制体"],
  ["Tickspeed", "时间间隔"],
  ["Big Crunch", "大坍缩"],
  ["Glyphs", "符文"],
  ["Glyph", "符文"],
  ["Celestial", "天体"],
  ["Achievements", "成就"],
  ["Achievement", "成就"],
  ["Dimensions", "维度"],
  ["Dimension", "维度"],
  ["Galaxies", "星系"],
  ["Galaxy", "星系"],
  ["antimatter", "反物质"],
  ["Infinity", "无限"],
  ["Eternity", "永恒"],
  ["Reality", "现实"]
];

function applyRules(text) {
  const rules = [
    [/^Buy a (\d+)(?:st|nd|rd|th) Antimatter Dimension\.$/u, "购买第 $1 反物质维度。"],
    [/^Buy an (\d+)(?:st|nd|rd|th) Antimatter Dimension\.$/u, "购买第 $1 反物质维度。"],
    [/^Buy a single 1st Antimatter Dimension when you have over (.+) of them\.$/u,
      "在第 1 反物质维度超过 $1 个时，单独购买 1 个第 1 维度。"],
    [/^Buy (\d+) Dimension Boosts\.$/u, "购买 $1 次维度提升。"],
    [/^Buy (\d+) Antimatter Galaxies\.$/u, "购买 $1 个反物质星系。"],
    [/^Get over (.+) antimatter\.$/u, "拥有超过 $1 反物质。"],
    [/^Get any Antimatter Dimension multiplier over (.+)\.$/u, "让任意反物质维度倍率超过 $1。"],
    [/^Get over (.+) from Dimensional Sacrifice outside of Challenge 8\.$/u,
      "在挑战 8 之外，让维度牺牲倍率超过 $1。"],
    [/^Reach Infinity (\d+) times\.$/u, "到达无限 $1 次。"],
    [/^Have exactly (\d+) 8th Antimatter Dimensions\.$/u, "拥有恰好 $1 个第 8 反物质维度。"],
    [/^Have antimatter per second exceed your current antimatter above (.+)\.$/u,
      "在反物质超过 $1 后，让每秒反物质产量超过当前反物质量。"],
    [/^Infinity in under (.+)\.$/u, "在 $1 内到达无限。"],
    [/^Eternity in under (.+)\.$/u, "在 $1 内到达永恒。"],
    [/^Start with (.+) antimatter\.$/u, "开局拥有 $1 反物质。"],
    [/^(.+) Antimatter Dimensions are (.+) stronger\.$/u, "第 $1 反物质维度增强 $2。"],
    [/^Dimensions 1-7 are (.+) stronger\.$/u, "第 1 到第 7 维度增强 $1。"],
    [/^Multiply starting tick speed by (.+)\.$/u, "起始计数频率乘以 $1。"],
    [/^Unlock (.+)\.$/u, "解锁 $1。"],
    [/^Unlock (.+), the Celestial of Achievements\.$/u, "解锁成就天体 $1。"],
    [/^(.+) are (.+) stronger\.$/u, "$1 增强 $2。"]
  ];

  for (const [pattern, replacement] of rules) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }
  return text;
}

function replaceTerms(text) {
  return TERM_REPLACEMENTS.reduce(
    (current, [from, to]) => current.replace(new RegExp(from, "gu"), to),
    text
  );
}

function hasRemainingEnglish(text) {
  const stripped = text.replace(/\b(?:AD|IP|EP|RM|STD|TT|DLC|EC|V|Ra|Lai'tela|Pelle)\b/gu, "");
  return /[A-Za-z]{3,}/u.test(stripped);
}

function fallback(field, id) {
  if (field === "description") return "达成条件：完成该成就对应的游戏目标。";
  if (field === "reward") return "提供对应机制加成。";
  return `成就 ${id}`;
}

function translateDynamicText(text, field, id) {
  if (typeof text !== "string") return text;

  const normalized = text.replace(/\s+/gu, " ").trim();
  let translated = applyRules(normalized);
  translated = replaceTerms(translated);

  return hasRemainingEnglish(translated) ? fallback(field, id) : translated;
}

export function normalAchievementText(achievement, field) {
  const id = achievement.id;
  const config = achievement.config;

  if (field === "name") return NORMAL_NAMES[id] || translateDynamicText(config.name, field, id);
  if (field === "description") {
    return EXACT_DESCRIPTIONS[id] || translateDynamicText(config.description, field, id);
  }
  if (field === "reward") {
    if (config.reward === undefined) return undefined;
    return EXACT_REWARDS[id] || translateDynamicText(config.reward, field, id);
  }
  return undefined;
}

export function secretAchievementText(achievement, field) {
  const id = achievement.id;
  const config = achievement.config;

  if (field === "name") return SECRET_NAMES[id] || translateDynamicText(config.name, field, id);
  if (field === "description") {
    return SECRET_DESCRIPTIONS[id] || translateDynamicText(config.description, field, id);
  }
  return undefined;
}
