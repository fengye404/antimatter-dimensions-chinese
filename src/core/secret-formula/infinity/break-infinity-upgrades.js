import { DC } from "../../constants";

function rebuyable(config) {
  const effectFunction = config.effect || (x => x);
  const { id, maxUpgrades, description, isDisabled, noLabel, onPurchased } = config;
  return {
    rebuyable: true,
    id,
    cost: () => config.initialCost * Math.pow(config.costIncrease, player.infinityRebuyables[config.id]),
    maxUpgrades,
    description,
    effect: () => effectFunction(player.infinityRebuyables[config.id]),
    isDisabled,
    // There isn't enough room in the button to fit the EC reduction and "Next:" at the same time while still
    // presenting all the information in an understandable way, so we only show it if the upgrade is maxed
    formatEffect: config.formatEffect ||
      (value => {
        const afterECText = config.afterEC ? config.afterEC() : "";
        return value === config.maxUpgrades
          ? `当前：${formatX(10 - value)} ${afterECText}`
          : `当前：${formatX(10 - value)} | 下一级：${formatX(10 - value - 1)}`;
      }),
    formatCost: value => format(value, 2, 0),
    noLabel,
    onPurchased
  };
}

export const breakInfinityUpgrades = {
  totalAMMult: {
    id: "totalMult",
    cost: 1e4,
    description: "反物质维度获得基于历史总产出反物质的倍率",
    effect: () => Math.pow(player.records.totalAntimatter.exponent + 1, 0.5),
    formatEffect: value => formatX(value, 2, 2)
  },
  currentAMMult: {
    id: "currentMult",
    cost: 5e4,
    description: "反物质维度获得基于当前反物质数量的倍率",
    effect: () => Math.pow(Currency.antimatter.exponent + 1, 0.5),
    formatEffect: value => formatX(value, 2, 2)
  },
  galaxyBoost: {
    id: "postGalaxy",
    cost: 5e11,
    description: () => `所有星系效果提高 ${formatPercents(0.5)}`,
    effect: 1.5
  },
  infinitiedMult: {
    id: "infinitiedMult",
    cost: 1e5,
    description: "反物质维度获得基于无限次数的倍率",
    effect: () => 1 + Currency.infinitiesTotal.value.pLog10() * 10,
    formatEffect: value => formatX(value, 2, 2)
  },
  achievementMult: {
    id: "achievementMult",
    cost: 1e6,
    description: "反物质维度获得基于已完成成就数量的倍率",
    effect: () => Math.max(Math.pow((Achievements.effectiveCount - 30), 3) / 40, 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  slowestChallengeMult: {
    id: "challengeMult",
    cost: 1e7,
    description: "反物质维度获得基于最慢挑战通关速度的倍率",
    effect: () => Decimal.clampMin(50 / Time.worstChallenge.totalMinutes, 1),
    formatEffect: value => formatX(value, 2, 2),
    hasCap: true,
    cap: DC.D3E4
  },
  infinitiedGen: {
    id: "infinitiedGeneration",
    cost: 2e7,
    description: "根据最快无限用时被动获得无限次数",
    effect: () => player.records.bestInfinity.time,
    formatEffect: value => {
      if (value === Number.MAX_VALUE && !Pelle.isDoomed) return "尚未产生无限次数";
      let infinities = DC.D1;
      infinities = infinities.timesEffectsOf(
        RealityUpgrade(5),
        RealityUpgrade(7),
        Ra.unlocks.continuousTTBoost.effects.infinity
      );
      infinities = infinities.times(getAdjustedGlyphEffect("infinityinfmult"));
      const timeStr = Time.bestInfinity.totalMilliseconds <= 50
        ? `${TimeSpan.fromMilliseconds(100).toStringShort()}（已达上限）`
        : `${Time.bestInfinity.times(2).toStringShort()}`;
      return `每 ${timeStr} 获得 ${format(infinities, 2, 2)} 次无限`;
    }
  },
  autobuyMaxDimboosts: {
    id: "autobuyMaxDimboosts",
    cost: 5e9,
    description: "解锁维度提升自动购买器的“购买最大”模式"
  },
  autobuyerSpeed: {
    id: "autoBuyerUpgrade",
    cost: 1e15,
    description: "普通挑战解锁或强化的自动购买器速度翻倍"
  },
  tickspeedCostMult: rebuyable({
    id: 0,
    initialCost: 1e6,
    costIncrease: 5,
    maxUpgrades: 8,
    description: "降低无限后的时间间隔升级花费倍率增长",
    afterEC: () => (EternityChallenge(11).completions > 0
      ? `EC11 后：${formatX(Player.tickSpeedMultDecrease, 2, 2)}`
      : ""
    ),
    noLabel: true,
    onPurchased: () => GameCache.tickSpeedMultDecrease.invalidate()
  }),
  dimCostMult: rebuyable({
    id: 1,
    initialCost: 1e7,
    costIncrease: 5e3,
    maxUpgrades: 7,
    description: "降低无限后的反物质维度花费倍率增长",
    afterEC: () => (EternityChallenge(6).completions > 0
      ? `EC6 后：${formatX(Player.dimensionMultDecrease, 2, 2)}`
      : ""
    ),
    noLabel: true,
    onPurchased: () => GameCache.dimensionMultDecrease.invalidate()
  }),
  ipGen: rebuyable({
    id: 2,
    initialCost: 1e7,
    costIncrease: 10,
    maxUpgrades: 10,
    effect: value => Player.bestRunIPPM.times(value / 20),
    description: () => {
      let generation = `生成最快无限收益的 ${formatInt(5 * player.infinityRebuyables[2])}%`;
      if (!BreakInfinityUpgrade.ipGen.isCapped) {
        generation += ` ➜ ${formatInt(5 * (1 + player.infinityRebuyables[2]))}%`;
      }
      return `${generation}，基准为最近 10 次无限中的最佳 IP/分钟`;
    },
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${format(value, 2, 1)} IP/min`,
    noLabel: false
  })
};
