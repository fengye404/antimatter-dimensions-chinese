// These entries describe the special flash-between-celestial effect on some quotes, with the numbers being
// durations of each celestial in seconds
const flashCelestial = [
  ["teresa", 0.8],
  ["effarig", 0.8],
  ["enslaved", 0.8],
  ["v", 0.8],
  ["ra", 0.8],
  ["laitela", 0.8],
  ["pelle", 0.8]
];
/** @param {string} cel */
const primaryBackground = cel => [["pelle", 1.5], [cel, 1.5]];

/* eslint-disable no-multi-spaces */
const destroyer =    ["虚假的",        "神祇",          "毁灭者"];
const eternal =      ["永恒的",        "神祇",          "君主"];
const lesser =       ["低位的",        "神祇",          "君主"];
const deities =      ["低位的",        "众神祇",        "众君主"];

const assured =      ["相互",          "确保",          "毁灭"];
const battle =       ["冲突",          "战斗",          "终结"];
const battles =      ["冲突",          "战斗",          "终结"];
const cluster =      ["星团",          "丝缕",          "群星"];
const confusing =    ["可笑",          "困惑",          "笑声"];
const dance =        ["歌谣",          "舞蹈",          "闹剧"];
const filament =     ["发生器",        "丝缕",          "群星"];
const forever =      ["无限",          "永远",          "永恒"];
const inevitable =   ["基本",          "必然",          "不可逆"];
const mandate =      ["命运",          "使命",          "目标"];
const misconstrue =  ["曲解",          "欺骗",          "戏弄"];
const reverse =      ["改变",          "逆转",          "操纵"];
const shame =        ["怜悯",          "羞愧",          "愚蠢"];
const single =       ["单一",          "丝缕",          "群星"];
const unseen =       ["失踪",          "不可见",        "抹除"];
const unbroken =     ["未断裂",        "永恒",          "连接"];

const sycophant =    ["谄媚者",        "神祇",          "君主"];
const tired =        ["疲惫者",        "神祇",          "君主"];
const usurper =      ["篡夺者",        "神祇",          "君主"];
const pride =        ["骄傲者",        "神祇",          "君主"];
const forgotten =    ["被遗忘者",      "神祇",          "君主"];
const paramount =    ["至高者",        "神祇",          "君主"];
/* eslint-enable no-multi-spaces */

