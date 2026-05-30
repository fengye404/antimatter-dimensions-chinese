<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    harsh: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    threshold() {
      return this.harsh ? 1 : 5;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `这次不会清理任何 Glyph。`;
      if (this.glyphsDeleted === this.glyphsTotal) return `这会清理掉你的所有 Glyph。`;
      return `${this.harsh ? "严格清理" : "清理"}会删除
        ${formatInt(this.glyphsDeleted)}/${formatInt(this.glyphsTotal)}
      个 Glyph。`;
    },
    explanation() {
      if (this.harsh) return `严格清理会删除那些被背包中其他 Glyph 全面压过的 Glyph。比如某个 Glyph
        的效果种类完全一样，但每一项效果数值都更差，它就会被删掉。`;
      return `普通清理会删除明显更差的 Glyph，但会尽量保留足够装备一整套对应效果的 Glyph。它类似严格清理，
        不过普通清理需要找到五个更好的 Glyph 才会删除目标，而不是只要找到一个就删。`;
    },
    topLabel() {
      return `即将${this.harsh ? "严格清理" : "清理"}你的 Glyph`;
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.autoClean(this.threshold, false);
    },
  },
  methods: {
    handleYesClick() {
      Glyphs.autoClean(this.threshold, true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="autoClean"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      这可能会删掉一些之后仍有机会派上用场的 Glyph。清理会按照当前清理模式筛选 Glyph，确定要继续吗？
      <br>
      <br>
      {{ explanation }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
