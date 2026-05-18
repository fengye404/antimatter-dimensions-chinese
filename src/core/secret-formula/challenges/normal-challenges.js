import { DC } from "../../constants";

// I tried to make it relatively simple to add more locks; the idea is that you give it a value here
// and then it's all handled in the backend
// If you need to lock a challenge, set lockedAt to a new Decimal variable reflective of a desired number of Infinities
// They will always be unlocked post-eternity

export const normalChallenges = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    description() {
      return PlayerProgress.eternityUnlocked()
        ? "在挑战外首次到达无限。"
        : "首次到达无限。";
    },
    name: "第 1 反物质维度自动购买器",
    reward: "可升级的第 1 反物质维度自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 2,
    legacyId: 2,
    isQuickResettable: false,
    description:
      () => "购买反物质维度或计数频率升级会暂停所有反物质维度的生产。" +
      `生产会在 ${formatInt(3)} 分钟内逐渐恢复正常。`,
    name: "第 2 反物质维度自动购买器",
    reward: "可升级的第 2 反物质维度自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 3,
    legacyId: 3,
    isQuickResettable: false,
    description:
      `第 1 反物质维度被大幅削弱，但会获得一个无上限且指数增长的倍率。
        该倍率会在维度提升和反物质星系后重置。`,
    name: "第 3 反物质维度自动购买器",
    reward: "可升级的第 3 反物质维度自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    description: "购买一个反物质维度会自动清除所有更低层级的反物质维度，" +
      "相当于一次没有倍率收益的牺牲。",
    name: "第 4 反物质维度自动购买器",
    reward: "可升级的第 4 反物质维度自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description:
      () => `计数频率购买倍率从 ${formatX(1.080, 0, 3)} 开始，而不是 ${formatX(1.1245, 0, 3)}。`,
    name: "第 5 反物质维度自动购买器",
    reward: "可升级的第 5 反物质维度自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    description: () => `升级每个反物质维度时，消耗的是低 ${formatInt(2)} 层的反物质维度，` +
      "而不是反物质。反物质维度价格也会改变。",
    name: "第 6 反物质维度自动购买器",
    reward: "可升级的第 6 反物质维度自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: () =>
      `购买 ${formatInt(10)} 个反物质维度获得的倍率降为 ${formatX(1)}。每次维度提升会使它增加
        ${formatX(0.2, 1, 1)}，最高 ${formatX(2)}，且不受任何升级影响。`,
    name: "第 7 反物质维度自动购买器",
    reward: "可升级的第 7 反物质维度自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    description: `维度提升不提供倍率，且无法购买反物质星系。维度牺牲会重置反物质和所有反物质维度，
      但会提供显著更强的倍率。`,
    name: "第 8 反物质维度自动购买器",
    reward: "可升级的第 8 反物质维度自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 9,
    legacyId: 5,
    isQuickResettable: true,
    description: () => `每当你购买计数频率升级或 ${formatInt(10)} 个某一反物质维度时，` +
      "所有价格相同的其他项目都会提升到下一档价格。",
    name: "计数频率自动购买器",
    reward: "可升级的计数频率自动购买器",
    lockedAt: DC.D0,
  },
  {
    id: 10,
    legacyId: 4,
    isQuickResettable: false,
    description: () => `只有 ${formatInt(6)} 个反物质维度。维度提升` +
      "和反物质星系的价格会改变。",
    name: "自动维度提升",
    reward: "维度提升自动购买器",
    lockedAt: DC.D16,
  },
  {
    id: 11,
    legacyId: 12,
    isQuickResettable: true,
    description: () => `当你拥有至少 ${formatInt(1)} 个第 2 反物质维度后，普通物质会开始增长。` +
      "如果普通物质超过反物质，就会触发一次不给予加成的维度提升。",
    name: "自动反物质星系",
    reward: "反物质星系自动购买器",
    lockedAt: DC.D16,
  },
  {
    id: 12,
    legacyId: 7,
    isQuickResettable: false,
    description: () => `每个反物质维度会生产低 ${formatInt(2)} 层的维度，而不是低 ${formatInt(1)} 层。
      第 1 和第 2 反物质维度都会生产反物质。第 2、第 4、第 6 维度会变强作为补偿。`,
    name: "自动大坍缩",
    reward: "大坍缩自动购买器",
    lockedAt: DC.D16,
  }
];
