<script>
import BlackHoleChargingSliders from "@/components/tabs/black-hole/BlackHoleChargingSliders";
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "EnslavedTab",
  components: {
    CelestialQuoteHistory,
    PrimaryButton,
    PrimaryToggleButton,
    BlackHoleChargingSliders
  },
  data: () => ({
    isStoringBlackHole: false,
    isStoringReal: false,
    autoStoreReal: false,
    offlineEnabled: false,
    hasAutoRelease: false,
    isRunning: false,
    completed: false,
    storedBlackHole: 0,
    storedReal: 0,
    storedRealEffiency: 0,
    storedRealCap: 0,
    autoRelease: false,
    autoReleaseSpeed: 0,
    unlocks: [],
    buyableUnlocks: [],
    quote: "",
    currentSpeedUp: 0,
    hintsUnlocked: false,
    canModifyGameTimeStorage: false,
    canChangeStoreTime: false,
    canChangeStoreRealTime: false,
    canDischarge: false,
    canAutoRelease: false,
    hasNoCharge: true,
    hasReachedCurrentCap: false,
  }),
  computed: {
    storedRealEfficiencyDesc() {
      return formatPercents(this.storedRealEffiency);
    },
    storedRealCapDesc() {
      return timeDisplayShort(this.storedRealCap);
    },
    unlocksInfo() {
      return ENSLAVED_UNLOCKS;
    },
    nerfedBlackHoleTime() {
      return Enslaved.storedTimeInsideEnslaved(this.storedBlackHole);
    },
    realityTitle() {
      if (this.isRunning) return "你正在无名之辈的现实中";
      return "开始无名之辈的现实";
    },
    runButtonClassObject() {
      return {
        "c-enslaved-run-button__icon": true,
        "c-enslaved-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[2].effects().split("\n");
    },
    realTimeButtonText() {
      if (!this.offlineEnabled) return "离线进度已关闭";
      if (this.autoStoreReal) return "离线时间会被储存";
      return "离线时间用于生产";
    },
    // Use this here since Nameless has a fairly non-standard character, and SFCs don't support using \uf0c1
    enslavedSymbol: () => Enslaved.symbol,
    isDoomed: () => Pelle.isDoomed,
    storeGameTimeClass() {
      return {
        "o-enslaved-mechanic-button": true,
        "o-enslaved-mechanic-button--clickable": this.canModifyGameTimeStorage,
        "o-enslaved-mechanic-button--storing-time": this.isStoringBlackHole,
        "l-fixed-setting": !this.canModifyGameTimeStorage,
        "o-pelle-disabled": this.isDoomed
      };
    },
    storeRealTimeClass() {
      return {
        "o-enslaved-mechanic-button": true,
        "o-enslaved-mechanic-button--clickable": !this.isDoomed,
        "o-enslaved-mechanic-button--storing-time": this.isStoringReal,
        "l-fixed-setting": !this.canChangeStoreRealTime,
        "o-pelle-disabled": this.isDoomed
      };
    },
    dischargeClass() {
      return {
        "o-enslaved-mechanic-button": true,
        "o-enslaved-mechanic-button--clickable": !this.isDoomed,
        "l-fixed-setting": !this.canDischarge || this.hasNoCharge,
        "o-pelle-disabled": this.isDoomed
      };
    },
    doomedDisabledClass() {
      return { "o-pelle-disabled": this.isDoomed };
    },
    mechanicButtonClass() {
      return {
        "o-enslaved-mechanic-button": true,
        "o-enslaved-mechanic-button--clickable": !this.isDoomed
      };
    }
  },
  watch: {
    autoRelease(newValue) {
      player.celestials.enslaved.isAutoReleasing = newValue;
    }
  },
  methods: {
    update() {
      this.isStoringBlackHole = Enslaved.isStoringGameTime;
      this.storedBlackHole = player.celestials.enslaved.stored;
      this.isStoringReal = Enslaved.isStoringRealTime;
      this.autoStoreReal = player.celestials.enslaved.autoStoreReal;
      this.offlineEnabled = player.options.offlineProgress;
      this.hasAutoRelease = Ra.unlocks.autoPulseTime.canBeApplied;
      this.isRunning = Enslaved.isRunning;
      this.completed = Enslaved.isCompleted && !this.isDoomed;
      this.storedReal = player.celestials.enslaved.storedReal;
      this.storedRealEffiency = Enslaved.storedRealTimeEfficiency;
      this.storedRealCap = Enslaved.storedRealTimeCap;
      this.unlocks = Array.from(player.celestials.enslaved.unlocks);
      this.buyableUnlocks = Object.values(ENSLAVED_UNLOCKS).map(x => Enslaved.canBuy(x));
      this.quote = Enslaved.quote;
      this.autoRelease = player.celestials.enslaved.isAutoReleasing;
      this.autoReleaseSpeed = Enslaved.isAutoReleasing ? Enslaved.autoReleaseSpeed : 0;
      this.currentSpeedUp = Enslaved.currentBlackHoleStoreAmountPerMs;
      this.hintsUnlocked = EnslavedProgress.hintsUnlocked.hasProgress;
      this.canModifyGameTimeStorage = Enslaved.canModifyGameTimeStorage;
      this.canChangeStoreTime = Enslaved.canModifyGameTimeStorage;
      this.canChangeStoreRealTime = Enslaved.canModifyRealTimeStorage;
      this.canDischarge = Enslaved.canRelease(false);
      this.canAutoRelease = Enslaved.canRelease(true);
      this.hasNoCharge = player.celestials.enslaved.stored === 0;
      this.hasReachedCurrentCap = this.storedReal === this.storedRealCap;
    },
    toggleStoreBlackHole() {
      Enslaved.toggleStoreBlackHole();
    },
    toggleStoreReal() {
      Enslaved.toggleStoreReal();
    },
    toggleAutoStoreReal() {
      if (!this.offlineEnabled) return;
      Enslaved.toggleAutoStoreReal();
    },
    useStored() {
      Enslaved.useStoredTime(false);
    },
    timeDisplayShort(ms) {
      return timeDisplayShort(ms);
    },
    timeUntilBuy(price) {
      return Math.max((price - this.storedBlackHole) / this.currentSpeedUp, 0);
    },
    buyUnlock(info) {
      Enslaved.buyUnlock(info);
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "无名之辈的", number: 2 });
    },
    hasUnlock(info) {
      return Enslaved.has(info);
    },
    canBuyUnlock(info) {
      // This (rather than just using Enslaved.canBuy(info) and removing this.buyableUnlocks)
      // is needed for proper reactivity of button styles (e.g., if you get a level 5000 glyph
      // while on the Nameless tab).
      return this.buyableUnlocks[info.id];
    },
    unlockClassObject(info) {
      return {
        "o-enslaved-shop-button--bought": this.hasUnlock(info),
        "o-enslaved-shop-button--available": this.canBuyUnlock(info)
      };
    },
    glitchStyle(x) {
      const xScale = 15 / 27;
      const yScale = 5;
      const dx = (x - 13) * xScale + (Math.random() * 2 - 1) * 0.85;
      const dy = (Math.random() * 2 - 1) * yScale;
      const height = (Math.pow(Math.random(), 1.5) + 0.25) * 3 * yScale;
      return {
        transform: `translate(${dx}rem, ${dy}rem)`,
        height: `${height}rem`,
      };
    }
  },
};
</script>

