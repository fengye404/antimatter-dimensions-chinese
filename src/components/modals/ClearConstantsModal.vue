<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ClearConstantsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      constantCount: 0,
    };
  },
  methods: {
    update() {
      this.constantCount = Object.keys(player.reality.automator.constants).length;
      if (this.constantCount === 0) this.emitClose();
    },
    deleteConstants() {
      player.reality.automator.constants = {};
      player.reality.automator.constantSortOrder = [];
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="deleteConstants"
  >
    <template #header>
      删除自动机常量
    </template>
    <div class="c-modal-message__text">
      确定要删除当前已定义的所有自动机常量吗？
      <br>
      <span class="l-lost-text">
        这会永久删除 {{ formatInt(constantCount) }} 个常量！
      </span>
    </div>
    <template #confirm-text>
      全部删除
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-lost-text {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
