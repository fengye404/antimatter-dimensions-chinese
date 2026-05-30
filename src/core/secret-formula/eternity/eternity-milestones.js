export const eternityMilestones = {
  autobuyerIPMult: {
    eternities: 1,
    reward: "解锁无限点数倍率自动购买器",
    pelleUseless: true
  },
  keepAutobuyers: {
    eternities: 2,
    reward: "每次永恒开始时，普通挑战视为完成、普通自动购买器全解锁，并已突破无限"
  },
  autobuyerReplicantiGalaxy: {
    eternities: 3,
    reward: "解锁复制品星系自动购买器"
  },
  keepInfinityUpgrades: {
    eternities: 4,
    reward: "每次永恒开始时保留所有无限升级",
    givenByPelle: () => PelleUpgrade.keepInfinityUpgrades.isBought,
    pelleUseless: true
  },
  bigCrunchModes: {
    eternities: 5,
    reward: "解锁更多大坍缩自动购买器选项"
  },
  autoEP: {
    eternities: 6,
    reward: () => {
      const EPmin = getOfflineEPGain(TimeSpan.fromMinutes(1).totalMilliseconds);
      const em200 = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        EternityMilestone.autoEternities.isReached).gt(0);
      const em1000 = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        EternityMilestone.autoInfinities.isReached).gt(0);
      if (!player.options.offlineProgress) return "此里程碑可提供离线永恒点数生成，但当前已关闭离线进度";
      const effectText = (em200 || em1000) ? "未生效" : `当前 ${format(EPmin, 2, 2)} 永恒点数/分钟`;
      return `离线时，获得过去永恒中最佳永恒点数/分钟的 ${formatPercents(0.25)}（${effectText}）`;
    },
    activeCondition: () => (player.options.offlineProgress
      ? `只要其他离线里程碑（${formatInt(200)} 或 ${formatInt(1000)} 次永恒）没有同时生效，就会保持生效`
      : ""),
  },
  autoIC: {
    eternities: 7,
    reward: "无限挑战会在解锁时自动完成，并保留维度牺牲自动购买器",
    pelleUseless: true
  },
  keepBreakUpgrades: {
    eternities: 8,
    reward: "每次永恒开始时保留所有突破无限升级",
    givenByPelle: () => PelleUpgrade.keepBreakInfinityUpgrades.isBought,
    pelleUseless: true
  },
  autobuyMaxGalaxies: {
    eternities: 9,
    reward: "解锁反物质星系自动购买器的“购买最大”模式"
  },
  unlockReplicanti: {
    eternities: 10,
    reward: "每次永恒开始时复制品已解锁",
    givenByPelle: () => PelleUpgrade.replicantiStayUnlocked.isBought,
    pelleUseless: true
  },
  autobuyerID1: {
    eternities: 11,
    reward: "解锁第 1 无限维度自动购买器",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID2: {
    eternities: 12,
    reward: "解锁第 2 无限维度自动购买器",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID3: {
    eternities: 13,
    reward: "解锁第 3 无限维度自动购买器",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID4: {
    eternities: 14,
    reward: "解锁第 4 无限维度自动购买器",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID5: {
    eternities: 15,
    reward: "解锁第 5 无限维度自动购买器",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID6: {
    eternities: 16,
    reward: "解锁第 6 无限维度自动购买器",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID7: {
    eternities: 17,
    reward: "解锁第 7 无限维度自动购买器",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID8: {
    eternities: 18,
    reward: "解锁第 8 无限维度自动购买器",
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autoUnlockID: {
    eternities: 25,
    reward: "达到条件后自动解锁无限维度"
  },
  unlockAllND: {
    eternities: 30,
    reward: "开始时所有反物质维度都可购买"
  },
  replicantiNoReset: {
    eternities: 40,
    reward: "复制品星系不再重置反物质、反物质维度、时间间隔、维度牺牲或维度提升",
    pelleUseless: true
  },
  autobuyerReplicantiChance: {
    eternities: 50,
    reward: "解锁复制概率升级自动购买器",
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerReplicantiInterval: {
    eternities: 60,
    reward: "解锁复制间隔升级自动购买器",
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerReplicantiMaxGalaxies: {
    eternities: 80,
    reward: "解锁最大复制品星系升级自动购买器",
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerEternity: {
    eternities: 100,
    reward: "解锁永恒自动购买器"
  },
  autoEternities: {
    eternities: 200,
    reward: () => {
      if (!player.options.offlineProgress) return "此里程碑可离线生成永恒次数，但当前已关闭离线进度";
      const eternities = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        player.eternities.gte(200));
      // As far as I can tell, using templates here as Codefactor wants would lead to nested templates,
      // which seems messy to say the least.
      const realTime = PlayerProgress.seenAlteredSpeed() ? "真实时间" : "";
      // eslint-disable-next-line prefer-template
      return `离线时，以最快${realTime}永恒速度的 ${formatPercents(0.5)} 获得永恒次数` +
        (eternities.gt(0) ? `（当前 ${format(eternities, 2, 2)}/小时）` : "（未生效）");
    },
    activeCondition: () => (player.options.offlineProgress
      ? `必须不在任何挑战或时间膨胀中，并且永恒自动购买器需要设置为 0 永恒点数时永恒。此效果最低间隔为 ${formatInt(33)}ms。`
      : ""),
      pelleUseless: true
  },
  autoInfinities: {
    eternities: 1000,
    reward: () => {
      if (!player.options.offlineProgress) return "此里程碑可离线生成无限次数，但当前已关闭离线进度";
      const infinities = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        player.eternities.gte(1000));
      // eslint-disable-next-line prefer-template
      return `离线时，以本次永恒中最佳无限/小时速度的 ${formatPercents(0.5)} 获得无限次数` +
        (infinities.gt(0) ? `（当前 ${format(infinities, 2, 2)}/小时）` : "（未生效）");
    },
    activeCondition: () => (player.options.offlineProgress
      ? `必须不在普通/无限挑战中，也不在 EC4 或 EC12 中；大坍缩自动购买器需要开启并设为 ${formatInt(5)} 秒以内的时间模式，且永恒自动购买器必须关闭。`
      : ""),
      pelleUseless: true
  }
};
