import { DC } from "../../constants";

function dimInfinityMult() {
  return Currency.infinitiesTotal.value.times(0.2).plus(1);
}
function chargedDimInfinityMult() {
  return 1 + Math.log10(Math.max(1, Currency.infinitiesTotal.value.pLog10())) * Math.sqrt(Ra.pets.teresa.level) / 150;
}

export const infinityUpgrades = {
  totalTimeMult: {
    id: "timeMult",
    cost: 1,
    description: "反物质维度获得基于总游玩时间的倍率",
    effect: () => Math.pow(Time.totalTimePlayed.totalMinutes / 2, 0.15),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: "反物质维度获得基于总游玩时间和 Teresa 等级的幂次效果",
      effect: () => 1 +
        Math.log10(Math.log10(Time.totalTimePlayed.totalMilliseconds)) *
        Math.pow(Ra.pets.teresa.level, 0.5) / 150,
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim18mult: {
    id: "18Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.totalTimeMult.isBought,
    description: "第 1 和第 8 反物质维度获得基于无限次数的倍率",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "第 1 和第 8 反物质维度获得基于无限次数和 Teresa 等级的幂次效果",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim27mult: {
    id: "27Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.buy10Mult.isBought,
    description: "第 2 和第 7 反物质维度获得基于无限次数的倍率",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "第 2 和第 7 反物质维度获得基于无限次数和 Teresa 等级的幂次效果",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim36mult: {
    id: "36Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim18mult.isBought,
    description: "第 3 和第 6 反物质维度获得基于无限次数的倍率",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "第 3 和第 6 反物质维度获得基于无限次数和 Teresa 等级的幂次效果",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim45mult: {
    id: "45Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim27mult.isBought,
    description: "第 4 和第 5 反物质维度获得基于无限次数的倍率",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "第 4 和第 5 反物质维度获得基于无限次数和 Teresa 等级的幂次效果",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  resetBoost: {
    id: "resetBoost",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim36mult.isBought,
    description: () =>
      `维度提升和反物质星系所需的维度数量减少 ${formatInt(9)}`,
    effect: 9,
    charged: {
      description: () => "基于 Teresa 等级降低维度提升需求",
      effect: () => 1 / (1 + Math.sqrt(Ra.pets.teresa.level) / 10),
      formatEffect: value => `${formatX(value, 4, 4)}`
    }
  },
  buy10Mult: {
    id: "dimMult",
    cost: 1,
    description: () => `提高每购买 ${formatInt(10)} 个反物质维度获得的倍率`,
    effect: () => 1.1,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.2, 0, 1)}`,
    charged: {
      description: () => `每购买 ${formatInt(10)} 个反物质维度的倍率获得基于 Teresa 等级的幂次效果`,
      effect: () => 1 + Ra.pets.teresa.level / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  galaxyBoost: {
    id: "galaxyBoost",
    cost: 2,
    checkRequirement: () => InfinityUpgrade.dim45mult.isBought,
    description: "所有星系效果翻倍",
    effect: 2,
    charged: {
      description: "所有星系效果基于 Teresa 等级增强",
      effect: () => 2 + Math.sqrt(Ra.pets.teresa.level) / 100,
      formatEffect: value => `+${formatPercents(value - 1)}`
    }
  },
  thisInfinityTimeMult: {
    id: "timeMult2",
    cost: 3,
    description: "反物质维度获得基于本次无限用时的倍率",
    effect: () => Decimal.max(Math.pow(Time.thisInfinity.totalMinutes / 4, 0.25), 1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description:
        "反物质维度获得基于本次无限用时和 Teresa 等级的幂次效果",
      effect: () => 1 +
        Math.log10(Math.log10(Time.thisInfinity.totalMilliseconds + 100)) *
        Math.sqrt(Ra.pets.teresa.level) / 150,
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  unspentIPMult: {
    id: "unspentBonus",
    cost: 5,
    checkRequirement: () => InfinityUpgrade.thisInfinityTimeMult.isBought,
    description: "第 1 反物质维度获得基于未花费无限点数的倍率",
    effect: () => Currency.infinityPoints.value.dividedBy(2).pow(1.5).plus(1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: "第 1 反物质维度获得基于未花费无限点数和 Teresa 等级的倍率",
      effect: () => Currency.infinityPoints.value.dividedBy(2).pow(Math.sqrt(Ra.pets.teresa.level) * 1.5).plus(1),
      formatEffect: value => formatX(value, 2, 2)
    }
  },
  dimboostMult: {
    id: "resetMult",
    cost: 7,
    checkRequirement: () => InfinityUpgrade.unspentIPMult.isBought,
    description: "提高维度提升倍率",
    effect: () => 2.5,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.5, 0, 1)}`,
    charged: {
      description: "维度提升倍率获得基于 Teresa 等级的幂次效果",
      effect: () => 1 + Ra.pets.teresa.level / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  ipGen: {
    id: "passiveGen",
    cost: 10,
    checkRequirement: () => InfinityUpgrade.dimboostMult.isBought,
    description: () => `以最快无限速度的 ${formatInt(1)}/${formatInt(10)} 被动生成无限点数`,
    // Cutting corners: this is not actual effect, but it is totalIPMult that is displyed on upgrade
    effect: () => (Teresa.isRunning || V.isRunning || Pelle.isDoomed ? DC.D0 : GameCache.totalIPMult.value),
    formatEffect: value => {
      if (Teresa.isRunning || V.isRunning) return "在当前现实中已禁用";
      if (Pelle.isDoomed) return "已禁用";
      if (player.records.bestInfinity.time >= 999999999999) return "生成速度过慢";
      return `每 ${Time.bestInfinity.times(10).toStringShort()} 生成 ${format(value, 2)}`;
    },
    charged: {
      description: () =>
        `每个现实时间秒获得现实机器，数量与现实时获得量成比例，并随 Teresa 等级提高`,
      effect: () => Math.pow(Ra.pets.teresa.level, 2) *
        Ra.unlocks.continuousTTBoost.effects.autoPrestige.effectOrDefault(1),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  skipReset1: {
    id: "skipReset1",
    cost: 20,
    description: () =>
      `每次重置开始时拥有 ${formatInt(1)} 次维度提升，并自动解锁第 5 反物质维度`,
  },
  skipReset2: {
    id: "skipReset2",
    cost: 40,
    checkRequirement: () => InfinityUpgrade.skipReset1.isBought,
    description: () =>
      `每次重置开始时拥有 ${formatInt(2)} 次维度提升，并自动解锁第 6 反物质维度`,
  },
  skipReset3: {
    id: "skipReset3",
    cost: 80,
    checkRequirement: () => InfinityUpgrade.skipReset2.isBought,
    description: () =>
      `每次重置开始时拥有 ${formatInt(3)} 次维度提升，并自动解锁第 7 反物质维度`,
  },
  skipResetGalaxy: {
    id: "skipResetGalaxy",
    cost: 300,
    checkRequirement: () => InfinityUpgrade.skipReset3.isBought,
    description: () =>
      `每次重置开始时拥有 ${formatInt(4)} 次维度提升，并自动解锁第 8 反物质维度和一个反物质星系`,
  },
  ipOffline: {
    id: "ipOffline",
    cost: 1000,
    checkRequirement: () => Achievement(41).isUnlocked,
    description: () => (player.options.offlineProgress
      ? `仅离线时，获得不使用“全部最大”时最佳无限点数/分钟的 ${formatPercents(0.5)}`
      : "此升级会提供离线无限点数生成，但离线进度当前已关闭"),
    effect: () => (player.options.offlineProgress
      ? player.records.thisEternity.bestIPMsWithoutMaxAll.times(TimeSpan.fromMinutes(1).totalMilliseconds / 2)
      : DC.D0),
    isDisabled: () => !player.options.offlineProgress,
    formatEffect: value => `${format(value, 2, 2)} 无限点数/分钟`,
  },
  ipMult: {
    id: "ipMult",
    cost: () => InfinityUpgrade.ipMult.cost,
    checkRequirement: () => Achievement(41).isUnlocked,
    costCap: DC.E6E6,
    costIncreaseThreshold: DC.E3E6,
    description: () => `所有来源的无限点数乘以 ${formatX(2)}`,
    // Normally the multiplier caps at e993k or so with 3300000 purchases, but if the cost is capped then we just give
    // an extra e7k to make the multiplier look nice
    effect: () => (player.IPMultPurchases >= 3300000 ? DC.E1E6 : DC.D2.pow(player.IPMultPurchases)),
    cap: () => Effarig.eternityCap ?? DC.E1E6,
    formatEffect: value => formatX(value, 2, 2),
  }
};
