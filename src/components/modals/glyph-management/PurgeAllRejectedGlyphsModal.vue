<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllRejectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isRefining: false,
    };
  },
  computed: {
    refiningOrSacrificing() {
      if (this.isRefining) return `精炼`;
      return `献祭`;
    },
    topLabel() {
      return `即将${this.refiningOrSacrificing}所有被过滤器拒绝的 Glyph`;
    },
    message() {
      const negativeWarning = AutoGlyphProcessor.hasNegativeEffectScore()
        ? ` 注意：你的部分效果过滤器评分为负数，这可能会让一些通常想保留的 Glyph 被移除。`
        : "";
      return `确定要${this.refiningOrSacrificing}所有被拒绝的 Glyph 吗？这会移除所有会被当前 Glyph 过滤器设置拒绝的 Glyph。${negativeWarning}`;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `这次不会移除任何 Glyph。`;
      if (this.glyphsDeleted === this.glyphsTotal) return `这会移除你的所有 Glyph。`;
      return `这会移除 ${this.glyphsDeleted}/${this.glyphsTotal} 个 Glyph。`;
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.deleteAllRejected(false);
    },
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
    },
    handleYesClick() {
      Glyphs.deleteAllRejected(true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrificeAll"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
