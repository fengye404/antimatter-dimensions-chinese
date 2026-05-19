import { DC } from "../../constants";

export const infinityChallenges = [
  {
    id: 1,
    description: `除时间间隔（C9）和大坍缩（C12）挑战外，所有普通挑战限制会同时生效。`,
    goal: DC.E650,
    isQuickResettable: true,
    reward: {
      description: () => `每完成一个无限挑战，所有无限维度获得 ${formatX(1.3, 1, 1)} 倍率`,
      effect: () => Math.pow(1.3, InfinityChallenges.completed.length),
      formatEffect: value => formatX(value, 1, 1)
    },
    unlockAM: DC.E2000,
  },
  {
    id: 2,
    description: () => `拥有第 8 反物质维度后，每隔 ${formatInt(400)} 毫秒会自动进行一次维度牺牲。`,
    goal: DC.E10500,
    isQuickResettable: false,
    reward: {
      description: () => `解锁维度牺牲自动购买器，并增强维度牺牲效果：
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": false })} ➜
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": true })}`,
    },
    unlockAM: DC.E11000,
  },
  {
    id: 3,
    description: () =>
      `时间间隔升级的效果始终为 ${formatX(1)}。每购买一次时间间隔升级，改为获得一个作用于所有反物质维度的固定倍率；
      该倍率会随反物质星系数量提高。`,
    goal: DC.E5000,
    isQuickResettable: false,
    effect: () => Decimal.pow(1.05 + (player.galaxies * 0.005), player.totalTickBought),
    formatEffect: value => formatX(value, 2, 2),
    reward: {
      description: `基于反物质星系和时间间隔购买次数提高反物质维度倍率`,
      effect: () => (Laitela.continuumActive
        ? Decimal.pow(1.05 + (player.galaxies * 0.005), Tickspeed.continuumValue)
        : Decimal.pow(1.05 + (player.galaxies * 0.005), player.totalTickBought)),
      formatEffect: value => formatX(value, 2, 2),
    },
    unlockAM: DC.E12000,
  },
  {
    id: 4,
    description: () =>
      `只有最近购买的反物质维度会正常生产，其他反物质维度的产量会降低（${formatPow(0.25, 2, 2)}）。`,
    goal: DC.E13000,
    isQuickResettable: true,
    effect: 0.25,
    reward: {
      description: () => `所有反物质维度倍率变为原倍率${formatPow(1.05, 2, 2)}`,
      effect: 1.05
    },
    unlockAM: DC.E14000,
  },
  {
    id: 5,
    description:
      `购买第 1 至第 4 反物质维度会提高所有更低阶维度的花费。
      购买第 5 至第 8 反物质维度会提高所有更高阶维度的花费。`,
    goal: DC.E16500,
    isQuickResettable: true,
    reward: {
      description: () =>
        `所有星系增强 ${formatPercents(0.1)}，并使星系和维度提升的需求降低 ${formatInt(1)}`,
      effect: 1.1
    },
    unlockAM: DC.E18000,
  },
  {
    id: 6,
    description: () =>
      `拥有至少 ${formatInt(1)} 个第 2 反物质维度后，指数增长的物质会削减所有反物质维度的倍率。`,
    goal: DC.D2E22222,
    isQuickResettable: true,
    effect: () => Currency.matter.value.clampMin(1),
    formatEffect: value => `/${format(value, 1, 2)}`,
    reward: {
      description: "基于维度生产频率提高无限维度倍率",
      effect: () => Tickspeed.perSecond.pow(0.0005),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: DC.E22500,
  },
  {
    id: 7,
    description: () => {
      // Copied from DimBoost.power; this is the base amount before any multipliers. Post-eternity this isn't
      // necessarily 2.5x by the time the player sees this challenge; it's probably most accurate to say what it
      // currently is, and this phrasing avoids 10x ➜ 10x with the old description.
      const mult = Effects.max(
        2,
        InfinityUpgrade.dimboostMult,
        InfinityChallenge(7).reward,
        TimeStudy(81)
      );
      return `你不能购买反物质星系。基础维度提升倍率最高提高到 ${formatX(10)}。
        （当前基础倍率：${formatX(mult, 2, 1)}）`;
    },
    goal: DC.E10000,
    isQuickResettable: false,
    effect: 10,
    reward: {
      description: () => `维度提升倍率至少提高到 ${formatX(4)}`,
      effect: 4
    },
    unlockAM: DC.E23000,
  },
  {
    id: 8,
    description: () =>
      `反物质维度产量会随时间快速持续下降。购买反物质维度或时间间隔升级会把产量恢复到 ${formatPercents(1)}，
        随后再次开始下降。`,
    goal: DC.E27000,
    isQuickResettable: true,
    effect: () => DC.D0_8446303389034288.pow(
      Math.max(0, player.records.thisInfinity.time - player.records.thisInfinity.lastBuyTime)),
    reward: {
      description:
        "基于第 1 和第 8 反物质维度倍率，提高第 2 至第 7 反物质维度倍率。",
      effect: () => AntimatterDimension(1).multiplier.times(AntimatterDimension(8).multiplier).pow(0.02),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: DC.E28000,
  },
];
