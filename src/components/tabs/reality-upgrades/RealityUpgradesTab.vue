<script>
import RealityUpgradeButton from "./RealityUpgradeButton";

export default {
  name: "RealityUpgradesTab",
  components: {
    RealityUpgradeButton
  },
  computed: {
    upgrades: () => RealityUpgrades.all,
    costScalingTooltip: () => `价格超过 ${format(1e30)} 现实机器后增长会加快，超过
      ${format(Decimal.NUMBER_MAX_VALUE, 1)} 现实机器后还会进一步加快。`,
    possibleTooltip: () => `棋盘格升级表示本次现实已经无法解锁；条纹升级表示仍然有机会完成条件。`,
    lockTooltip: () => `只有在你尚未失败且尚未解锁该升级时，这个锁定才会生效。`,
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-reality-upgrade-infotext">
      将鼠标移到 <i class="fas fa-question-circle" /> 图标上可查看补充说明。
      <br>
      第一行升级可以反复购买，但价格会不断上升
      <span :ach-tooltip="costScalingTooltip">
        <i class="fas fa-question-circle" />
      </span>
      ；其余升级只能购买一次。
      <br>
      一次性升级还带有解锁条件；条件完成后，该升级会永久开放购买。
      <span :ach-tooltip="possibleTooltip">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      锁定的升级默认显示条件和效果；已解锁的升级显示效果、当前加成和花费。按住 Shift 可临时切换显示内容。
      <br>
      对带有 <i class="fas fa-lock-open" /> 的升级 Shift + 点击后，本次现实会阻止你执行导致条件失败的操作。
      <span :ach-tooltip="lockTooltip">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      每完成购买一整行现实升级，符文等级都会提高 {{ formatInt(1) }}。
    </div>
    <div
      v-for="row in 5"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <RealityUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-reality-upgrade-infotext {
  color: var(--color-text);
  margin: -1rem 0 1.5rem;
  line-height: 1.45;
}
</style>
