<script>
import wordShift from "@/core/word-shift";

import ReplicantiUpgradeButton, { ReplicantiUpgradeButtonSetup } from "./ReplicantiUpgradeButton";
import PrimaryButton from "@/components/PrimaryButton";
import ReplicantiGainText from "./ReplicantiGainText";
import ReplicantiGalaxyButton from "./ReplicantiGalaxyButton";

export default {
  name: "ReplicantiTab",
  components: {
    PrimaryButton,
    ReplicantiGainText,
    ReplicantiUpgradeButton,
    ReplicantiGalaxyButton,
  },
  data() {
    return {
      isUnlocked: false,
      isUnlockAffordable: false,
      isInEC8: false,
      ec8Purchases: 0,
      amount: new Decimal(),
      mult: new Decimal(),
      hasTDMult: false,
      multTD: new Decimal(),
      hasDTMult: false,
      multDT: new Decimal(),
      hasIPMult: false,
      multIP: new Decimal(),
      hasRaisedCap: false,
      replicantiCap: new Decimal(),
      capMultText: "",
      distantRG: 0,
      remoteRG: 0,
      effarigInfinityBonusRG: 0,
      isUncapped: false,
      nextEffarigRGThreshold: 0,
      canSeeGalaxyButton: false,
      unlockCost: new Decimal(),
      scrambledText: "",
      maxReplicanti: new Decimal(),
      estimateToMax: 0,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    replicantiChanceSetup() {
      return new ReplicantiUpgradeButtonSetup(
        ReplicantiUpgrade.chance,
        value => `复制概率：${formatPercents(value)}`,
        cost => `+${formatPercents(0.01)} 花费：${format(cost)} IP`
      );
    },
    replicantiIntervalSetup() {
      const upgrade = ReplicantiUpgrade.interval;
      function formatInterval(interval) {
        const actualInterval = upgrade.applyModifiers(interval);
        const intervalNum = actualInterval.toNumber();
        if (actualInterval.gte(1000)) return `${format(actualInterval.div(1000), 2, 2)} 秒`;
        if (
          Number.isFinite(intervalNum) &&
          intervalNum > 1 &&
          upgrade.isCapped
        ) {
          // Checking isCapped() prevents text overflow when formatted as "__ ➜ __"
          return TimeSpan.fromMilliseconds(intervalNum).toStringShort(false);
        }
        if (actualInterval.lt(0.01)) return `< ${format(0.01, 2, 2)}ms`;
        return `${format(actualInterval, 2, 2)}ms`;
      }
      return new ReplicantiUpgradeButtonSetup(
        upgrade,
        value => `间隔：${formatInterval(value)}`,
        cost =>
          `➜ ${formatInterval(upgrade.nextValue)} 花费：${format(cost)} IP`
      );
    },
    maxGalaxySetup() {
      const upgrade = ReplicantiUpgrade.galaxies;
      return new ReplicantiUpgradeButtonSetup(
        upgrade,
        value => {
          let description = "最大复制品星系：";
          const extra = upgrade.extra;
          if (extra > 0) {
            const total = value + extra;
            description += `<br>${formatInt(value)} + ${formatInt(extra)} = ${formatInt(total)}`;
          } else {
            description += formatInt(value);
          }
          return description;
        },
        cost => `+${formatInt(1)} 花费：${format(cost)} IP`
      );
    },
    boostText() {
      const boostList = [];
      boostList.push(`所有无限维度获得 <span class="c-replicanti-description__accent">${formatX(this.mult, 2, 2)}</span>
        倍率`);
      if (this.hasTDMult) {
        boostList.push(`膨胀升级使所有时间维度获得 <span class="c-replicanti-description__accent">${formatX(this.multTD, 2, 2)}</span>
          倍率`);
      }
      if (this.hasDTMult) {
        const additionalEffect = GlyphAlteration.isAdded("replication") ? "和复制品速度" : "";
        boostList.push(`符文使膨胀时间${additionalEffect}获得 <span class="c-replicanti-description__accent">${formatX(this.multDT, 2, 2)}</span>
          倍率`);
      }
      if (this.hasIPMult) {
        boostList.push(`符文炼金使无限点数获得 <span class="c-replicanti-description__accent">${formatX(this.multIP)}</span>
          倍率`);
      }
      if (boostList.length === 1) return `${boostList[0]}.`;
      if (boostList.length === 2) return `${boostList[0]}<br>${boostList[1]}。`;
      return `${boostList.slice(0, -1).join("，<br>")}，<br>${boostList[boostList.length - 1]}。`;
    },
    hasMaxText: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    toMaxTooltip() {
      if (this.amount.lte(this.replicantiCap)) return null;
      return this.estimateToMax.lt(0.01)
        ? "正在增长"
        : TimeSpan.fromSeconds(this.estimateToMax.toNumber()).toStringShort();
    }
  },
  methods: {
    update() {
      this.isUnlocked = Replicanti.areUnlocked;
      this.unlockCost = new Decimal(1e140).dividedByEffectOf(PelleRifts.vacuum.milestones[1]);
      if (this.isDoomed) this.scrambledText = this.vacuumText();
      if (!this.isUnlocked) {
        this.isUnlockAffordable = Currency.infinityPoints.gte(this.unlockCost);
        return;
      }
      this.isInEC8 = EternityChallenge(8).isRunning;
      if (this.isInEC8) {
        this.ec8Purchases = player.eterc8repl;
      }
      this.amount.copyFrom(Replicanti.amount);
      this.mult.copyFrom(replicantiMult());
      this.hasTDMult = DilationUpgrade.tdMultReplicanti.isBought;
      this.multTD.copyFrom(DilationUpgrade.tdMultReplicanti.effectValue);
      this.hasDTMult = getAdjustedGlyphEffect("replicationdtgain") !== 0 && !Pelle.isDoomed;
      this.multDT = Math.clampMin(
        Decimal.log10(Replicanti.amount) *
          getAdjustedGlyphEffect("replicationdtgain"),
        1
      );
      this.hasIPMult = AlchemyResource.exponential.amount > 0 && !this.isDoomed;
      this.multIP = Replicanti.amount.powEffectOf(AlchemyResource.exponential);
      this.isUncapped = PelleRifts.vacuum.milestones[1].canBeApplied;
      this.hasRaisedCap = EffarigUnlock.infinity.isUnlocked && !this.isUncapped;
      this.replicantiCap.copyFrom(replicantiCap());
      if (this.hasRaisedCap) {
        const mult = this.replicantiCap.div(Decimal.NUMBER_MAX_VALUE);
        this.capMultText = TimeStudy(31).canBeApplied
          ? `基础：${formatX(mult.pow(1 / TimeStudy(31).effectValue), 2)}；时间研究 31 后：${formatX(mult, 2)}`
          : formatX(mult, 2);
      }
      this.distantRG = ReplicantiUpgrade.galaxies.distantRGStart;
      this.remoteRG = ReplicantiUpgrade.galaxies.remoteRGStart;
      this.effarigInfinityBonusRG = Effarig.bonusRG;
      this.nextEffarigRGThreshold = Decimal.NUMBER_MAX_VALUE.pow(
        Effarig.bonusRG + 2
      );
      this.canSeeGalaxyButton =
        Replicanti.galaxies.max >= 1 || PlayerProgress.eternityUnlocked();
      this.maxReplicanti.copyFrom(player.records.thisReality.maxReplicanti);
      this.estimateToMax = this.calculateEstimate();
    },
    vacuumText() {
      return wordShift.wordCycle(PelleRifts.vacuum.name);
    },
    // This is copied out of a short segment of ReplicantiGainText with comments and unneeded variables stripped
    calculateEstimate() {
      const updateRateMs = player.options.updateRate;
      const logGainFactorPerTick = Decimal.divide(getGameSpeedupForDisplay() * updateRateMs *
        (Math.log(player.replicanti.chance + 1)), getReplicantiInterval());
      const postScale = Math.log10(ReplicantiGrowth.scaleFactor) / ReplicantiGrowth.scaleLog10;
      const nextMilestone = this.maxReplicanti;
      const coeff = Decimal.divide(updateRateMs / 1000, logGainFactorPerTick.times(postScale));
      return coeff.times(nextMilestone.divide(this.amount).pow(postScale).minus(1));
    }
  },
};
</script>

<template>
  <div class="l-replicanti-tab">
    <br>
    <PrimaryButton
      v-if="!isUnlocked"
      :enabled="isUnlockAffordable"
      class="o-primary-btn--replicanti-unlock"
      onclick="Replicanti.unlock();"
    >
      解锁复制品
      <br>
      花费：{{ format(unlockCost) }} IP
    </PrimaryButton>
    <template v-else>
      <div
        v-if="isDoomed"
        class="modified-cap"
      >
        第二个 {{ scrambledText }} 里程碑移除了你的复制品上限。
      </div>
      <div
        v-else-if="hasRaisedCap"
        class="modified-cap"
      >
        完成 Effarig 的无限后，你获得以下奖励：
        <br>
        不含时间研究 192 时，你的复制品上限现在为 {{ format(replicantiCap, 2) }}
        ({{ capMultText }})
        <br>
        额外复制品星系：{{ formatInt(effarigInfinityBonusRG) }}
        （下一个复制品星系要求上限达到 {{ format(nextEffarigRGThreshold, 2) }}）
      </div>
      <p class="c-replicanti-description">
        你有
        <span class="c-replicanti-description__accent">{{ format(amount, 2, 0) }}</span>
        复制品，转化为
        <br>
        <span v-html="boostText" />
      </p>
      <div
        v-if="hasMaxText"
        class="c-replicanti-description"
      >
        本次现实中达到过的最高复制品数量为
        <span
          v-tooltip="toMaxTooltip"
          class="max-accent"
        >{{ format(maxReplicanti, 2) }}</span>。
      </div>
      <br>
      <div v-if="isInEC8">
        永恒挑战 8 中还剩 {{ formatInt(ec8Purchases) }} 次购买。
      </div>
      <div class="l-replicanti-upgrade-row">
        <ReplicantiUpgradeButton :setup="replicantiChanceSetup" />
        <ReplicantiUpgradeButton :setup="replicantiIntervalSetup" />
        <ReplicantiUpgradeButton :setup="maxGalaxySetup" />
      </div>
      <div>
        最大复制品星系升级可以无限购买，但花费增长会在
        <br>
        {{ formatInt(distantRG) }} 个复制品星系后加快，
        并在 {{ formatInt(remoteRG) }} 个复制品星系后进一步加快。
      </div>
      <br><br>
      <ReplicantiGainText />
      <br>
      <ReplicantiGalaxyButton v-if="canSeeGalaxyButton" />
    </template>
  </div>
</template>

<style scoped>
.max-accent {
  color: var(--color-accent);
  text-shadow: 0 0 0.2rem var(--color-reality-dark);
  cursor: default;
}

.modified-cap {
  margin: -0.8rem 0 0.8rem;
  font-weight: bold;
}
</style>
