<script>
export default {
  name: "ResetRealityButton",
  data() {
    return {
      canReality: false,
      resetCelestial: false,
      isInCelestialReality: false,
      isDoomed: false,
    };
  },
  computed: {
    resetText() {
      if (this.isDoomed) return "重新开始本次末日";
      if (this.isInCelestialReality && !this.resetCelestial) return "提前退出本次天神现实";
      if (this.isInCelestialReality && this.resetCelestial) return "重开本次天神现实";
      return "重新开始本次现实";
    },
  },
  methods: {
    update() {
      this.canReality = TimeStudy.reality.isBought && player.records.thisReality.maxEP.exponent >= 4000;
      this.resetCelestial = player.options.retryCelestial;
      this.isInCelestialReality = isInCelestialReality();
      this.isDoomed = Pelle.isDoomed;
    },
    resetReality() {
      const confirms = player.options.confirmations;
      if (GameEnd.creditsClosed) return;
      if (this.isInCelestialReality) {
        if (confirms.exitChallenge) Modal.exitChallenge.show({
          challengeName: "一次天神现实",
          normalName: "现实",
          hasHigherLayers: false,
          exitFn: () => beginProcessReality(getRealityProps(true))
        });
        else beginProcessReality(getRealityProps(true));
      } else if (confirms.resetReality) Modal.resetReality.show();
      else beginProcessReality(getRealityProps(true));
    },
  }
};
</script>

<template>
  <button
    :class="['l-reset-reality-button',
             'c-reset-reality-button',
             {'c-reset-reality-button-celestial': isInCelestialReality}]"
    @click="resetReality"
  >
    <div class="l-reality-button__contents">
      {{ resetText }}
    </div>
  </button>
</template>

<style scoped>

</style>
