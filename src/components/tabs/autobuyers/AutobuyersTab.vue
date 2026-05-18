<script>
import AutobuyerToggles from "./AutobuyerToggles";
import BigCrunchAutobuyerBox from "./BigCrunchAutobuyerBox";
import DimensionAutobuyerBox from "./DimensionAutobuyerBox";
import DimensionBoostAutobuyerBox from "./DimensionBoostAutobuyerBox";
import EternityAutobuyerBox from "./EternityAutobuyerBox";
import GalaxyAutobuyerBox from "./GalaxyAutobuyerBox";
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";
import RealityAutobuyerBox from "./RealityAutobuyerBox";
import SimpleAutobuyersMultiBox from "./SimpleAutobuyersMultiBox";
import TickspeedAutobuyerBox from "./TickspeedAutobuyerBox";

export default {
  name: "AutobuyersTab",
  components: {
    AutobuyerToggles,
    OpenModalHotkeysButton,
    RealityAutobuyerBox,
    EternityAutobuyerBox,
    BigCrunchAutobuyerBox,
    GalaxyAutobuyerBox,
    DimensionBoostAutobuyerBox,
    TickspeedAutobuyerBox,
    DimensionAutobuyerBox,
    SimpleAutobuyersMultiBox
  },
  data() {
    return {
      hasInfinity: false,
      hasContinuum: false,
      displayADAutobuyersIndividually: false,
      hasInstant: false,
    };
  },
  computed: {
    // It only makes sense to show this if the player has seen gamespeed-altering effects, but we should keep it there
    // permanently as soon as they have
    hasSeenGamespeedAlteringEffects() {
      return PlayerProgress.seenAlteredSpeed();
    },
    gameTickLength() {
      return `${formatInt(player.options.updateRate)} ms`;
    }
  },
  methods: {
    update() {
      this.hasInfinity = PlayerProgress.infinityUnlocked();
      this.hasContinuum = Laitela.continuumActive;
      this.checkADAutoStatus();
    },
    checkADAutoStatus() {
      const ad = Autobuyer.antimatterDimension;
      // Since you don't need to buy autobuyers in Doomed and unbought ones are hidden, we can check if only the
      // autobuyers you can see (ie, have unlocked) have been maxed.
      if (Pelle.isDoomed) {
        this.displayADAutobuyersIndividually = !ad.zeroIndexed.filter(x => x.isUnlocked)
          .every(x => x.hasUnlimitedBulk && x.hasMaxedInterval);
        return;
      }
      this.hasInstant = ad.hasInstant;
      this.displayADAutobuyersIndividually = !ad.collapseDisplay;
    },
  }
};
</script>

<template>
  <div class="l-autobuyers-tab">
    <AutobuyerToggles />
    <OpenModalHotkeysButton />
    <div v-if="hasSeenGamespeedAlteringEffects">
      自动购买器间隔和基于时间的设置始终按<b>真实时间</b>计算，因此
      <br>
      不会受到任何游戏速度变化效果影响。
      <br>
      <br>
    </div>
    <div v-if="!hasInfinity">
      到达无限后会解锁用于升级自动购买器的挑战。
    </div>
    <b>未显示批量上限的自动购买器默认拥有无限批量。</b>
    <b>
      反物质维度自动购买器的间隔低于 {{ formatInt(100) }} 毫秒后，可以升级批量购买数量。
    </b>
    <b v-if="hasInstant">间隔为“瞬间”的自动购买器会在每个游戏 tick 触发（{{ gameTickLength }}）。</b>
    <RealityAutobuyerBox class="c-reality-pos" />
    <EternityAutobuyerBox class="c-eternity-pos" />
    <BigCrunchAutobuyerBox class="c-infinity-pos" />
    <GalaxyAutobuyerBox />
    <DimensionBoostAutobuyerBox />
    <TickspeedAutobuyerBox v-if="!hasContinuum" />
    <template v-if="displayADAutobuyersIndividually">
      <DimensionAutobuyerBox
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </template>
    <SimpleAutobuyersMultiBox />
  </div>
</template>

<style scoped>
/* This is necessary for the ExpandingControlBox within these components to render in the right stacking order
when they're open. It looks slightly hacky but actually can't be done any other way; each AutobuyerBox creates
its own stacking context, which means that all z-indices specified within are essentially scoped and the
AutobuyerBox components will always render in page order regardless of internal z-indices without these. */
.c-reality-pos {
  z-index: 3;
}

.c-eternity-pos {
  z-index: 2;
}

.c-infinity-pos {
  z-index: 1;
}
</style>
