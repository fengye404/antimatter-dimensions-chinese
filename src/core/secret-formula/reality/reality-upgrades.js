import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.reality.rebuyables[props.id],
    1e30,
    props.initialCost,
    props.costMult,
    props.costMult / 10,
    DC.E309,
    1e3,
    props.initialCost * props.costMult
  );
  const { effect } = props;
  props.effect = () => Math.pow(
    effect + ImaginaryUpgrade(props.id).effectOrDefault(0),
    player.reality.rebuyables[props.id] * getAdjustedGlyphEffect("realityrow1pow"));
  props.description = () => props.textTemplate.replace("{value}",
    ImaginaryUpgrade(props.id).effectValue === 0
      ? formatInt(effect)
      : format(effect + ImaginaryUpgrade(props.id).effectValue, 2, 2));
  props.formatEffect = value => formatX(value, 2, 0);
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const realityUpgrades = [
  rebuyable({
    name: "时间放大器",
    id: 1,
    initialCost: 1,
    costMult: 30,
    textTemplate: "膨胀时间获取速度变为 {value} 倍",
    effect: 3
  }),
  rebuyable({
    name: "复制放大器",
    id: 2,
    initialCost: 1,
    costMult: 30,
    textTemplate: "复制品增长速度变为 {value} 倍",
    effect: 3
  }),
  rebuyable({
    name: "永恒放大器",
    id: 3,
    initialCost: 2,
    costMult: 30,
    textTemplate: "永恒次数获取变为 {value} 倍",
    effect: 3
  }),
  rebuyable({
    name: "超光速放大器",
    id: 4,
    initialCost: 2,
    costMult: 30,
    textTemplate: "快子粒子获取变为 {value} 倍",
    effect: 3
  }),
  rebuyable({
    name: "无界放大器",
    id: 5,
    initialCost: 3,
    costMult: 50,
    textTemplate: "无限次数获取变为 {value} 倍",
    effect: 5
  }),
  {
    name: "宇宙级复制",
    id: 6,
    cost: 15,
    requirement: "首次手动永恒时，不使用复制品星系",
    // Note that while noRG resets on eternity, the reality-level check will be false after the first eternity.
    // The noRG variable is eternity-level as it's also used for an achievement check
    hasFailed: () => !(player.requirementChecks.eternity.noRG && player.requirementChecks.reality.noEternities),
    checkRequirement: () => player.requirementChecks.eternity.noRG && player.requirementChecks.reality.noEternities,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    lockEvent: "获得复制品星系",
    description: "复制品速度基于复制品星系数量获得倍率",
    effect: () => 1 + Replicanti.galaxies.total / 50,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "不可数构造",
    id: 7,
    cost: 15,
    requirement: "首次无限时最多拥有 1 个反物质星系",
    hasFailed: () => !(player.galaxies <= 1 && player.requirementChecks.reality.noInfinities),
    checkRequirement: () => player.galaxies <= 1 && player.requirementChecks.reality.noInfinities,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    canLock: true,
    lockEvent: "再获得一个反物质星系",
    description: "无限次数获取基于反物质星系数量获得加成",
    effect: () => 1 + player.galaxies / 30,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "悖论式达成",
    id: 8,
    cost: 15,
    requirement: "手动永恒，且过程中不自动获得任何成就",
    hasFailed: () => player.reality.gainedAutoAchievements,
    checkRequirement: () => !player.reality.gainedAutoAchievements,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    // We don't have lockEvent because the modal can never show up for this upgrade
    description: "快子粒子获取基于成就倍率获得加成",
    effect: () => Math.sqrt(Achievements.power),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "语义扩展",
    id: 9,
    cost: 15,
    requirement: () => `只装备一个等级 ${formatInt(3)}+ 的符文，并在 ${format("1e4000")} 永恒点数时永恒。`,
    hasFailed: () => {
      const invalidEquippedGlyphs = Glyphs.activeWithoutCompanion.length > 1 ||
        (Glyphs.activeWithoutCompanion.length === 1 && Glyphs.activeWithoutCompanion[0].level < 3);
      const hasValidGlyphInInventory = Glyphs.inventory.countWhere(g => g && g.level >= 3) > 0;
      return invalidEquippedGlyphs || (Glyphs.activeWithoutCompanion.length === 0 && !hasValidGlyphInInventory);
    },
    checkRequirement: () => Currency.eternityPoints.exponent >= 4000 &&
      Glyphs.activeWithoutCompanion.length === 1 && Glyphs.activeWithoutCompanion[0].level >= 3,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    // There are two locking events - equipping a glyph with too low a level, and equipping a second glyph
    description: "额外获得一个符文槽",
    effect: () => 1
  },
  {
    name: "存在延续",
    id: 10,
    cost: 15,
    requirement: () => `首次手动永恒时至少拥有 ${formatPostBreak(DC.E400)} 无限点数`,
    hasFailed: () => !player.requirementChecks.reality.noEternities,
    checkRequirement: () => Currency.infinityPoints.exponent >= 400 &&
      player.requirementChecks.reality.noEternities,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    lockEvent: "永恒",
    bypassLock: () => Currency.infinityPoints.exponent >= 400,
    description: () => `每次现实从 ${formatInt(100)} 次永恒开始（也会立即作用于当前现实）`,
    automatorPoints: 15,
    shortDescription: () => `开局 ${formatInt(100)} 次永恒`,
    effect: () => 100
  },
  {
    name: "无界流动",
    id: 11,
    cost: 50,
    requirement: () => `${format(Currency.infinitiesBanked.value, 2)}/${format(DC.E12)} 已储存无限次数`,
    checkRequirement: () => Currency.infinitiesBanked.exponent >= 12,
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_FIRST_UNLOCKED],
    description: "每秒获得一次正常无限可获得无限次数的 10%",
    automatorPoints: 5,
    shortDescription: () => `持续生成无限次数`,
    effect: () => gainedInfinities().times(0.1),
    formatEffect: value => `${format(value)}/秒`
  },
  {
    name: "知晓存在",
    id: 12,
    cost: 50,
    requirement: () => `不完成永恒挑战 1，并在 ${format(DC.E70)} 永恒点数时永恒`,
    hasFailed: () => EternityChallenge(1).completions !== 0,
    checkRequirement: () => Currency.eternityPoints.exponent >= 70 && EternityChallenge(1).completions === 0,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: "完成永恒挑战 1",
    description: "永恒点数基于现实次数和时间定理数量获得倍率",
    effect: () => Currency.timeTheorems.value
      .minus(DC.E3).clampMin(2)
      .pow(Math.log2(Math.min(Currency.realities.value, 1e4))).clampMin(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "远程机械流程",
    id: 13,
    cost: 50,
    requirement: () => `不购买第 5-8 时间维度，并在 ${format(DC.E4000)} 永恒点数时永恒`,
    hasFailed: () => !Array.range(5, 4).every(i => TimeDimension(i).amount.equals(0)),
    checkRequirement: () => Currency.eternityPoints.exponent >= 4000 &&
      Array.range(5, 4).every(i => TimeDimension(i).amount.equals(0)),
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: "购买第 5 时间维度或更高时间维度",
    description: () => `强化永恒自动购买器，并解锁时间维度与 ${formatX(5)} 永恒点数自动购买器`,
    automatorPoints: 10,
    shortDescription: () => `时间维度与 ${formatX(5)} 永恒点数自动购买器，强化永恒自动购买器`,
  },
  {
    name: "永恒流动",
    id: 14,
    cost: 50,
    requirement: () => `${format(Currency.eternities.value, 2)}/${format(1e7)} 次永恒`,
    checkRequirement: () => Currency.eternities.gte(1e7),
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_FIRST_UNLOCKED],
    description: "每秒获得等同于现实次数的永恒次数",
    automatorPoints: 5,
    shortDescription: () => `持续生成永恒次数`,
    effect: () => Currency.realities.value * Ra.unlocks.continuousTTBoost.effects.eternity.effectOrDefault(1),
    formatEffect: value => `${format(value)}/秒`
  },
  {
    name: "悖论永续",
    id: 15,
    cost: 50,
    requirement: () => `不购买 ${formatX(5)} 永恒点数升级，并拥有 ${format(DC.E10)} 永恒点数`,
    hasFailed: () => player.epmultUpgrades !== 0,
    checkRequirement: () => Currency.eternityPoints.exponent >= 10 && player.epmultUpgrades === 0,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: () => `购买 ${formatX(5)} 永恒点数升级`,
    description: () => `快子粒子获取基于 ${formatX(5)} 永恒点数倍率获得加成`,
    effect: () => Math.max(Math.sqrt(Decimal.log10(EternityUpgrade.epMult.effectValue)) / 9, 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "稀有度落差",
    id: 16,
    cost: 1500,
    requirement: () => `装备 ${formatInt(4)} 个罕见或更高稀有度的符文后进行现实
      （已装备 ${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && g.strength >= 1.5))} 个）`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && g.strength >= 1.5);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => g.strength >= 1.5);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => g.strength >= 1.5) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "改善符文稀有度公式",
    effect: 1.3,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "效能二重性",
    id: 17,
    cost: 1500,
    requirement: () => `装备 ${formatInt(4)} 个至少拥有 ${formatInt(2)} 条效果的符文后进行现实
      （已装备 ${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && countValuesFromBitmask(g.effects) >= 2))}
      个）`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && countValuesFromBitmask(g.effects) >= 2);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => countValuesFromBitmask(g.effects) >= 2);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => countValuesFromBitmask(g.effects) >= 2) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: () => `符文有 ${formatPercents(0.5)} 概率额外获得一条效果`,
    effect: 0.5,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "永恒尺度",
    id: 18,
    cost: 1500,
    requirement: () => `装备 ${formatInt(4)} 个等级至少为 ${formatInt(10)} 的符文后进行现实
      （已装备 ${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && g.level >= 10))} 个）`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && g.level >= 10);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => g.level >= 10);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => g.level >= 10) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "永恒次数提高符文等级",
    effect: () => Math.max(Math.sqrt(Currency.eternities.value.plus(1).log10()) * 0.45, 1),
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "净化以赋能",
    id: 19,
    cost: 1500,
    requirement: () => `同时拥有至少 ${formatInt(30)} 个符文
      （当前 ${formatInt(Glyphs.allGlyphs.countWhere(g => g.type !== "companion"))} 个）`,
    hasFailed: () => Glyphs.allGlyphs.countWhere(g => g.type !== "companion") < 30,
    checkRequirement: () => Glyphs.allGlyphs.countWhere(g => g.type !== "companion") >= 30,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "可以献祭符文来获得永久加成（按住上档键点击）",
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "奇点对称",
    id: 20,
    cost: 1500,
    requirement: () => `解锁黑洞后累计游玩 ${formatInt(100)} 天
      （当前：${Time.timeSinceBlackHole.toStringShort(false)}）`,
    hasFailed: () => !BlackHole(1).isUnlocked && Currency.realityMachines.lt(100),
    checkRequirement: () => Time.timeSinceBlackHole.totalDays >= 100 && BlackHole(1).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "解锁第二个黑洞",
    automatorPoints: 10,
    shortDescription: () => `第二个黑洞`,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "宇宙聚合体",
    id: 21,
    cost: 100000,
    requirement: () => `${formatInt(Replicanti.galaxies.total + player.galaxies +
      player.dilation.totalTachyonGalaxies)}/${formatInt(2800)} 各类星系总数`,
    checkRequirement: () =>
      Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies >= 2800,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `极远反物质星系缩放推迟到 ${formatInt(1e5)} 个星系后开始`,
    effect: 1e5
  },
  {
    name: "时间超越",
    id: 22,
    cost: 100000,
    requirement: () => `${format(Currency.timeShards.value, 1)}/${format(DC.E28000)} 时间碎片`,
    checkRequirement: () => Currency.timeShards.exponent >= 28000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "时间维度基于本次现实经过天数获得倍率",
    effect: () => Decimal.pow10(Math.pow(1 + 2 * Math.log10(Time.thisReality.totalDays + 1), 1.6)),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "复制疾速",
    id: 23,
    cost: 100000,
    requirement: () => `在 ${formatInt(15)} 分钟游戏时间内完成现实
      （最快：${Time.bestReality.toStringShort()}）`,
    hasFailed: () => Time.thisReality.totalMinutes >= 15,
    checkRequirement: () => Time.thisReality.totalMinutes < 15,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "复制品速度基于最快游戏时间现实获得加成",
    effect: () => 15 / Math.clamp(Time.bestReality.totalMinutes, 1 / 12, 15),
    cap: 180,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "合成符号学",
    id: 24,
    cost: 100000,
    requirement: () => `不装备符文，并以 ${formatInt(5000)} 现实机器完成现实`,
    hasFailed: () => Glyphs.activeWithoutCompanion.length > 0,
    checkRequirement: () => MachineHandler.gainedRealityMachines.gte(5000) &&
      Glyphs.activeWithoutCompanion.length === 0,
    canLock: true,
    lockEvent: "装备非伙伴符文",
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "额外获得一个符文槽",
    effect: () => 1
  },
  {
    name: "无费存在",
    id: 25,
    cost: 100000,
    requirement: () => `达到 ${format(DC.E11111)} 永恒点数（最佳：${format(player.records.bestReality.bestEP, 2)} 永恒点数）`,
    checkRequirement: () => player.records.bestReality.bestEP.exponent >= 11111,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    description: "解锁现实自动购买器和自动机命令",
    automatorPoints: 100,
    shortDescription: () => `现实自动购买器`,
  },
];
