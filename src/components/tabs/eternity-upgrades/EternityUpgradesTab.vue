<script>
import EPMultiplierButton from "./EPMultiplierButton";
import EternityUpgradeButton from "./EternityUpgradeButton";

export default {
  name: "EternityUpgradesTab",
  components: {
    EternityUpgradeButton,
    EPMultiplierButton
  },
  computed: {
    grid() {
      return [
        [
          EternityUpgrade.idMultEP,
          EternityUpgrade.idMultEternities,
          EternityUpgrade.idMultICRecords
        ],
        [
          EternityUpgrade.tdMultAchs,
          EternityUpgrade.tdMultTheorems,
          EternityUpgrade.tdMultRealTime,
        ]
      ];
    },
    costIncreases: () => EternityUpgrade.epMult.costIncreaseThresholds.map(x => new Decimal(x))
  },
  methods: {
    formatPostBreak
  }
};
</script>

<template>
  <div class="l-eternity-upgrades-grid">
    <div
      v-for="(row, i) in grid"
      :key="i"
      class="l-eternity-upgrades-grid__row"
    >
      <EternityUpgradeButton
        v-for="upgrade in row"
        :key="upgrade.id"
        :upgrade="upgrade"
        class="l-eternity-upgrades-grid__cell"
      />
    </div>
    <EPMultiplierButton />
    <div>
      {{ formatX(5) }} 倍永恒点数升级会在 {{ format(costIncreases[0]) }}、
      {{ formatPostBreak(costIncreases[1], 2) }}、{{ formatPostBreak(costIncreases[2]) }} 永恒点数时出现花费跳跃。
      <br>
      超过 {{ formatPostBreak(costIncreases[3]) }} 永恒点数后，花费会按超指数速度增长。
    </div>
  </div>
</template>

<style scoped>
.l-eternity-upgrades-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.l-eternity-upgrades-grid__row {
  display: flex;
  flex-direction: row;
}

.l-eternity-upgrades-grid__cell {
  margin: 0.5rem 0.8rem;
}
</style>
