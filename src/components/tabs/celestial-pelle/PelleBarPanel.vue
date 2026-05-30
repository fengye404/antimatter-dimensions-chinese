<script>
import PelleRift from "./PelleRift";

export default {
  name: "PelleBarPanel",
  components: {
    PelleRift
  },
  data() {
    return {
      decayRate: 0,
      isCollapsed: false,
    };
  },
  computed: {
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    },
    strikes() {
      return PelleStrikes.all;
    }
  },
  methods: {
    update() {
      this.decayRate = Pelle.riftDrainPercent;
      this.isCollapsed = player.celestials.pelle.collapsed.rifts;
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.rifts = !this.isCollapsed;
    },
  }
};
</script>

<template>
  <div class="l-pelle-panel-container">
    <div class="c-pelle-panel-title">
      <i
        :class="collapseIcon"
        class="c-collapse-icon-clickable"
        @click="toggleCollapse"
      />
      Pelle 打击与裂隙
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      点击裂隙条即可激活对应裂隙。
      <span v-if="strikes.length > 1">同时最多只能激活两个裂隙。</span>
      <br v-else>
      激活后，裂隙每秒会消耗另一种资源的 {{ formatPercents(decayRate) }}。
      <br>
      裂隙效果即使未激活也会生效，强度取决于累计吸收的资源总量。
      <b class="o-strike-warning">Pelle 打击的惩罚是永久的，即使末日之后也仍会生效！</b>
      <div class="c-pelle-bar-container">
        <PelleRift
          v-for="strike in strikes"
          :key="strike.config.id"
          :strike="strike"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-collapse-icon-clickable {
  position: absolute;
  top: 50%;
  left: 1.5rem;
  width: 3rem;
  align-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}

.c-pelle-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.o-strike-warning {
  color: var(--color-pelle--base);
  font-size: 1.4rem;
}
</style>
