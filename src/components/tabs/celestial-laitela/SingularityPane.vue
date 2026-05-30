<script>
export default {
  name: "SingularityPane",
  data() {
    return {
      darkEnergy: 0,
      darkEnergyGainPerSecond: 0,
      singularities: 0,
      singularityCapIncreases: 0,
      canPerformSingularity: false,
      unlockedBulkSingularity: false,
      singularityCap: 0,
      baseTimeToSingularity: 0,
      currentTimeToSingularity: 0,
      extraTimeAfterSingularity: 0,
      singularitiesGained: 0,
      autoSingularityFactor: 0,
      perStepFactor: 0,
      isAutoEnabled: false,
      hasAutoSingularity: false,
      nextLowerStep: 0,
      willCondenseOnDecrease: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    singularityFormText() {
      const formText = this.singularitiesGained === 1 ? "全部暗能量凝聚为 1 个奇点"
        : `全部暗能量凝聚为 ${quantify("奇点", this.singularitiesGained, 2)}`;
      if (this.canPerformSingularity) {
        return `凝聚${formText}`;
      }
      return `达到 ${format(this.singularityCap)} 暗能量后可凝聚${formText}`;
    },
    singularityWaitText() {
      let singularityTime = this.currentTimeToSingularity;
      if (this.canPerformSingularity) {
        singularityTime += this.extraTimeAfterSingularity;
        if (!this.isAutoEnabled) return "";
        return singularityTime > 0
          ? `（将在 ${TimeSpan.fromSeconds(singularityTime).toStringShort()} 后自动凝聚）`
          : "（将立即自动凝聚）";
      }
      return `（${TimeSpan.fromSeconds(singularityTime).toStringShort()} 后暗能量足够）`;
    },
    baseSingularityTime() {
      return TimeSpan.fromSeconds(this.baseTimeToSingularity).toStringShort();
    },
    additionalSingularityTime() {
      return TimeSpan.fromSeconds(this.extraTimeAfterSingularity).toStringShort();
    },
    manualSingularityRate() {
      const totalTime = this.baseTimeToSingularity;
      return this.formatRate(this.singularitiesGained / totalTime);
    },
    autoSingularityRate() {
      if (this.hasAutoSingularity && !this.isAutoEnabled) return "自动奇点：关闭";
      const totalTime = this.baseTimeToSingularity + this.extraTimeAfterSingularity;
      return this.formatRate(this.singularitiesGained / totalTime);
    },
    decreaseTooltip() {
      if (this.singularityCapIncreases === 0) return "上限已经不能再降低了！";
      const singularities = this.singularitiesGained / this.perStepFactor;
      return this.willCondenseOnDecrease
        ? `降低上限会立刻自动凝聚，获得 ${quantify("奇点", singularities, 2)}！`
        : null;
    },
    increaseTooltip() {
      return this.singularityCapIncreases >= 50
        ? "上限已经不能再提高了！"
        : null;
    }
  },
  methods: {
    update() {
      const laitela = player.celestials.laitela;
      this.darkEnergy = Currency.darkEnergy.value;
      this.darkEnergyGainPerSecond = Currency.darkEnergy.productionPerSecond;
      this.singularities = Currency.singularities.value;
      this.singularityCapIncreases = laitela.singularityCapIncreases;
      this.canPerformSingularity = Singularity.capIsReached;
      this.unlockedBulkSingularity = Currency.singularities.gte(10);
      this.singularityCap = Singularity.cap;
      this.baseTimeToSingularity = Singularity.timePerCondense;
      this.currentTimeToSingularity = Singularity.timeUntilCap;
      this.extraTimeAfterSingularity = Singularity.timeDelayFromAuto;
      this.singularitiesGained = Singularity.singularitiesGained;
      this.autoSingularityFactor = SingularityMilestone.autoCondense.effectOrDefault(Infinity);
      this.perStepFactor = Singularity.gainPerCapIncrease;
      this.isAutoEnabled = player.auto.singularity.isActive && SingularityMilestone.autoCondense.canBeApplied;
      this.hasAutoSingularity = Number.isFinite(this.autoSingularityFactor);
      this.nextLowerStep = this.singularityCap * this.autoSingularityFactor / 10;
      this.willCondenseOnDecrease = this.isAutoEnabled && this.darkEnergy > this.nextLowerStep;
    },
    doSingularity() {
      Singularity.perform();
    },
    increaseCap() {
      Singularity.increaseCap();
    },
    decreaseCap() {
      Singularity.decreaseCap();
    },
    formatRate(rate) {
      if (rate < 1 / 60) return `${format(3600 * rate, 2, 3)}/小时`;
      if (rate < 1) return `${format(60 * rate, 2, 3)}/分钟`;
      return `${format(rate, 2, 3)}/秒`;
    },
    condenseClassObject() {
      return {
        "c-laitela-singularity": true,
        "c-laitela-singularity--active": this.canPerformSingularity && !this.isDoomed,
        "o-pelle-disabled": this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed,
      };
    }
  }
};
</script>

<template>
  <div class="c-laitela-singularity-container">
    <div>
      <h2>
        你有 {{ quantify("奇点", singularities, 2) }}
      </h2>
      <button
        :class="condenseClassObject()"
        @click="doSingularity"
      >
        <h2>
          {{ singularityFormText }}
        </h2>
        <br v-if="singularityWaitText !== ''">
        <h2>
          {{ singularityWaitText }}
        </h2>
      </button>
    </div>
    <div v-if="singularities !== 0">
      <div class="o-laitela-matter-amount">
        你有 {{ format(darkEnergy, 2, 4) }} 暗能量。（+{{ format(darkEnergyGainPerSecond, 2, 4) }}/秒）
      </div>
      <div v-if="unlockedBulkSingularity">
        <button
          class="c-laitela-singularity__cap-control"
          :class="{ 'c-laitela-singularity__cap-control--available' : singularityCapIncreases > 0 }"
          :ach-tooltip="decreaseTooltip"
          @click="decreaseCap"
        >
          降低奇点上限
        </button>
        <button
          class="c-laitela-singularity__cap-control"
          :class="{ 'c-laitela-singularity__cap-control--available' : singularityCapIncreases < 50 }"
          :ach-tooltip="increaseTooltip"
          @click="increaseCap"
        >
          提高奇点上限
        </button>
        <br>
        每一步会使所需暗能量变为 {{ formatX(10) }}，
        <br>
        但获得的奇点也会变为 {{ formatX(perStepFactor) }}。
      </div>
      <div v-else>
        <br>
        达到 {{ format(10) }} 个奇点
        <br>
        即可解锁批量奇点。
        <br>
      </div>
      <br>
      <span v-if="hasAutoSingularity">自动</span>凝聚总耗时：
      {{ baseSingularityTime }}
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">
        (+{{ additionalSingularityTime }})
      </span>
      <br>
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">手动</span>
      奇点获取速度：{{ manualSingularityRate }}
      <br>
      <span v-if="hasAutoSingularity && autoSingularityFactor !== 1">
        自动奇点获取速度：{{ autoSingularityRate }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.c-laitela-singularity__cap-control {
  margin: 0 0.3rem 1rem;
}
</style>
