<script>
import { BlackHoleAnimation } from "./black-hole-animation";
import BlackHoleChargingSliders from "./BlackHoleChargingSliders";
import BlackHoleStateRow from "./BlackHoleStateRow";
import BlackHoleUnlockButton from "./BlackHoleUnlockButton";
import BlackHoleUpgradeRow from "./BlackHoleUpgradeRow";

export default {
  name: "BlackHoleTab",
  components: {
    BlackHoleUpgradeRow,
    BlackHoleStateRow,
    BlackHoleChargingSliders,
    BlackHoleUnlockButton
  },
  data() {
    return {
      isDoomed: false,
      isUnlocked: false,
      isPaused: false,
      isEnslaved: false,
      isLaitela: false,
      pauseMode: 0,
      detailedBH2: "",
      isPermanent: false,
      hasBH2: false,
      blackHoleUptime: [],
      stateChange: "",
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    pauseModeString() {
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          return "不暂停";
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          return this.hasBH2 ? "黑洞 1 激活前" : "激活前";
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          return "黑洞 2 激活前";
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
    },
  },
  mounted() {
    this.startAnimation();
  },
  destroyed() {
    if (this.animation) this.animation.unmount();
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isUnlocked = BlackHoles.areUnlocked;
      this.isPaused = BlackHoles.arePaused;
      // If stop running enslaved, re-mount the black hole animation as it reappears
      if (this.isEnslaved && !Enslaved.isRunning) {
        if (this.animation) this.animation.unmount();
        this.startAnimation();
      }
      this.isEnslaved = Enslaved.isRunning;
      this.isLaitela = Laitela.isRunning;
      this.isPermanent = BlackHoles.arePermanent;
      this.pauseMode = player.blackHoleAutoPauseMode;
      this.hasBH2 = BlackHole(2).isUnlocked;
      this.blackHoleUptime = [BlackHole(1).duration / BlackHole(1).cycleLength,
        BlackHole(2).duration / BlackHole(2).cycleLength];
      this.detailedBH2 = this.bh2Status();

      if (player.blackHoleNegative < 1 && !this.isLaitela) this.stateChange = this.isPaused ? "取消反向" : "反向";
      else this.stateChange = this.isPaused ? "继续" : "暂停";
    },
    bh2Status() {
      const bh1Remaining = BlackHole(1).timeWithPreviousActiveToNextStateChange;
      const bh2Remaining = BlackHole(2).timeWithPreviousActiveToNextStateChange;

      // Both BH active
      if (BlackHole(1).isActive && BlackHole(2).isActive) {
        const bh2Duration = Math.min(bh1Remaining, bh2Remaining);
        return `黑洞 2 将继续激活 ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}！`;
      }

      // BH1 active, BH2 will trigger before BH1 runs out
      if (BlackHole(1).isActive && (bh2Remaining < bh1Remaining)) {
        const bh2Duration = Math.min(bh1Remaining - bh2Remaining, BlackHole(2).duration);
        return `黑洞 2 会在黑洞 1 结束前激活，并持续 ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}`;
      }

      // BH2 won't start yet next cycle
      if (BlackHole(1).isActive || (bh2Remaining > BlackHole(1).duration)) {
        const cycleCount = BlackHole(1).isActive
          ? Math.floor((bh2Remaining - bh1Remaining) / BlackHole(1).duration) + 1
          : Math.floor(bh2Remaining / BlackHole(1).duration);
        return `黑洞 2 会在黑洞 1 再激活 ${formatInt(cycleCount)} 个周期后启动。`;
      }

      // BH1 inactive, BH2 ready to go when BH1 activates
      if (BlackHole(2).isCharged) {
        const bh2Duration = Math.min(BlackHole(1).duration, bh2Remaining);
        return `黑洞 2 会随黑洞 1 一起激活，持续 ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}。`;
      }

      // BH1 inactive, BH2 starts at some point after BH1 activates
      const bh2Duration = Math.min(BlackHole(1).duration - bh2Remaining, BlackHole(2).duration);
      return `黑洞 2 会在黑洞 1 激活后 ${TimeSpan.fromSeconds(bh2Remaining).toStringShort()} 启动，
        持续 ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}。`;
    },
    togglePause() {
      BlackHoles.togglePause();
      if (BlackHoles.arePaused) {
        player.celestials.enslaved.isAutoReleasing = false;
      }
      this.update();
    },
    changePauseMode() {
      let steps;
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          // Note: We don't need to check for permanent BH2 because the button disappears at that point
          steps = BlackHole(1).isPermanent ? 2 : 1;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          steps = this.hasBH2 ? 1 : 2;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          steps = 1;
          break;
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
      player.blackHoleAutoPauseMode = (this.pauseMode + steps) % Object.values(BLACK_HOLE_PAUSE_MODE).length;
    },
    startAnimation() {
      setTimeout(() => {
        if (this.$refs.canvas) {
          this.animation = new BlackHoleAnimation(this.$refs.canvas.getContext("2d"));
        }
      }, 1);
    },
    gridStyle() {
      return this.isPermanent ? "l-black-hole-upgrade-permanent" : "l-black-hole-upgrade-grid";
    },
  },
};
</script>

