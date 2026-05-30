<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UndoGlyphModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      showStoredGameTime: false,
    };
  },
  methods: {
    update() {
      this.showStoredGameTime = Enslaved.isUnlocked;
    },
    realityInvalidate() {
      this.emitClose();
      Modal.message.show("Glyph 撤销只能撤销最近一次随现实一起发生的操作！",
        { closeEvent: GAME_EVENT.REALITY_RESET_AFTER });
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.undo();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="glyphUndo"
    @confirm="handleYesClick"
  >
    <template #header>
      即将撤销装备 Glyph
    </template>
    <div
      class="c-modal-message__text c-text-wrapper"
    >
      最近装备的 Glyph 会被移除。
      现实会被重置，但下列内容会恢复到装备该 Glyph 时的状态：
      <br>
      <div class="c-text-wrapper">
        <br>- 反物质、无限点数、永恒点数
        <br>- 时间膨胀升级、快子粒子、膨胀时间
        <br>- 时间定理与永恒挑战完成次数
        <br>- 时间维度与现实解锁状态
        <br>- 当前无限 / 永恒 / 现实内经过的时间
        <span v-if="showStoredGameTime"><br>- 已储存游戏时间</span>
      </div>
      <br>
      注意：如果某些特殊条件已经失效（例如“不生产反物质完成现实”的成就），撤销 Glyph 后也不会恢复。
      这类条件需要在同一轮现实中、且不使用撤销的情况下重新达成。
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-text-wrapper {
  text-align: left;
}
</style>
