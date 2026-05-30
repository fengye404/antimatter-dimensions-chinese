import { DC } from "../../constants";
import wordShift from "../../word-shift";

export const pelleRifts = {
  vacuum: {
    id: 1,
    key: "vacuum",
    name: ["真空", "空洞", "虚空"],
    drainResource: "IP",
    baseEffect: x => `IP 获取 ${formatX(x, 2, 2)}`,
    additionalEffects: () => [PelleRifts.vacuum.milestones[2]],
    strike: () => PelleStrikes.infinity,
    percentage: totalFill => Math.log10(totalFill.plus(1).log10() * 10 + 1) ** 2.5 / 100,
    percentageToFill: percentage => Decimal.pow(10,
      Decimal.pow(10, (percentage * 100) ** (1 / 2.5)).div(10).minus(0.1)
    ).minus(1),
    effect: totalFill => {
      if (player.challenge.eternity.current !== 0) {
        const chall = EternityChallenge.current;
        const goal = chall.goalAtCompletions(chall.gainedCompletionStatus.totalCompletions);
        return totalFill.plus(1).pow(0.1).min(goal.pow(0.15));
      }
      return totalFill.plus(1).pow(0.33);
    },
    currency: () => Currency.infinityPoints,
    galaxyGeneratorThreshold: 1000,
    milestones: [
      {
        resource: "vacuum",
        requirement: 0.04,
        description: "你可以装备 1 个等级和稀有度降低的基础符文"
      },
      {
        resource: "vacuum",
        requirement: 0.06,
        description: () => `移除复制器上限，并使复制器解锁与升级便宜 ${formatX(1e130)}`,
        effect: () => 1e130
      },
      {
        resource: "vacuum",
        requirement: 0.4,
        description: () => `${wordShift.wordCycle(PelleRifts.vacuum.name)}也会影响 EP 获取`,
        effect: () => Decimal.pow(4, PelleRifts.vacuum.totalFill.log10() / 2 / 308 + 3),
        formatEffect: x => `EP 获取 ${formatX(x, 2, 2)}`
      },
    ],
    galaxyGeneratorText: "剩余空间不足以容纳更多，你必须填满$value"
  },
  decay: {
    id: 2,
    key: "decay",
    name: ["衰变", "坍缩", "紊乱"],
    drainResource: "Replicanti",
    spendable: true,
    baseEffect: x => `复制器速度 ${formatX(x, 2, 2)}`,
    additionalEffects: () => [PelleRifts.decay.milestones[0], PelleRifts.decay.milestones[2]],
    strike: () => PelleStrikes.powerGalaxies,
    // 0 - 1
    percentage: totalFill => totalFill.plus(1).log10() * 0.05 / 100,
    // 0 - 1
    percentageToFill: percentage => Decimal.pow(10, 20 * percentage * 100).minus(1),
    effect: totalFill => (PelleRifts.chaos.milestones[0].canBeApplied
      ? Decimal.sqrt(2000 + 1) : Decimal.sqrt(totalFill.plus(1).log10() + 1)),
    currency: () => Currency.replicanti,
    galaxyGeneratorThreshold: 1e7,
    milestones: [
      {
        resource: "decay",
        requirement: 0.2,
        description: "第一个可重复 Pelle 升级也会影响第 1 无限维度",
        effect: () => {
          const x = player.celestials.pelle.rebuyables.antimatterDimensionMult;
          return Decimal.pow(1e50, x - 9);
        },
        formatEffect: x => `第 1 无限维度 ${formatX(x, 2, 2)}`
      },
      {
        resource: "decay",
        requirement: 0.6,
        description: () => `复制器超过 ${format(DC.E1300)} 后，
          所有星系效果提高 ${formatPercents(0.1)}`,
        effect: () => (Replicanti.amount.gt(DC.E1300) ? 1.1 : 1)
      },
      {
        resource: "decay",
        requirement: 1,
        description: "基于裂隙总里程碑数量提高复制器星系上限",
        effect: () => {
          const x = PelleRifts.totalMilestones();
          return x ** 2 - 2 * x;
        },
        formatEffect: x => `复制器星系上限 +${formatInt(x)}`
      },
    ],
    galaxyGeneratorText: "反物质不足以形成新的星系，你需要逆转$value"
  },
  chaos: {
    id: 3,
    key: "chaos",
    name: ["混沌", "失序", "杂质"],
    drainResource: ["衰变", "坍缩", "紊乱"],
    baseEffect: x => `时间维度 ${formatX(x, 2, 2)}`,
    strike: () => PelleStrikes.eternity,
    percentage: totalFill => totalFill / 10,
    percentageToFill: percentage => 10 * percentage,
    effect: totalFill => {
      const fill = totalFill > 6.5
        ? (totalFill - 6.5) / 7 + 6.5
        : totalFill;
      return Decimal.pow(6, Decimal.pow(6, Decimal.pow(6, fill / 10 + 0.1)).minus(6))
        .div(1e5)
        .plus(Decimal.pow(10, fill / 10 + 0.1));
    },
    currency: () => ({
      get value() {
        return PelleRifts.decay.percentage;
      },
      set value(val) {
        const spent = PelleRifts.decay.percentage - val;
        player.celestials.pelle.rifts.decay.percentageSpent += spent;
      }
    }),
    galaxyGeneratorThreshold: 1e9,
    milestones: [
      {
        resource: "chaos",
        requirement: 0.09,
        description: () => `${wordShift.wordCycle(PelleRifts.decay.name)}效果始终取最大值，里程碑始终生效`
      },
      {
        resource: "chaos",
        requirement: 0.15,
        description: "符文获得一条 Pelle 专属新效果",
      },
      {
        resource: "chaos",
        requirement: 1,
        description: () => `你每秒获得本次永恒 EP 获取量的 ${formatPercents(0.01)}`,
      },
    ],
    galaxyGeneratorText: "你的星系过于破碎，你必须稳定$value"
  },
  recursion: {
    id: 4,
    key: "recursion",
    name: ["递归", "离散", "毁灭"],
    drainResource: "EP",
    baseEffect: x => `EP 公式：log(x)/${formatInt(308)} ➜ log(x)/${formatFloat(308 - x.toNumber(), 2)}`,
    additionalEffects: () => [PelleRifts.recursion.milestones[0], PelleRifts.recursion.milestones[1]],
    strike: () => PelleStrikes.ECs,
    percentage: totalFill => totalFill.plus(1).log10() ** 0.4 / 4000 ** 0.4,
    percentageToFill: percentage => Decimal.pow(10, percentage ** 2.5 * 4000).minus(1),
    effect: totalFill => new Decimal(58 * totalFill.plus(1).log10() ** 0.2 / 4000 ** 0.2),
    currency: () => Currency.eternityPoints,
    galaxyGeneratorThreshold: 1e10,
    milestones: [
      {
        resource: "recursion",
        requirement: 0.10,
        description: "维度提升会基于永恒挑战完成数变得更强",
        effect: () => Math.max(100 * EternityChallenges.completions ** 2, 1) *
          Math.max(1e4 ** (EternityChallenges.completions - 40), 1),
        formatEffect: x => `维度提升强度 ${formatX(x, 2, 2)}`
      },
      {
        resource: "recursion",
        requirement: 0.15,
        description: "无限维度会基于永恒挑战完成数变得更强",
        effect: () => Decimal.pow("1e1500", ((EternityChallenges.completions - 25) / 20) ** 1.7).max(1),
        formatEffect: x => `无限维度 ${formatX(x)}`
      },
      {
        resource: "recursion",
        requirement: 1,
        description: "永久解锁星系发生器",
      },
    ],
    galaxyGeneratorText: "继续制造星系已不可持续，你必须聚焦$value才能容纳更多"
  },
  paradox: {
    id: 5,
    key: "paradox",
    name: ["悖论", "矛盾", "谬误"],
    drainResource: "膨胀时间",
    baseEffect: x => `所有维度 ${formatPow(x, 2, 3)}`,
    additionalEffects: () => [PelleRifts.paradox.milestones[2]],
    strike: () => PelleStrikes.dilation,
    percentage: totalFill => totalFill.plus(1).log10() / 100,
    percentageToFill: percentage => Decimal.pow10(percentage * 100).minus(1),
    effect: totalFill => new Decimal(1 + totalFill.plus(1).log10() * 0.004),
    currency: () => Currency.dilatedTime,
    galaxyGeneratorThreshold: 1e5,
    milestones: [
      {
        resource: "paradox",
        requirement: 0.15,
        description: "第 5-8 时间维度大幅降价，并解锁更多时间膨胀升级",
        // FIXME: Not a great solution
        onStateChange: () => {
          updateTimeDimensionCosts();
        }
      },
      {
        resource: "paradox",
        requirement: 0.25,
        description: () => `膨胀时间获取会使超光速粒子 ${formatPow(1.4, 1, 1)}`,
        effect: 1.4
      },
      {
        resource: "paradox",
        requirement: 0.5,
        description: "时间膨胀重复升级购买数会提高无限能量转化率",
        effect: () => Math.min(
          1.1075 ** (Object.values(player.dilation.rebuyables).sum() - 60),
          712
        ),
        formatEffect: x => `无限能量转化 ${formatX(x, 2, 2)}`
      },
    ],
    galaxyGeneratorText: "本应还能创造更多，但 Pelle 限制了你。无视$value"
  }
};
