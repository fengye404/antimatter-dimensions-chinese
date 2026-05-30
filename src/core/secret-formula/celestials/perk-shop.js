function rebuyableCost(initialCost, increment, id) {
  return initialCost * Math.pow(increment, player.celestials.teresa.perkShop[id]);
}
function rebuyable(config) {
  const { id, otherReq, cap, costCap, description, formatEffect, formatCost } = config;
  return {
    id,
    cost: () => (config.cost ? config.cost() : rebuyableCost(config.initialCost, config.increment, config.id)),
    otherReq,
    cap,
    costCap,
    description,
    effect: () => config.effect(player.celestials.teresa.perkShop[config.id]),
    formatEffect,
    formatCost,
    rebuyable: true
  };
}

export const perkShop = {
  glyphLevel: rebuyable({
    id: 0,
    initialCost: 1,
    increment: 2,
    description: () => `不稳定前的符文等级提高 ${formatPercents(0.05)}`,
    effect: bought => Math.pow(1.05, bought),
    formatEffect: value => formatX(value, 2, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048),
    cap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? Math.pow(1.05, 20) : Math.pow(1.05, 11))
  }),
  rmMult: rebuyable({
    id: 1,
    initialCost: 1,
    increment: 2,
    description: "现实机器获取翻倍",
    effect: bought => Math.pow(2, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048),
    cap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1048576 : 2048)
  }),
  bulkDilation: rebuyable({
    id: 2,
    initialCost: 100,
    increment: 2,
    description: "时间膨胀自动购买器每次购买的升级数量翻倍。",
    effect: bought => Math.pow(2, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1638400 : 1600),
    cap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 16384 : 16),
  }),
  autoSpeed: rebuyable({
    id: 3,
    initialCost: 1000,
    increment: 2,
    description: () => `无限维度、时间维度、时间膨胀和复制品自动购买器速度提高 ${formatX(2)}。`,
    effect: bought => Math.pow(2, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 64000 : 4000),
    cap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 64 : 4)
  }),
  musicGlyph: rebuyable({
    id: 4,
    description: () => `获得一个随机类型的音乐符文，等级为你最高符文等级的 ${formatPercents(0.8)}。
      （试着点一下它！）`,
    cost: () => 1,
    formatCost: value => formatInt(value),
    costCap: () => Number.MAX_VALUE,
    cap: () => Number.MAX_VALUE
  }),
  // Only appears with the perk shop increase upgrade
  fillMusicGlyph: rebuyable({
    id: 5,
    description: () => `用音乐符文填满背包中的所有空位`,
    cost: () => Math.clampMin(GameCache.glyphInventorySpace.value, 1),
    otherReq: () => GameCache.glyphInventorySpace.value > 0,
    formatCost: value => formatInt(value),
    costCap: () => Number.MAX_VALUE,
    cap: () => Number.MAX_VALUE
  }),
};
