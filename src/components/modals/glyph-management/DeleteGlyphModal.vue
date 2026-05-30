<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DeleteGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    idx: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      confirmedDelete: false
    };
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.idx);
    },
  },
  methods: {
    update() {
      const newGlyph = Glyphs.findByInventoryIndex(this.idx);
      if (this.glyph !== newGlyph && !this.confirmedDelete) {

        // Why is confirmedDelete here: refer to SacrificeGlyphModal.vue

        this.emitClose();
        Modal.message.show("选中的 Glyph 已移动或发生变化！");
      }
    },
    handleYesClick() {
      this.confirmedDelete = true;
      Glyphs.removeFromInventory(this.glyph);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      即将删除一个 Glyph
    </template>
    <div class="c-modal-message__text">
      删除 Glyph 会将它从背包中移除！
      <div class="c-modal-hard-reset-danger">
        在解锁 Glyph 献祭之前，删除 Glyph 没有任何收益！
      </div>
    </div>
  </ModalWrapperChoice>
</template>
