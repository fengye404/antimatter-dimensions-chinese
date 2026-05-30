<script>
import ImaginaryUpgradeButton from "./ImaginaryUpgradeButton";

export default {
  name: "ImaginaryUpgradesTab",
  components: {
    ImaginaryUpgradeButton
  },
  data() {
    return {
      baseRMCap: new Decimal(),
      capRM: new Decimal(),
      scaleTime: 0,
      capStr: "",
    };
  },
  computed: {
    upgrades: () => ImaginaryUpgrades.all,
    lockTooltip: () => `条件锁只会阻止手动和自动操作；相关升级本身不会被禁用，
      仍有可能导致条件失败。`,
  },
  methods: {
    update() {
      this.baseRMCap.copyFrom(MachineHandler.baseRMCap);
      this.capRM.copyFrom(MachineHandler.hardcapRM);
      this.scaleTime = MachineHandler.scaleTimeForIM;
      this.capStr = formatMachines(MachineHandler.hardcapRM, MachineHandler.currentIMCap);
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-cap-text">
      你的机器上限为 <span class="c-reality-tab__reality-machines">{{ capStr }}</span>。
    </div>
    <div class="c-info-text">
      你已经触及现实的边界，最多只能持有 {{ format(capRM) }} 台现实机器。
      <br>
      超过 {{ format(baseRMCap) }} 的现实机器获取量会提高你的虚幻机器持有上限。
      <br>
      虚幻机器会随时间自动获得，直到接近上限；越接近上限，获取速度衰减越明显。
      <br>
      每 {{ formatInt(scaleTime) }} 秒，当前虚幻机器与上限之间的差距都会减半。
      <br>
      <br>
      前两行升级可以无限重复购买；其余升级为带有解锁条件的一次性升级。
      <br>
      这些升级的玩法和显示规则与现实升级相同，但消耗的是虚幻机器。
      <span :ach-tooltip="lockTooltip">
        <i class="fas fa-question-circle" />
      </span>
    </div>
    <div
      v-for="row in 5"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <ImaginaryUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-cap-text {
  color: var(--color-text);
  font-size: 1.5rem;
}

.c-info-text {
  color: var(--color-text);
  margin: 1.5rem;
}
</style>