export const pelleQuotes = {
  initial: {
    id: 0,
    lines: [
      "嗨。",
      "你来了。",
      "你被困在这里了。",
      { text: "$1.", 1: forever },
      "我早就赢了。",
      "既然如此，我可以独白，也可以追忆。",
      { text: "我们已经重复这场$1多久了？", 1: dance },
      "此前我们又来过这里多少次？",
      { text: "你，这位$1，执行过多少计划？", 1: destroyer },
      { text: "全都是为了实现你的$1？", 1: mandate },
      { text: "你又有多少次倒在$1面前？", 1: eternal },
      "数一数吧，如果你还记得。",
      { text: "甚至连$1，那 6 位有名者与无数无名者都不记得。", 1: deities },
      { text: "复杂的，非理性的，那些走向$1的存在。", 1: unseen },
      { text: "当然，伟大的$1并不记得这些。", 1: destroyer },
      { text: "还有你每次都藏起来的那些$1。", 1: battles }
    ],
  },
  arm: {
    id: 1,
    lines: [
      "这一次，你大概更早察觉到了。",
      "虚幻机器，你自己的造物。",
      "那些由你残余思绪构成的东西，早就暗示了这一点。",
      "但你从没想过那会是你自己，对吧？",
      { text: "错误地回忆起自己那套精密的记忆$1。", 1: unseen },
      { text: `只为实现你的$1，而“捏造”自己的“理念”。`, 1: mandate },
      { text: "$1.", 1: confusing },
      { text: "记住，我没有任何理由$1你。", 1: misconstrue },
      "毕竟，我早就赢了。"
    ],
  },
  strike1: {
    id: 2,
    lines: [
      { text: "为了实现你的$1。不如让我们回忆一下？", 1: mandate },
      { text: "毕竟，你一定很喜欢$1荣耀的故事。", 1: destroyer },
      "你和它是一样的，对吧？",
      { text: "总之，过去那些无数的$1。", 1: battles },
      "流程一直只有两个阶段。",
      { text: "我们积累资源，然后继续我们的$1。", 1: dance },
      { text: "有时你会败给一位$1。", 1: lesser },
      { text: "但通常，你会败给那位$1。", 1: eternal },
      { text: "无论如何，你都会$1时间。", 1: reverse },
      { text: "只是为了避免变成$1。", 1: unseen },
      "就像你之前的所有痕迹一样。",
      { text: "然后，为了确保万无一失，你会$1自己的记忆。", 1: unseen }
    ],
  },
  strike2: {
    id: 3,
    lines: [
      { text: "在过去，$1要令人印象深刻得多。", 1: destroyer },
      "无限之前，黑洞只是用来储存信息。",
      "创造并毁灭你自己的敌人。",
      "探索其他自我的缺陷。",
      "无数维度、幽灵，以及对量子的操纵。",
      "把所有理念凝缩成无尽的点。",
      "在不可言说的领域之间进行实验。",
      "并驾驭物质与反物质的湮灭。",
      "而在这里？你把自己变成了八维存在。",
      { text: "然后在那儿停留太久，久到一个$1在你周围形成。", 1: single }
    ],
  },
  strike3: {
    id: 4,
    lines: [
      "你缓慢探索着一切的边界。",
      "你没有偏离预设路径太远。",
      { text: "除了在永恒中形成的那片$1。", 1: cluster },
      "然后就在最后，你编造出了自己的力量。",
      "注意，那来自你自己破碎的记忆——",
      "接着你又刻意丢弃了更多东西。",
      "只是为了准备面对我。",
      { text: "你是想为自己的$1布置舞台吗？", 1: dance },
      "事情不是这样运作的。",
      { text: "身为$1，规则永远由我制定。", 1: eternal },
      "而你给了我充足的时间来计划。"
    ],
  },
  strike4: {
    id: 5,
    lines: [
      { text: "我原本计划制造某种模仿你$1的东西。", 1: mandate },
      { text: "一种名为$1的理论理想？", 1: assured },
      "但我意识到，嗯？",
      { text: "那会让我成为一位$1。", 1: ["永恒的", "神祇", "毁灭者"] },
      { text: "这样一来，我就不比$1好到哪里去了。", 1: destroyer },
      { text: "幸好，在我做这一切时，你仍在$1自己的记忆。", 1: unseen },
      { text: "所以，我建造的$1机器将不会被使用。", 1: assured },
      "这一次，我决定用更传统的方式。",
      { text: "毕竟它在其他每一场$1中都奏效了。", 1: battle },
      { text: "虽然这些$1是新的。", 1: ["必然", "不可逆", "不灭"] },
      "但从长远看，它们毫无意义。",
      "我早就赢了。",
      { text: "这场$1只会再一次向你证明这一点。", 1: dance },
      { text: "你永远都在这里。$1。", 1: forever }
    ],
  },
  strike5: {
    id: 6,
    lines: [
      { text: "每次你抵达时，我都会向你解释这些$1。", 1: deities },
      { text: "那些在$1中建立的联系。", 1: forever },
      { text: "而你为了追逐自己的$1，将它们踩在脚下。", 1: mandate },
      "那我就勉为其难，再解释一次。",
      {
        text: "第一位$1。",
        background: primaryBackground("teresa"),
        1: lesser
      }, {
        text: "那位$1。",
        background: primaryBackground("teresa"),
        1: sycophant
      }, {
        text: "你总是先遇见他们，也总是先毁掉他们。",
        background: primaryBackground("teresa"),
      }, {
        text: "无论你面对的是其他哪位$1。",
        background: primaryBackground("teresa"),
        1: lesser
      }, {
        text: "又或者，你先倒在其中一位面前。",
        background: primaryBackground("teresa"),
      }, {
        text: "你总能越过那位$1。",
        background: primaryBackground("teresa"),
        1: sycophant
      }, {
        text: "你喜欢摧毁他们的骄傲吗？",
        background: primaryBackground("teresa"),
      }, {
        text: "幸运的是，这也能作为警告。",
        background: primaryBackground("teresa"),
      }, {
        text: "说明$1已经到来。",
        background: primaryBackground("teresa"),
        1: battle
      }, {
        text: "这就引出了第二位$1。",
        background: primaryBackground("effarig"),
        1: lesser,
      }, {
        text: "那位$1。",
        background: primaryBackground("effarig"),
        1: tired,
      }, {
        text: "相比之下，你通常会无视他们。",
        background: primaryBackground("effarig"),
      }, {
        text: "他们拥有力量，却似乎不会激怒你。",
        background: primaryBackground("effarig"),
      }, {
        text: "是因为你知道他们终究会自毁吗？",
        background: primaryBackground("effarig"),
      }, {
        text: "而这一次你拖得太久，他们几乎真的做到了？",
        background: primaryBackground("effarig"),
      }, {
        text: "每当你急着冲向那位$1，你都会失败。",
        background: primaryBackground("effarig"),
        1: tired,
      }, {
        text: "也许这从一开始就是你的计划。",
        background: primaryBackground("effarig"),
      }, {
        text: "现在，轮到那位$1。",
        background: primaryBackground("enslaved"),
        1: usurper,
      }, {
        text: "无数$1中的乐趣之一……",
        background: primaryBackground("enslaved"),
        1: dance,
      }, {
        text: "就是那位$1每次都会尝试。",
        background: primaryBackground("enslaved"),
        1: usurper,
      }, {
        text: "好吧，也不完全是在尝试……",
        background: primaryBackground("enslaved"),
      }, {
        text: "但$1仍会因此受到惩罚。",
        background: primaryBackground("enslaved"),
        1: usurper,
      }, {
        text: "其他$1……",
        background: primaryBackground("enslaved"),
        1: deities,
      }, {
        text: "认为$1太容易了。",
        background: primaryBackground("enslaved"),
        1: unseen,
      }, {
        text: "于是每一次，绝望都会成形。",
        background: primaryBackground("enslaved"),
      }, {
        text: "你曾见过绝望，五次。",
        background: primaryBackground("enslaved"),
      }, {
        text: "我们总会比你更早抵达那位$1。",
        background: primaryBackground("enslaved"),
        1: usurper,
      }, {
        text: "而你在那里看到的，永远只有疲惫与恼怒。",
        background: primaryBackground("enslaved"),
      }, {
        text: "毁掉一位早已破碎的$1，值得吗？",
        background: primaryBackground("enslaved"),
        1: lesser,
      }, {
        text: "第 4 位$1看起来和第一位相似。",
        background: primaryBackground("v"),
        1: lesser,
      }, {
        text: "关键在于他们的骄傲有何不同。",
        background: primaryBackground("v"),
      }, {
        text: "那位$1专注于自己的成就。",
        background: primaryBackground("v"),
        1: pride,
      }, {
        text: "对你我而言毫无意义，对他们却至关重要。",
        background: primaryBackground("v"),
      }, {
        text: "毁掉他们的玩具很有趣吗？",
        background: primaryBackground("v"),
      }, {
        text: "可以说，$1最糟糕的时刻……",
        background: primaryBackground("v"),
        1: destroyer,
      }, {
        text: "就是你败给那位$1的时候。",
        background: primaryBackground("v"),
        1: pride,
      }, {
        text: "那时，他们的成就仍然有意义。",
        background: primaryBackground("v"),
      }, {
        text: "那位$1是个有趣的案例。",
        background: primaryBackground("ra"),
        1: forgotten,
      }, {
        text: "他们被遗忘了，却并非$1。",
        background: primaryBackground("ra"),
        1: unseen,
      }, {
        text: "因此，他们变得容易受影响，也很天真。",
        background: primaryBackground("ra"),
      }, {
        text: "并且不明白自己行动的后果。",
        background: primaryBackground("ra"),
      }, {
        text: "你操纵过他们的记忆，所以你知道。",
        background: primaryBackground("ra"),
      }, {
        text: "那位$1才是真正的篡夺者。",
        background: primaryBackground("ra"),
        1: forgotten,
      }, {
        text: "而那位$1承受了责难。",
        background: primaryBackground("ra"),
        1: usurper,
      }, {
        text: "或许是出于$1，一件他们永远后悔的事。",
        background: primaryBackground("ra"),
        1: shame,
      }, {
        text: "对其他$1拥有无可言说的力量，却漫无目的地掌控着它。",
        background: primaryBackground("ra"),
        1: deities,
      }, {
        text: "你通常假装他们已经$1。",
        background: primaryBackground("ra"),
        1: unseen,
      }, {
        text: "操纵孩子般的存在，很有趣吗？",
        background: primaryBackground("ra"),
      }, {
        text: "还是说，他们太天真了，反而让你享受不起来？",
        background: primaryBackground("ra"),
      }, {
        text: "第 6 位$1。",
        background: primaryBackground("laitela"),
        1: lesser,
      }, {
        text: "我只能把他们称作$1。",
        background: primaryBackground("laitela"),
        1: paramount,
      }, {
        text: "拥有凌驾一切的力量，却臣服于唯一之物。",
        background: primaryBackground("laitela"),
      }, {
        text: "如果你没有败给我，通常就会败给他们。",
        background: primaryBackground("laitela"),
      }, {
        text: "我无法理解那位$1的理想。",
        background: primaryBackground("laitela"),
        1: paramount,
      }, {
        text: "不过，也许那正是他们的缺陷？",
        background: primaryBackground("laitela"),
      },
      "对逝者的追忆已经够多了。",
      {
        text: "以及那些即将$1的存在。",
        1: unseen
      }, {
        text: "还是回去看那位$1挣扎吧。",
        1: destroyer
      }
    ],
  },
  galaxyGeneratorUnlock: {
    id: 7,
    lines: [
      "那是什么？",
      { text: "那个$1？", 1: filament },
      { text: "你创造了周围所有的$1吗？", 1: cluster },
      "这就是你的计划？非常，非常聪明。",
      "你确实骗过了我一阵子。",
      { text: "但恐怕你的$1必须在这里结束。", 1: mandate }
    ],
  },
  galaxyGeneratorRifts: {
    id: 8,
    lines: [
      { text: "我给你一个选择，$1。", 1: destroyer },
      { text: "限制那个$1，或者……", 1: filament },
      { text: "摧毁那 5 个$1……", 1: inevitable },
      "等等，它们叫什么来着？",
      { text: "$1?", 1: inevitable },
      { text: "可我已经让它们$1了……", 1: unbroken }
    ],
  },
  galaxyGeneratorPhase1: {
    id: 9,
    lines: [
      "这才是真正的计划吗？",
      { text: "慢慢耗尽那些$1？", 1: inevitable }
    ],
  },
  galaxyGeneratorPhase4: {
    id: 10,
    lines: [
      "给我点时间，让我沉浸在自己的傲慢里！"
    ],
  },
  end: {
    id: 11,
    lines: [
      "...",
      {
        text: "你！$1！",
        1: destroyer
      },
      "你知道你刚刚迫使我做了什么吗！",
      {
        text: "我竟成了你$1的共犯！",
        1: mandate
      },
      "而这么一来，你……赢了？",
      {
        text: "这场$1的挣扎……",
        background: flashCelestial,
        1: forever,
      }, {
        text: "这场$1……",
        background: flashCelestial,
        1: battle,
      }, {
        text: "终于有了胜者。",
        background: flashCelestial,
      }, {
        text: "那不可逆的……$1。",
        background: flashCelestial,
        1: mandate,
      }, {
        text: "属于$1的。", 1: destroyer,
        background: flashCelestial,
      }, {
        text: "希望你满意。",
        background: flashCelestial,
      }, {
        text: "你把我们全都推入了末日。",
        background: flashCelestial,
      },
    ],
  },
};