<template>
  <div class="l-black-hole-tab">
    <div
      v-if="isEnslaved || isDoomed"
      class="c-black-hole-disabled-description"
    >
      <i v-if="isEnslaved">
        你必须……寻找……其他办法……
        <br>
      </i>
      本次现实的物理法则不允许黑洞存在。
    </div>
    <div
      v-else-if="!isUnlocked"
      class="l-pre-unlock-text"
    >
      <BlackHoleUnlockButton @blackholeunlock="startAnimation" />
      黑洞会在短时间内显著提高整个游戏的运行速度。
      <br>
      初始效果为每小时触发一次，持续 {{ formatInt(10) }} 秒，速度提高 {{ formatX(180) }}。
      <br>
      <br>
      解锁黑洞还会提供 {{ formatInt(10) }} 自动机点数。
    </div>
    <template v-else>
      <div class="c-subtab-option-container">
        <button
          class="o-primary-btn o-primary-btn--subtab-option"
          @click="togglePause"
        >
          {{ stateChange }}黑洞
        </button>
        <button
          v-if="!isPermanent"
          class="o-primary-btn o-primary-btn--subtab-option l-auto-pause-button"
          @click="changePauseMode"
        >
          自动暂停：{{ pauseModeString }}
        </button>
      </div>
      <canvas
        ref="canvas"
        class="c-black-hole-canvas"
        width="400"
        height="400"
      />
      <div class="l-black-hole-upgrade-grid">
        <BlackHoleStateRow
          v-for="(blackHole, i) in blackHoles"
          :key="'state' + i"
          :black-hole="blackHole"
        />
        <span v-if="hasBH2 && !isPermanent">
          <b>{{ detailedBH2 }}</b>
          <br>
          黑洞 2 的计时器只会在黑洞 1 激活时推进。
          <br>
          升级影响的是内部计时；顶部显示的是距离下次激活的真实时间。
        </span>
        <br>
        <div v-if="!isPermanent">
          当黑洞激活时间占比超过 {{ formatPercents(0.9999, 2) }} 时，会变为永久激活。
          <br>
          激活时间占比：{{ formatPercents(blackHoleUptime[0], 3) }}
          <span v-if="hasBH2">和 {{ formatPercents(blackHoleUptime[1], 3) }}</span>
        </div>
        <BlackHoleChargingSliders
          v-if="!isLaitela"
          class="l-enslaved-shop-container"
        />
      </div>
      <div :class="gridStyle()">
        <BlackHoleUpgradeRow
          v-for="(blackHole, i) in blackHoles"
          :key="'upgrades' + i"
          :black-hole="blackHole"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.l-auto-pause-button {
  width: 30rem;
}

.l-pre-unlock-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-black-hole-disabled-description {
  font-size: 2.5rem;
  line-height: 1.5;
}
</style>
