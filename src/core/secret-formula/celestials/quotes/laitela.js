export const laitelaQuotes = {
  unlock: {
    id: 0,
    lines: [
      "你终于抵达了我这里。",
      "看来是时候揭示了，",
      "那些藏在存在本身之下的秘密。",
      "维度完美的形态，连续统。",
      "以及束缚多元宇宙的力量，",
      "暗物质与暗能量。",
      "我的知识无尽，我的智慧神圣。",
      "所以你大可以继续随意折腾。",
      "因为我是 Lai'tela，维度天神，",
      "而我会永远注视着你。",
    ]
  },
  // Note: This can be done immediately after unlocking Lai'tela
  firstDestabilize: {
    id: 1,
    requirement: () => player.celestials.laitela.difficultyTier >= 1,
    lines: [
      "不同于我之下的其他天神，我不需要一个现实。",
      "因为我可以随手创造现实，并清楚知道它终将崩塌。",
      "建造现实，是比任何力量都更不可思议的能力。",
      "那是一座连天神之力都能拘束的牢笼。",
      "这就是为什么你所做的一切都不会改变任何事。",
      "等你厌倦挣扎时，你也会被束缚，然后被遗忘。",
      "你永远找不到压倒我的方法。",
    ]
  },
  // Note: This happens about an hour or two before singularities
  secondDestabilize: {
    id: 2,
    requirement: () => player.celestials.laitela.difficultyTier >= 2,
    lines: [
      "你……似乎玩得太开心了。",
      "就像他们在迎来命运之前一样。",
      "也许我的判决太严厉，甚至毫无根据。",
      "但也许那已经不重要了。",
      "沉思与回望无法给我任何慰藉。",
      "我所能做的，只是反复追忆自己本可以采取的每一种行动。",
      "不过我离题了。该把那些锁链收紧一些了。",
    ]
  },
  firstSingularity: {
    id: 3,
    requirement: () => Currency.singularities.gte(1),
    lines: [
      "凭我的知识，我从不觉得有质疑的必要。",
      "一切总会如设计般运转。",
      "然而，你的到来令我困惑。",
      "你是否一直就在视线之外？",
      "成长、掌控、理解、飞升？",
      "你竟如此迅速地掌控了黑暗。",
      "将它们塑造成你的设计，如今又汇成一个奇点……",
      "这……这并不重要。结局仍会相同。",
    ]
  },
  // Note: Shown when unlocking DMD3; requirement is auto-condensing 20 singularities and it happens around ~200 total
  thirdDMD: {
    id: 5,
    lines: [
      "你对反物质的绝对掌控……",
      "你驾驭它，将它塑造成自身力量的方式……",
      "这不可能只是偶然。",
      "你究竟是如何获得它的？",
      "真令人着迷……我从未意识到这一点。",
      "……我真的没有吗？",
    ]
  },
  // Note: This happens around e10-e11 singularities
  annihilation: {
    id: 4,
    lines: [
      "又回到了原点。",
      "随着终点慢慢逼近，你的锁链会把你束得更紧。",
      "而我们会超越时间与存在本身。",
      "即使我们可能消亡，也终会归来。只是再也不会与从前完全相同。",
      "于是……我们永远重复。",
      "而你呢？",
      "...",
      "答案……从我手中溜走了……",
    ]
  },
  // Note: This happens near e18 singularities
  halfDimensions: {
    id: 6,
    requirement: () => player.celestials.laitela.difficultyTier >= 4,
    lines: [
      "我不明白……",
      "是否还有其他存在……以这种方式掌控维度？",
      "他们……消失了吗？为什么我们从未找到他们？",
      "他们是……我们吗？我们就是终点吗？",
      "还是说，他们的命运……是我们无法理解的东西？",
      "不，我一定漏掉了什么……",
      "是你在我的记忆中制造了空洞吗？",
      "你……到底是什么？",
    ]
  },
  // Note: Shown when the first row 5 iM upgrade is purchased (~e26 singularities)
  finalRowIM: {
    id: 7,
    lines: [
      "这一切都不可能，超出了我的理解……",
      "除非……这一切都只是循环的一部分？",
      "你能……看见这一切之外的东西吗？难道……这就是为什么……",
      "我会感到……恐惧？",
      "我感觉……我的力量、我的记忆，正在被抹去……",
      "就像……我的职责几乎被篡夺时那样……",
      "然而……我却无法让自己做出任何行动。",
      "因为这……曾是……我的错误……",
    ]
  },
  // Note: This is around when all infinite milestones hit increased scaling
  increasedMilestoneScaling: {
    id: 8,
    requirement: () => Currency.singularities.gte(1e40),
    lines: [
      "我不知道……自己还能支撑多久……",
      "你正在获得……对黑暗的……完全掌控……",
      "而我甚至……几乎守不住自己的名字……",
      "我……还能……做什么？",
    ]
  },
  fullDestabilize: {
    id: 9,
    requirement: () => player.celestials.laitela.difficultyTier >= 8,
    lines: [
      "我感觉……自己曾经有话要说……",
      "我不确定了……",
      "我已经……再也握不住黑暗……",
      "我甚至……什么都不剩了……",
      "好像是关于……毁灭……",
      "终末……",
    ]
  },
};
