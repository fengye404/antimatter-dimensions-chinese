export const enslaved = {
  // These entries will be unlocked in no particular order
  progress: {
    hintsUnlocked: {
      id: 0,
      hint: "无名之辈想帮你，但它们的提示需要时间浮现。",
      condition: () => `在该现实中花费超过 ${formatInt(5)} 小时真实时间且没有完成它；
        现实外的时间按 ${formatPercents(0.4)} 计入。计时会在该现实解锁后开始，并持续累计。`,
    },
    ec1: {
      id: 1,
      hint: "奇怪，自动完成永恒挑战的特权好像在这里不太听话。",
      condition: () => `一次性获得超过 ${formatInt(5)} 次永恒挑战 1 完成次数`,
    },
    feelEternity: {
      id: 2,
      hint: "这个现实里的无限比平时更破碎，但它真的还能被修好吗？",
      condition: "尝试修复无限时，找到并点击“感受永恒”按钮",
    },
    ec6: {
      id: 3,
      hint: `有些挑战会更难，但也会补偿性地增强某些东西。这里会不会有一个挑战反而比正常状态更划算？`,
      condition: () => `完成永恒挑战 6 达 ${formatInt(5)} 次后再次进入它，以利用更便宜的复制器星系`,
    },
    c10: {
      id: 4,
      hint: "不用第 8 反物质维度，也能拿到反物质星系吗？",
      condition: "利用挑战 10，只靠第 6 反物质维度获得超过 1 个反物质星系",
    },
    secretStudy: {
      id: 5,
      hint: "时间研究 12？那是什么？",
      condition: () => `点击秘密时间研究并额外获得 ${formatInt(100)} 个时间定理`,
    },
    storedTime: {
      id: 6,
      hint: "如果等得足够久，这个现实的某些限制似乎会被磨损掉。",
      condition: "释放黑洞后，本次现实中的游戏时间超过一年",
    },
    challengeCombo: {
      id: 7,
      hint: "能不能用一个挑战绕开另一个挑战的限制？",
      condition: "在永恒挑战 6 中进入挑战 10",
    },
  },
  // These get unlocked sequentially
  glyphHints: [
    "无限和膨胀符文在这里被限制得太死，几乎派不上用场。",
    "力量和时间符文在这里尤其强。",
    `Effarig 符文只有配到合适效果时才有用，但没有它也能完成这个现实。
      复制符文很有帮助，不过并非必需，也没有力量和时间符文那么强。`
  ]
};
