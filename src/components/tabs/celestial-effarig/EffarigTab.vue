<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import EffarigRunUnlockReward from "./EffarigRunUnlockReward";
import EffarigUnlockButton from "./EffarigUnlockButton";

export default {
  name: "EffarigTab",
  components: {
    EffarigUnlockButton,
    EffarigRunUnlockReward,
    CelestialQuoteHistory,
  },
  data() {
    return {
      relicShards: 0,
      shardRarityBoost: 0,
      shardPower: 0,
      shardsGained: 0,
      currentShardsRate: 0,
      amplification: 0,
      amplifiedShards: 0,
      amplifiedShardsRate: 0,
      runUnlocked: false,
      quote: "",
      isRunning: false,
      vIsFlipped: false,
      relicShardRarityAlwaysMax: false
    };
  },
  computed: {
    shopUnlocks: () => [
      EffarigUnlock.adjuster,
      EffarigUnlock.glyphFilter,
      EffarigUnlock.setSaves
    ],
    runUnlock: () => EffarigUnlock.run,
    runUnlocks: () => [
      EffarigUnlock.infinity,
      EffarigUnlock.eternity,
      EffarigUnlock.reality
    ],
    symbol: () => GLYPH_SYMBOLS.effarig,
    runButtonOuterClass() {
      return {
        "l-effarig-run-button": true,
        "c-effarig-run-button": true,
        "c-effarig-run-button--running": this.isRunning,
        "c-effarig-run-button--not-running": !this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runButtonInnerClass() {
      return this.isRunning ? "c-effarig-run-button__inner--running" : "c-effarig-run-button__inner--not-running";
    },
    runDescription() {
      return `${GameDatabase.celestials.descriptions[1].effects()}\n
      ${GameDatabase.celestials.descriptions[1].description()}`;
    },
    showShardsRate() {
      return this.currentShardsRate;
    },
    isDoomed: () => Pelle.isDoomed,
  },
  watch: {
    isRunning() {
      this.$recompute("runDescription");
    }
  },
  methods: {
    update() {
      this.relicShards = Currency.relicShards.value;
      this.shardRarityBoost = Effarig.maxRarityBoost / 100;
      this.shardPower = Ra.unlocks.maxGlyphRarityAndShardSacrificeBoost.effectOrDefault(1);
      this.shardsGained = Effarig.shardsGained;
      this.currentShardsRate = (this.shardsGained / Time.thisRealityRealTime.totalMinutes);
      this.amplification = simulatedRealityCount(false);
      this.amplifiedShards = this.shardsGained * (1 + this.amplification);
      this.amplifiedShardsRate = (this.amplifiedShards / Time.thisRealityRealTime.totalMinutes);
      this.quote = Effarig.quote;
      this.runUnlocked = EffarigUnlock.run.isUnlocked;
      this.isRunning = Effarig.isRunning;
      this.vIsFlipped = V.isFlipped;
      this.relicShardRarityAlwaysMax = Ra.unlocks.extraGlyphChoicesAndRelicShardRarityAlwaysMax.canBeApplied;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Effarig 的", number: 1 });
    },
    createCursedGlyph() {
      Glyphs.giveCursedGlyph();
    }
  }
};
</script>

<template>
  <div class="l-teresa-celestial-tab">
    <CelestialQuoteHistory celestial="effarig" />
    <div class="l-effarig-shop-and-run">
      <div class="l-effarig-shop">
        <div class="c-effarig-relics">
          你有 {{ quantify("遗物碎片", relicShards, 2, 0) }}。
          <br>
          <span v-if="relicShardRarityAlwaysMax">
            新获得的符文稀有度固定提高 +{{ formatPercents(shardRarityBoost, 2) }}。
          </span>
          <span v-else>
            每个新符文的稀有度都会随机提高
            <br>
            +{{ formatPercents(0) }} 到 +{{ formatPercents(shardRarityBoost, 2) }}。
          </span>
          <span v-if="shardPower > 1">
            <br>
            符文献祭收益也会提升为 {{ formatPow(shardPower, 0, 2) }}。
          </span>
        </div>
        <div class="c-effarig-relic-description">
          下次现实可获得 {{ quantify("遗物碎片", shardsGained, 2) }}
          （{{ format(currentShardsRate, 2) }}/分钟）。
          <span v-if="amplification !== 0">
            <br>
            由于当前现实已被增幅，
            <br>
            实际总共会获得
            {{ quantify("遗物碎片", amplifiedShards, 2) }}（{{ format(amplifiedShardsRate, 2) }}/分钟）。
          </span>
        </div>
        <div class="c-effarig-relic-description">
          <br>
          永恒点数越多，遗物碎片收益会略微增加；
          <br>
          装备的不同符文效果越多，收益会大幅增加。
          <br>
        </div>
        <EffarigUnlockButton
          v-for="(unlock, i) in shopUnlocks"
          :key="i"
          :unlock="unlock"
        />
        <EffarigUnlockButton
          v-if="!runUnlocked"
          :unlock="runUnlock"
        />
        <button
          v-if="vIsFlipped"
          class="c-effarig-shop-button c-effarig-shop-button--available"
          @click="createCursedGlyph"
        >
          获得一个诅咒符文……
        </button>
      </div>
      <div
        v-if="runUnlocked"
        class="l-effarig-run"
      >
        <div class="c-effarig-run-description">
          <span :class="{ 'o-pelle-disabled': isDoomed }">
            进入 Effarig 的现实。
          </span>
        </div>
        <div
          :class="runButtonOuterClass"
          @click="startRun"
        >
          <div
            :class="runButtonInnerClass"
            :button-symbol="symbol"
          >
            {{ symbol }}
          </div>
        </div>
        <div class="c-effarig-run-description">
          {{ runDescription }}
        </div>
        <EffarigRunUnlockReward
          v-for="(unlock, i) in runUnlocks"
          :key="i"
          :unlock="unlock"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-effarig-relic-description {
  width: 46rem;
}
</style>