<template>
  <div class="l-enslaved-celestial-tab">
    <CelestialQuoteHistory celestial="enslaved" />
    <div
      v-if="hasAutoRelease && canAutoRelease"
      class="c-subtab-option-container"
    >
      <PrimaryToggleButton
        v-model="autoRelease"
        class="o-primary-btn--subtab-option"
        label="自动释放黑洞："
      />
    </div>
    <div class="l-enslaved-celestial-tab--inner">
      <div class="l-enslaved-run-container">
        <div v-if="hasUnlock(unlocksInfo.RUN)">
          <div class="c-enslaved-run-button">
            <div
              class="c-enslaved-run-button__title"
              :class="doomedDisabledClass"
            >
              {{ realityTitle }}
            </div>
            <div v-if="completed">
              <b>（已完成）</b>
            </div>
            <div
              :class="runButtonClassObject"
              @click="startRun"
            >
              <div class="c-enslaved-run-button__icon__sigil">
                {{ enslavedSymbol }}
              </div>
              <div
                v-for="x in (isRunning ? 25 : 0)"
                :key="x"
                class="c-enslaved-run-button__icon__glitch"
                :style="glitchStyle(x)"
              />
            </div>
            <div
              v-for="line in runDescription"
              :key="line"
              class="c-enslaved-run-description-line"
            >
              {{ line }}
            </div>
            <b>奖励：解锁超立方体，可提高无限维度上限（见“无限维度”页）</b>
          </div>
        </div>
      </div>
      <div class="l-enslaved-upgrades-column">
        <PrimaryButton
          v-if="hintsUnlocked"
          class="o-primary-btn"
          onclick="Modal.enslavedHints.show()"
        >
          更仔细地观察这个现实……
        </PrimaryButton>
        <div class="l-enslaved-top-container">
          <div class="l-enslaved-top-container__half">
            充能时，游戏速度倍率会被{{ hasAutoRelease ? "削弱" : "禁用" }}；
            损失的速度会转化为储存的游戏时间。释放黑洞可消耗这些时间，让游戏向前跳过一段进度。
            储存的游戏时间也可用于解锁部分升级。
            <button
              :class="storeGameTimeClass"
              @click="toggleStoreBlackHole"
            >
              <div
                class="o-enslaved-stored-time"
                :class="doomedDisabledClass"
              >
                {{ timeDisplayShort(storedBlackHole) }}
              </div>
              <div>
                {{ isStoringBlackHole ? "正在为黑洞充能": "为黑洞充能" }}
              </div>
            </button>
            <button
              :class="dischargeClass"
              @click="useStored"
            >
              <span>释放黑洞</span>
              <p v-if="isRunning">
                本次现实中相当于 {{ timeDisplayShort(nerfedBlackHoleTime) }}
              </p>
            </button>
          </div>
          <div class="l-enslaved-top-container__half">
            储存真实时间会完全停止生产，使游戏速度变为 {{ formatInt(0) }}。
            储存的真实时间可用于“增幅”一次现实，相当于模拟重复完成这次现实。
            被增幅的现实会照常给出所有奖励。
            <button
              :class="[storeRealTimeClass,
                       {'l-fixed-setting': hasReachedCurrentCap}]"
              @click="toggleStoreReal"
            >
              <div class="o-enslaved-stored-time">
                {{ timeDisplayShort(storedReal) }}
              </div>
              <div>
                {{ isStoringReal ? "正在储存真实时间": "储存真实时间" }}
              </div>
            </button>
            <button
              :class="[mechanicButtonClass,
                       {'o-enslaved-mechanic-button--storing-time': autoStoreReal && offlineEnabled,
                        'l-fixed-setting': !canChangeStoreRealTime || !offlineEnabled},
                       doomedDisabledClass]"
              @click="toggleAutoStoreReal"
            >
              {{ realTimeButtonText }}
            </button>
            <div>
              效率：{{ storedRealEfficiencyDesc }}
            </div>
            <div>
              真实时间储存上限：{{ storedRealCapDesc }}
            </div>
          </div>
        </div>
        <BlackHoleChargingSliders />
        <br>
        <div class="l-enslaved-shop-container">
          <button
            v-for="unlock in unlocksInfo"
            :key="unlock.id"
            class="o-enslaved-shop-button"
            :class="unlockClassObject(unlock)"
            @click="buyUnlock(unlock)"
          >
            {{ unlock.description() }}
            <div v-if="!hasUnlock(unlock)">
              花费：{{ timeDisplayShort(unlock.price) }}
            </div>
            <span v-if="isStoringBlackHole && !hasUnlock(unlock) && timeUntilBuy(unlock.price) > 0">
              预计还需：{{ timeDisplayShort(timeUntilBuy(unlock.price)) }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-enslaved-run-description-line {
  margin-bottom: 1rem;
}

.l-fixed-setting {
  cursor: pointer;
  pointer-events: none;
  filter: brightness(70%);
}
</style>
