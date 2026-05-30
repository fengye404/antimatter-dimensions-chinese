<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "LaitelaRunButton",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      realityTime: 0,
      maxDimTier: 0,
      isRunning: false,
      realityReward: 1,
      singularitiesUnlocked: false,
      bestSet: [],
      tierNotCompleted: true,
    };
  },
  computed: {
    completionTime() {
      if (this.tierNotCompleted) return "尚未在这一层完成";
      return `最快完成时间：${TimeSpan.fromSeconds(this.realityTime).toStringShort()}`;
    },
    runEffects() {
      return GameDatabase.celestials.descriptions[5].effects().split("\n");
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[5].description();
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.realityTime = player.celestials.laitela.fastestCompletion;
      this.maxDimTier = Laitela.maxAllowedDimension;
      this.realityReward = Laitela.realityReward;
      this.isRunning = Laitela.isRunning;
      this.singularitiesUnlocked = Currency.singularities.gt(0);
      this.bestSet = Glyphs.copyForRecords(player.records.bestReality.laitelaSet);
      this.tierNotCompleted = this.realityTime === 3600 || (this.realityTime === 300 && this.maxDimTier < 8);
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Lai'tela 的", number: 5 });
    },
    classObject() {
      return {
        "o-laitela-run-button": true,
        "o-laitela-run-button--large": !this.singularitiesUnlocked
      };
    },
    runButtonClassObject() {
      return {
        "o-laitela-run-button__icon": true,
        "o-laitela-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
  }
};
</script>

<template>
  <button :class="classObject()">
    <span :class="{ 'o-pelle-disabled': isDoomed }">
      <b>开始 Lai'tela 的现实</b>
    </span>
    <div
      :class="runButtonClassObject()"
      @click="startRun"
    />
    <div v-if="realityReward > 1">
      <b>
        所有暗物质倍率提高 {{ formatX(realityReward, 2, 2) }}。
      </b>
      <span v-if="maxDimTier > 0">
        <br><br>
        {{ completionTime }}
        <br>
        <span v-if="maxDimTier <= 7">
          <b>最高可用维度：第 {{ formatInt(maxDimTier) }} 维度</b>
        </span>
        <br><br>
        符文配置：
        <GlyphSetPreview
          text="Fastest Destabilization Glyph Set"
          :text-hidden="true"
          :force-name-color="false"
          :glyphs="bestSet"
        />
      </span>
      <span v-else>
        <br>
        <b>
          你还会额外获得 {{ formatX(8) }} 暗能量。
        </b>
        <br><br>
        Lai'tela 的现实已经完全失稳，奖励无法继续提高。
      </span>
      <br>
    </div>
    <div
      v-for="(line, lineId) in runEffects"
      :key="lineId + '-laitela-run-desc' + maxDimTier"
    >
      {{ line }} <br>
    </div>
    <br>
    <div>{{ runDescription }}</div>
  </button>
</template>
