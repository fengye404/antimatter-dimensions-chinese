<script>
import ButtonCycle from "@/components/ButtonCycle";
import ToggleButton from "@/components/ToggleButton";

export default {
  name: "GlyphAutosortButtonGroup",
  components: {
    ToggleButton,
    ButtonCycle
  },
  data() {
    return {
      autoSort: 0,
      showScoreFilter: false,
      autoCollapse: false,
      showAutoAutoClean: false,
      autoAutoClean: false,
      applyFilterToPurge: false,
    };
  },
  computed: {
    sortModes() {
      // These are the keys for AUTO_SORT_MODE, with SCORE only added conditionally if unlocked
      const availableSortModes = ["不排序", "等级", "强度", "效果"];
      if (this.showScoreFilter) availableSortModes.push("分数");
      return availableSortModes;
    },
    questionMarkTooltip() {
      return `以下自动整理设置会在每次现实后执行。`;
    },
    keepTooltip() {
      return "开启后，只要符文通过筛选器，就不会因为数值较差而被自动清理。";
    }
  },
  watch: {
    autoSort(newValue) {
      player.reality.autoSort = newValue;
    },
    autoCollapse(newValue) {
      player.reality.autoCollapse = newValue;
    },
    autoAutoClean(newValue) {
      player.reality.autoAutoClean = newValue;
    },
    applyFilterToPurge(newValue) {
      player.reality.applyFilterToPurge = newValue;
    },
  },
  methods: {
    update() {
      this.autoSort = player.reality.autoSort;
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.autoCollapse = player.reality.autoCollapse;
      this.showAutoAutoClean = VUnlocks.autoAutoClean.canBeApplied;
      this.autoAutoClean = player.reality.autoAutoClean;
      this.applyFilterToPurge = player.reality.applyFilterToPurge;
    },
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      <div
        v-tooltip="questionMarkTooltip"
        class="o-questionmark"
      >
        ?
      </div>
      自动整理符文：
    </div>
    <ButtonCycle
      v-model="autoSort"
      class="c-glyph-inventory-option"
      text="自动排序："
      :labels="sortModes"
    />
    <ToggleButton
      v-model="autoCollapse"
      class="c-glyph-inventory-option"
      label="自动收拢空位："
      on="开启"
      off="关闭"
    />
    <ToggleButton
      v-if="showAutoAutoClean"
      v-model="autoAutoClean"
      class="c-glyph-inventory-option"
      label="现实后自动清理："
      on="开启"
      off="关闭"
    />
    <ToggleButton
      v-if="showAutoAutoClean"
      v-model="applyFilterToPurge"
      class="c-glyph-inventory-option"
      label="保留通过筛选的符文："
      on="开启"
      off="关闭"
      tooltip-class="c-glyph-inventory-option__tooltip"
      :tooltip-content="keepTooltip"
    />
  </div>
</template>

<style scoped>

</style>
