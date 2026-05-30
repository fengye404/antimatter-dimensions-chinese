<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "RealityGlyphCreationModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realityGlyphLevel: 0,
      // This contains an array where each entry is an array looking like [4000, "realitygalaxies"]
      possibleEffects: [],
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.realityGlyphLevel = AlchemyResource.reality.effectValue;
      const realityEffectConfigs = GlyphEffects.all
        .filter(eff => eff.glyphTypes.includes("reality"))
        .sort((a, b) => a.bitmaskIndex - b.bitmaskIndex);
      const minRealityEffectIndex = realityEffectConfigs.map(cfg => cfg.bitmaskIndex).min();
      this.possibleEffects = realityEffectConfigs
        .map(cfg => [realityGlyphEffectLevelThresholds[cfg.bitmaskIndex - minRealityEffectIndex], cfg.id]);
    },
    createRealityGlyph() {
      if (GameCache.glyphInventorySpace.value === 0) {
        Modal.message.show("Glyph 背包没有空位；请先献祭一些 Glyph 来腾出空间。",
          { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
        return;
      }
      Glyphs.addToInventory(GlyphGenerator.realityGlyph(this.realityGlyphLevel));
      AlchemyResource.reality.amount = 0;
      player.reality.glyphs.createdRealityGlyph = true;
      this.emitClose();
    },
    formatGlyphEffect(effect) {
      if (this.realityGlyphLevel < effect[0]) return `（需要 Glyph 等级 ${formatInt(effect[0])}）`;
      const config = GlyphEffects[effect[1]];
      const value = config.effect(this.realityGlyphLevel, rarityToStrength(100));
      const effectTemplate = config.singleDesc;
      return effectTemplate.replace("{value}", config.formatEffect(value));
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      创建现实 Glyph
    </template>
    <div class="c-reality-glyph-creation">
      <div>
        创建一个等级 {{ formatInt(realityGlyphLevel) }} 的现实 Glyph。
        稀有度固定为 {{ formatPercents(1) }}，等级取决于你当前拥有的现实资源数量；创建后会消耗全部现实资源。
        其他炼金资源不会受影响。现实 Glyph 拥有独有效果，其中部分效果只会在高等级时出现。
        现实 Glyph 也可以献祭，用来提高所有记忆碎片获取。和 Effarig Glyph 一样，你不能同时装备多个现实 Glyph。
      </div>
      <div class="o-available-effects-container">
        <div class="o-available-effects">
          可用效果：
        </div>
        <div
          v-for="(effect, index) in possibleEffects"
          :key="index"
        >
          {{ formatGlyphEffect(effect) }}
        </div>
      </div>
      <PrimaryButton
        v-if="isDoomed"
        :enabled="false"
      >
        末日中无法创建现实 Glyph
      </PrimaryButton>
      <PrimaryButton
        v-else-if="realityGlyphLevel !== 0"
        @click="createRealityGlyph"
      >
        创建现实 Glyph！
      </PrimaryButton>
      <PrimaryButton
        v-else
        :enabled="false"
      >
        现实 Glyph 等级必须高于 {{ formatInt(0) }}
      </PrimaryButton>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-available-effects-container {
  margin: 1.5rem 0 2rem;
}

.o-available-effects {
  font-weight: bold;
}
</style>
