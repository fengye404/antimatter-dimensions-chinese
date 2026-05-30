<script>
export default {
  name: "DilationButton",
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(),
      canEternity: false,
      eternityGoal: new Decimal(),
      tachyonGain: new Decimal(),
      remnantRequirement: 0,
      showRequirement: false,
      creditsClosed: false
    };
  },
  computed: {
    disableText() {
      // Doesn't need to be reactive or check strike status; it's always permanent once entered in Doomed
      return Pelle.isDoomed ? "时间膨胀已永久生效。" : "退出时间膨胀。";
    }
  },
  methods: {
    update() {
      this.isUnlocked = PlayerProgress.dilationUnlocked();
      this.isRunning = player.dilation.active;
      this.remnantRequirement = Pelle.remnantRequirementForDilation;
      this.showRequirement = Pelle.isDoomed && !Pelle.canDilateInPelle;
      if (!this.isRunning) return;
      this.canEternity = Player.canEternity;
      // This lets this.hasGain be true even before eternity.
      this.hasGain = getTachyonGain(false).gt(0);
      if (this.canEternity && this.hasGain) {
        this.tachyonGain.copyFrom(getTachyonGain(true));
      } else if (this.hasGain) {
        this.eternityGoal.copyFrom(Player.eternityGoal);
      } else {
        this.requiredForGain.copyFrom(getTachyonReq());
      }
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    dilate() {
      if (this.creditsClosed) return;
      startDilatedEternityRequest();
    }
  }
};
</script>

<template>
  <button
    class="o-dilation-btn"
    :class="isUnlocked ? 'o-dilation-btn--unlocked' : 'o-dilation-btn--locked'"
    @click="dilate()"
  >
    <span v-if="!isUnlocked">购买时间膨胀研究来解锁。</span>
    <span v-else-if="!isRunning">
      进入时间膨胀。
      <div v-if="showRequirement">
        需要 {{ format(remnantRequirement, 2) }} 残迹
      </div>
    </span>
    <span v-else-if="canEternity && hasGain">
      {{ disableText }}
      <br>
      获得 {{ format(tachyonGain, 2, 1) }} 快子粒子。
    </span>
    <span v-else-if="hasGain">
      {{ disableText }}
      <br>
      达到 {{ format(eternityGoal, 1, 0) }} 无限点数后永恒，即可获得快子粒子。
    </span>
    <span v-else>
      {{ disableText }}
      <br>
      达到 {{ format(requiredForGain, 2, 1) }} 反物质后才能获得更多快子粒子。
    </span>
  </button>
</template>

<style scoped>

</style>
