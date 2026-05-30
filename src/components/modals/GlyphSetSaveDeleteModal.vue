<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "GlyphSetSaveDeleteModal",
  components: {
    ModalWrapperChoice,
    GlyphSetPreview
  },
  props: {
    glyphSetId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      glyphSet: []
    };
  },
  methods: {
    update() {
      this.glyphSet = Glyphs.copyForRecords(player.reality.glyphs.sets[this.glyphSetId].glyphs);
    },
    handleYesClick() {
      player.reality.glyphs.sets[this.glyphSetId].glyphs = [];
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="deleteGlyphSetSave"
    @confirm="handleYesClick"
  >
    <template #header>
      删除这个 Glyph 套装
    </template>
    <div class="c-modal-message__text">
      请确认是否删除这个 Glyph 套装：
      <GlyphSetPreview
        :is-in-modal="true"
        :glyphs="glyphSet"
      />
      这不会影响实际拥有的 Glyph，只会删除保存的预设。
    </div>
    <template #confirm-text>
      删除
    </template>
  </ModalWrapperChoice>
</template>
