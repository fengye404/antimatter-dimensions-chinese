<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UiChoiceModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    listEntries() {
      return [
        `更多游戏事件现在带有动画；如果影响性能或游玩体验，可在“视觉选项”中关闭。`,
        `新的确认弹窗已经替代浏览器默认 alert；可在“玩法选项”中关闭。`,
        "游戏还加入了更现代的新界面布局。"
      ];
    }
  },
  methods: {
    handleYesClick() {
      GameOptions.toggleUI();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      视觉变化
    </template>
    <div class="c-modal-message__text">
      检测到你载入了较旧的存档；相比旧版本，游戏现在有一些视觉变化：
      <br>
      <br>
      <div class="c-visual-change-list">
        <div
          v-for="(entry, i) in listEntries"
          :key="i"
          class="c-visual-change-list-entry"
        >
          <b>&bull;</b>
          {{ entry }}
        </div>
      </div>
      <br>
      <br>
      你可以随时在“视觉选项”中切换旧版经典 UI 与新版现代 UI。现在要切换到现代 UI 吗？
    </div>
    <template #cancel-text>
      保持不变
    </template>
    <template #confirm-text>
      切换
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-visual-change-list {
  display: inline-block;
  max-width: 45rem;
  text-align: left;
}

.c-visual-change-list-entry {
  display: flex;
  margin-bottom: 0.5rem;
  gap: 1rem;
}
</style>
