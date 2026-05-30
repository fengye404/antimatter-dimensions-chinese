<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "GlyphSetRecordsTab",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      recordGlyphInfo: [],
    };
  },
  methods: {
    update() {
      const bestReality = player.records.bestReality;
      const laitelaDim = 8 - Laitela.difficultyTier;
      this.recordGlyphInfo = [
        [true, Glyphs.copyForRecords(bestReality.RMSet), "最高现实机器获取",
          `${format(bestReality.RM, 2, 2)} 现实机器`],
        [true, Glyphs.copyForRecords(bestReality.RMminSet), "每分钟现实机器最高获取",
          `${format(bestReality.RMmin, 2, 2)} 现实机器/分钟`],
        [true, Glyphs.copyForRecords(bestReality.glyphLevelSet), "最高符文等级",
          `等级 ${formatInt(bestReality.glyphLevel)}`],
        [true, Glyphs.copyForRecords(bestReality.bestEPSet), "最高永恒点数",
          `${format(bestReality.bestEP, 2, 2)} 永恒点数`],
        [true, Glyphs.copyForRecords(bestReality.speedSet), "最快现实（真实时间）",
          `${TimeSpan.fromMilliseconds(bestReality.realTime).toStringShort()}`],
        [player.celestials.teresa.bestRunAM.gt(1), Glyphs.copyForRecords(player.celestials.teresa.bestAMSet),
          `Teresa 现实中的最高反物质`,
          `${format(player.celestials.teresa.bestRunAM, 2, 2)} 反物质`],
        [Currency.imaginaryMachines.gt(0), Glyphs.copyForRecords(bestReality.iMCapSet),
          "最高虚幻机器上限",
          `${format(MachineHandler.currentIMCap, 2, 2)} 虚幻机器`],
        [Laitela.isUnlocked, Glyphs.copyForRecords(bestReality.laitelaSet),
          `最佳 Lai'tela 失稳`,
          `${TimeSpan.fromSeconds(player.celestials.laitela.fastestCompletion).toStringShort()},
          ${laitelaDim} 个维度（${formatX(Laitela.realityReward, 2, 2)} 暗物质）`],
      ];
    },
  }
};
</script>

<template>
  <div class="l-glyph-set-tab">
    <div
      v-for="(set, idx) in recordGlyphInfo"
      :key="idx"
    >
      <div
        v-if="set[0]"
        class="l-glyph-set-entry"
      >
        {{ set[2] }}:
        <GlyphSetPreview
          v-if="set[0]"
          :key="idx"
          :glyphs="set[1]"
          :text="set[2]"
          :text-hidden="true"
        />
        {{ set[3] }}
        <br>
      </div>
    </div>
  </div>
</template>
