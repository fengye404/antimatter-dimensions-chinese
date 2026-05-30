<script>
import EternityMilestoneButton from "./EternityMilestoneButton";

export default {
  name: "EternityMilestonesTab",
  components: {
    EternityMilestoneButton
  },
  data() {
    return {
      eternityCount: new Decimal(),
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.eternity.milestones)
        .sort((a, b) => a.eternities - b.eternities)
        .map(config => new EternityMilestoneState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 3);
    }
  },
  methods: {
    update() {
      this.eternityCount.copyFrom(Currency.eternities.value.floor());
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 3 + column - 1];
    }
  }
};
</script>

<template>
  <div class="l-eternity-milestone-grid">
    <div>你拥有 {{ format(eternityCount, 3) }} 次永恒。</div>
    <div>
      离线生成类里程碑只会在特定条件下生效，悬停可查看条件。
    </div>
    <div
      v-for="row in rows"
      :key="row"
      class="l-eternity-milestone-grid__row"
    >
      <EternityMilestoneButton
        v-for="column in 3"
        :key="row * 3 + column"
        :get-milestone="getMilestone(row, column)"
        class="l-eternity-milestone-grid__cell"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
