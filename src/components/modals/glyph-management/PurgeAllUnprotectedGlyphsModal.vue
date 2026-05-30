<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllUnprotectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isRefining: false,
      isSacrificing: false,
    };
  },
  computed: {
    refiningSacrificingOrDeleting() {
      if (this.isRefining) return `精炼`;
      if (this.isSacrificing) return `献祭`;
      return `删除`;
    },
    topLabel() {
      return `即将${this.refiningSacrificingOrDeleting}所有未保护的 Glyph`;
    },
    message() {
      return `确定要${this.refiningSacrificingOrDeleting}背包中所有未保护的 Glyph 吗？`;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return `这次不会${this.refiningSacrificingOrDeleting}任何 Glyph。`;
      if (this.glyphsDeleted === this.glyphsTotal) {
        return `这会${this.refiningSacrificingOrDeleting}你的所有 Glyph。`;
      }
      return `这会${this.refiningSacrificingOrDeleting}
        ${formatInt(this.glyphsDeleted)}/${formatInt(this.glyphsTotal)} 个 Glyph。`;
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.autoClean(0, false);
    },
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
      this.isSacrificing = GlyphSacrificeHandler.canSacrifice;
    },
    handleYesClick() {
      Glyphs.deleteAllUnprotected();
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
