<script>
import PrimaryButton from "@/components/PrimaryButton";
import TimeDimensionRow from "./ClassicTimeDimensionRow";

export default {
  name: "ClassicTimeDimensionsTab",
  components: {
    PrimaryButton,
    TimeDimensionRow
  },
  data() {
    return {
      totalUpgrades: 0,
      multPerTickspeed: 0,
      tickspeedSoftcap: 0,
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false,
      showLockedDimCostNote: true,
    };
  },
  computed: {
    costIncreases: () => TimeDimension(1).costIncreaseThresholds,
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !TimeDimension(8).isUnlocked && player.realities >= 1;
      this.totalUpgrades = player.totalTickGained;
      this.multPerTickspeed = FreeTickspeed.multToNext;
      this.tickspeedSoftcap = FreeTickspeed.softcap;
      this.timeShards.copyFrom(Currency.timeShards);
      this.upgradeThreshold.copyFrom(FreeTickspeed.fromShards(Currency.timeShards.value).nextShards);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerRealSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "第 8 无限维度" : "时间碎片";
      this.areAutobuyersUnlocked = Autobuyer.timeDimension(1).isUnlocked;
    },
    maxAll() {
      tryUnlockTimeDimensions();
      maxAllTimeDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllTimeDims();
    }
  }
};
</script>

<template>
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        全部最大
      </PrimaryButton>
      <PrimaryButton
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        切换全部自动购买器
      </PrimaryButton>
    </div>
    <div>
      <p>
        你已经通过
        <span class="c-time-dim-description__accent">{{ format(timeShards, 2, 1) }}</span> 时间碎片获得了
        <span class="c-time-dim-description__accent">{{ formatInt(totalUpgrades) }}</span> 次时间间隔升级。
      </p>
      <p>
        下一次时间间隔升级需要
        <span class="c-time-dim-description__accent">{{ format(upgradeThreshold, 2, 1) }}</span> 时间碎片；
        每获得一次升级，需求都会乘以
        <span class="c-time-dim-description__accent">{{ formatX(multPerTickspeed, 2, 2) }}</span>。
      </p>
    </div>
    <div>
      超过 {{ formatInt(tickspeedSoftcap) }} 次时间间隔升级后，后续需求会开始额外增长。
    </div>
    <div>
      你每秒获得 {{ format(shardsPerSecond, 2, 0) }} {{ incomeType }}。
    </div>
    <div class="l-dimensions-container">
      <TimeDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
    <div>
      时间维度花费会在 {{ format(costIncreases[0], 2, 2) }} 和
      {{ format(costIncreases[1]) }} 永恒点数处跳涨，
      <br>
      并在 {{ format(costIncreases[2]) }} 永恒点数后增长得更快。
      <br>
      <div v-if="showLockedDimCostNote">
        按住 Shift 可查看未解锁时间维度的永恒点数花费。
      </div>
      第 8 时间维度购买次数超过 {{ format(1e8) }} 后，不会继续提高倍率。
    </div>
  </div>
</template>
