import { GameDatabase } from "./secret-formula/game-database";

class AwayProgress {
  constructor(config) {
    this.name = config.name;
    this.forcedName = config.forcedName;
    this.isUnlocked = () => config.isUnlocked() || player.records.fullGameCompletions > 0;
    this.awayOption = config.awayOption ?? this.name;
    this.showOption = config.showOption ?? true;
    // This is an array of strings, each one the name of the next entry in the player object to navigate to
    // If there is no reference, it is accessed directly by the name through the player object.
    this.reference = config.reference ?? [this.name];
    // Most of the entries in offline progress are props which can be directly read from the player object, but eg. for
    // achievements the raw data is an array of bitmasks. This structure allows generic support for indirect values.
    this.applyFn = config.applyFn ?? (x => x);
    this.classObjectReference = config.classObjectReference ?? this.name;
    this.appearsInAwayModal = config.appearsInAwayModal ?? true;
  }

  get option() {
    return player.options.awayProgress[this.awayOption];
  }

  set option(value) {
    player.options.awayProgress[this.awayOption] = value;
  }

  get classObject() {
    // Format the camelCase name to kebab-case
    return `c-modal-away-progress__${
      this.classObjectReference.replace(/[A-Z]/gu, match => `-${match.toLowerCase()}`)
    }`;
  }

  get formatName() {
    const names = {
      antimatter: "反物质",
      dimensionBoosts: "维度提升",
      antimatterGalaxies: "反物质星系",
      infinities: "无限次数",
      infinityPoints: "无限点数",
      replicanti: "复制品",
      replicantiGalaxies: "复制品星系",
      eternities: "永恒次数",
      eternityPoints: "永恒点数",
      tachyonParticles: "快子粒子",
      dilatedTime: "膨胀时间",
      timeTheorems: "时间定理",
      tachyonGalaxies: "快子星系",
      achievementAmount: "成就数量",
      realities: "现实次数",
      realityMachines: "现实机器",
      blackHole: "黑洞",
      firstBlackHole: "第一黑洞",
      secondBlackHole: "第二黑洞",
      relicShards: "遗物碎片",
      celestialMemories: "天体记忆",
      teresaMemories: "Teresa 记忆",
      effarigMemories: "Effarig 记忆",
      enslavedMemories: "无名氏记忆",
      vMemories: "V 记忆",
      imaginaryMachines: "虚幻机器",
      darkMatter: "暗物质",
      darkEnergy: "暗能量",
      singularities: "奇点",
      realityShards: "现实碎片"
    };
    if (names[this.name]) return names[this.name];
    if (this.forcedName) return this.forcedName;
    // Format the camelCase name to Title Case, with spaces added before the capital letters
    return this.name
      .replace(/[A-Z]/gu, match => ` ${match}`)
      .replace(/^\w/u, c => c.toUpperCase());
  }

  // Pass in player object. Navigate to there using each reference point. Return the place you arrived at.
  navigateTo(from) {
    let place = from;
    for (const goTo of this.reference) {
      place = place[goTo];
    }
    return this.applyFn(place);
  }
}

export const AwayProgressTypes = {
  all: {},
  index: [],
  showOption: [],
  appearsInAwayModal: [],
};

for (let index = 0; index < GameDatabase.awayProgressTypes.length; index++) {
  const entry = new AwayProgress(GameDatabase.awayProgressTypes[index]);
  const name = entry.name;
  AwayProgressTypes.all[name] = entry;
  AwayProgressTypes.index.push(name);
  if (entry.showOption) AwayProgressTypes.showOption.push(name);
  if (entry.appearsInAwayModal) AwayProgressTypes.appearsInAwayModal.push(name);
}
