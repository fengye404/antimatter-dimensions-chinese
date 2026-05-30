export const ra = {
  pets: {
    teresa: {
      id: "teresa",
      name: "Teresa",
      color: "#8596ea",
      chunkGain: "永恒点数",
      memoryGain: "当前现实机器",
      requiredUnlock: () => undefined,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.eternityPoints.value.pLog10() / 1e4, 3),
      memoryProductionMultiplier: () => Ra.unlocks.teresaXP.effectOrDefault(1)
    },
    effarig: {
      id: "effarig",
      name: "Effarig",
      color: "#ea8585",
      chunkGain: "已获得的遗物碎片",
      memoryGain: "最高符文等级",
      requiredUnlock: () => Ra.unlocks.effarigUnlock,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Effarig.shardsGained, 0.1),
      memoryProductionMultiplier: () => Ra.unlocks.effarigXP.effectOrDefault(1)
    },
    enslaved: {
      id: "enslaved",
      name: "无名之辈",
      color: "#f1aa7f",
      chunkGain: "时间碎片",
      memoryGain: "总游玩时间",
      requiredUnlock: () => Ra.unlocks.enslavedUnlock,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.timeShards.value.pLog10() / 3e5, 2),
      memoryProductionMultiplier: () => Ra.unlocks.enslavedXP.effectOrDefault(1)
    },
    v: {
      id: "v",
      name: "V",
      color: "#ead584",
      chunkGain: "无限能量",
      memoryGain: "记忆总等级",
      requiredUnlock: () => Ra.unlocks.vUnlock,
      rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.infinityPower.value.pLog10() / 1e7, 1.5),
      memoryProductionMultiplier: () => Ra.unlocks.vXP.effectOrDefault(1)
    }
  },
  unlocks: {
    autoTP: {
      id: 0,
      reward: "时间膨胀激活时，会立刻获得超光速粒子",
      pet: "teresa",
      level: 1,
      displayIcon: `<span class="fas fa-atom"></span>`,
      disabledByPelle: true
    },
    chargedInfinityUpgrades: {
      id: 1,
      reward: () => `解锁充能无限升级。Teresa 每提升 ${formatInt(2)} 级，
        充能无限升级上限增加 1 个`,
      effect: () => Math.min(12, Math.floor(Ra.pets.teresa.level / 2)),
      pet: "teresa",
      level: 2,
      displayIcon: `<span class="fas fa-infinity"></span>`,
      disabledByPelle: true
    },
    teresaXP: {
      id: 2,
      reward: "所有记忆碎片会基于现实机器数量产出更多记忆",
      effect: () => 1 + Math.pow(Currency.realityMachines.value.pLog10() / 100, 0.5),
      pet: "teresa",
      level: 5,
      displayIcon: `Ϟ`
    },
    alteredGlyphs: {
      id: 3,
      reward: "解锁变异符文，使符文基于符文献祭获得新的效果",
      pet: "teresa",
      level: 10,
      displayIcon: `<span class="fas fa-bolt"></span>`,
      disabledByPelle: true
    },
    effarigUnlock: {
      id: 4,
      reward: "解锁 Effarig 的记忆",
      pet: "teresa",
      level: 8,
      displayIcon: `Ϙ`
    },
    perkShopIncrease: {
      id: 5,
      reward: "提高 Teresa 复兴点商店的购买上限",
      pet: "teresa",
      level: 15,
      displayIcon: `<span class="fas fa-project-diagram"></span>`
    },
    unlockDilationStartingTP: {
      id: 6,
      reward: `在非天神现实中，会按“总反物质平方根已进入时间膨胀”的规模获得超光速粒子。
        超光速粒子倍率会回溯生效，即使不在时间膨胀中也一样`,
      effect: () => player.records.totalAntimatter.pow(0.5),
      pet: "teresa",
      level: 25,
      displayIcon: `<i class="far fa-dot-circle"></i>`
    },
    extraGlyphChoicesAndRelicShardRarityAlwaysMax: {
      id: 7,
      reward: () => `符文选项 ${formatX(2)}，且遗物碎片提供的符文稀有度加成始终按最大值计算`,
      effect: 2,
      pet: "effarig",
      level: 1,
      displayIcon: `<i class="fas fa-grip-horizontal"></i>`
    },
    unlockGlyphAlchemy: {
      id: 8,
      reward: `解锁符文炼金。你可以精炼符文来增加炼金资源，并随 Effarig 等级解锁更多资源。
        可在新的现实子页中进入。`,
      pet: "effarig",
      level: 2,
      displayIcon: `<span class="fas fa-vial"></span>`
    },
    effarigXP: {
      id: 9,
      reward: "所有记忆碎片会基于最高符文等级产出更多记忆",
      effect: () => 1 + player.records.bestReality.glyphLevel / 7000,
      pet: "effarig",
      level: 5,
      displayIcon: `<span class="fas fa-clone"></span>`
    },
    glyphEffectCount: {
      id: 10,
      reward: () => `符文始终拥有 ${formatInt(4)} 条效果，Effarig 符文最多可拥有 ${formatInt(7)} 条效果`,
      pet: "effarig",
      level: 10,
      displayIcon: `<span class="fas fa-braille"></span>`
    },
    enslavedUnlock: {
      id: 11,
      reward: "解锁无名之辈的记忆",
      pet: "effarig",
      level: 8,
      displayIcon: `<span class="c-ra-pet-milestones-effarig-link">\uf0c1</span>`
    },
    relicShardGlyphLevelBoost: {
      id: 12,
      reward: "基于已获得的遗物碎片提高符文等级",
      effect: () => 100 * Math.pow(Math.log10(Math.max(Effarig.shardsGained, 1)), 2),
      pet: "effarig",
      level: 15,
      displayIcon: `<span class="fas fa-fire"></span>`
    },
    maxGlyphRarityAndShardSacrificeBoost: {
      id: 13,
      reward: () => `生成的符文始终为 ${formatPercents(1)} 稀有度，
        且符文献祭获取量会基于遗物碎片获得指数提升`,
      effect: () => 1 + Effarig.maxRarityBoost / 100,
      pet: "effarig",
      level: 25,
      displayIcon: `<i class="fas fa-ankh"></i>`
    },
    blackHolePowerAutobuyers: {
      id: 14,
      reward: "解锁黑洞强度升级自动购买器",
      pet: "enslaved",
      level: 1,
      displayIcon: `<span class="fas fa-circle"></span>`,
      disabledByPelle: true
    },
    improvedStoredTime: {
      id: 15,
      reward: "储存的游戏时间会被放大，并可随无名之辈等级储存更多现实时间",
      effects: {
        gameTimeAmplification: () => Math.pow(20, Math.clampMax(Ra.pets.enslaved.level, Ra.levelCap)),
        realTimeCap: () => 1000 * 3600 * Ra.pets.enslaved.level,
      },
      pet: "enslaved",
      level: 2,
      displayIcon: `<span class="fas fa-history"></span>`,
      disabledByPelle: true
    },
    enslavedXP: {
      id: 16,
      reward: "所有记忆碎片会基于总游玩时间产出更多记忆",
      effect: () => 1 + Math.log10(player.records.totalTimePlayed) / 200,
      pet: "enslaved",
      level: 5,
      displayIcon: `<span class="fas fa-stopwatch"></span>`
    },
    autoPulseTime: {
      id: 17,
      reward: () => `黑洞充能现在只消耗 ${formatPercents(0.99)} 游戏速度，并且每 ${formatInt(5)} 刻
        自动释放 ${formatPercents(0.01)} 已储存游戏时间。`,
      pet: "enslaved",
      level: 10,
      displayIcon: `<span class="fas fa-expand-arrows-alt"></span>`,
      disabledByPelle: true
    },
    vUnlock: {
      id: 18,
      reward: "解锁 V 的记忆",
      pet: "enslaved",
      level: 8,
      displayIcon: `⌬`
    },
    peakGamespeedDT: {
      id: 19,
      reward: "基于每次现实中的峰值游戏速度获得更多膨胀时间",
      effect: () => Math.max(Math.pow(Math.log10(player.celestials.ra.peakGamespeed) - 90, 3), 1),
      pet: "enslaved",
      level: 15,
      displayIcon: `<span class="fas fa-tachometer-alt"></span>`,
      disabledByPelle: true
    },
    allGamespeedGlyphs: {
      id: 20,
      reward: `所有基础符文都会获得时间符文的游戏速度提升效果，
        时间符文则额外获得一条效果`,
      pet: "enslaved",
      level: 25,
      displayIcon: `<span class="fas fa-clock"></span>`,
      onUnlock: () => {
        const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
        for (const glyph of allGlyphs) {
          Glyphs.applyGamespeed(glyph);
        }
      }
    },
    instantECAndRealityUpgradeAutobuyers: {
      id: 21,
      reward: "可重复购买的现实升级会自动购买，自动永恒挑战会立即完成",
      pet: "v",
      level: 1,
      displayIcon: `<span class="fas fa-sync-alt"></span>`,
      disabledByPelle: true
    },
    autoUnlockDilation: {
      id: 22,
      reward: () => `在非天神现实中，达到 ${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)}
        个时间定理后会免费自动解锁时间膨胀`,
      pet: "v",
      level: 2,
      displayIcon: `<span class="fas fa-fast-forward"></span>`
    },
    vXP: {
      id: 23,
      reward: "所有记忆碎片会基于天神总等级产出更多记忆。",
      effect: () => 1 + Ra.totalPetLevel / 50,
      pet: "v",
      level: 5,
      displayIcon: `<span class="fas fa-book"></span>`
    },
    unlockHardV: {
      id: 24,
      reward: () => `解锁困难 V 成就，并且 V 每提升 ${formatInt(6)} 级解锁一个三元研究。
        三元研究位于时间研究页面底部`,
      effect: () => Math.floor(Ra.pets.v.level / 6),
      pet: "v",
      level: 6,
      displayIcon: `<span class="fas fa-trophy"></span>`,
      disabledByPelle: true
    },
    continuousTTBoost: {
      id: 25,
      reward: "时间定理会增强所有非维度类的持续产出",
      effects: {
        ttGen: () => Math.pow(10, 5 * Ra.theoremBoostFactor()),
        eternity: () => Math.pow(10, 2 * Ra.theoremBoostFactor()),
        infinity: () => Math.pow(10, 15 * Ra.theoremBoostFactor()),
        replicanti: () => Math.pow(10, 20 * Ra.theoremBoostFactor()),
        dilatedTime: () => Math.pow(10, 3 * Ra.theoremBoostFactor()),
        memories: () => 1 + Ra.theoremBoostFactor() / 50,
        memoryChunks: () => 1 + Ra.theoremBoostFactor() / 50,
        autoPrestige: () => 1 + 2.4 * Ra.theoremBoostFactor()
      },
      pet: "v",
      level: 10,
      displayIcon: `<span class="fas fa-university"></span>`,
      disabledByPelle: true
    },
    achievementTTMult: {
      id: 26,
      reward: "成就倍率也会作用于时间定理生成",
      effect: () => Achievements.power,
      pet: "v",
      level: 15,
      displayIcon: `<span class="fas fa-graduation-cap"></span>`,
      disabledByPelle: true
    },
    achievementPower: {
      id: 27,
      reward: () => `成就倍率提高至 ${formatPow(1.5, 1, 1)}`,
      effect: 1.5,
      pet: "v",
      level: 25,
      displayIcon: `<i class="fab fa-buffer"></i>`,
      disabledByPelle: true
    }
  }
};
