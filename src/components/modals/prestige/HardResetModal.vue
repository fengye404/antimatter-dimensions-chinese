<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "HardResetModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      input: ""
    };
  },
  computed: {
    willHardReset() {
      return this.input === "Shrek is love, Shrek is life";
    },
    hasExtraNG() {
      return player.records.fullGameCompletions > 0;
    },
    hasSpeedrun() {
      return player.speedrun.isUnlocked;
    }
  },
  destroyed() {
    if (this.willHardReset) SecretAchievement(38).unlock();
  },
  methods: {
    hardReset() {
      if (this.willHardReset) GameStorage.hardReset();
      this.input = "";
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!willHardReset"
    :show-confirm="willHardReset"
    confirm-class="o-primary-btn--width-medium c-modal__confirm-btn c-modal-hard-reset-btn"
    @confirm="hardReset"
  >
    <template #header>
      硬重置
    </template>
    <div class="c-modal-message__text">
      请确认你要硬重置当前存档槽。
      <span class="c-modal-hard-reset-danger">删除存档不会解锁任何隐藏内容。</span>
      输入 "Shrek is love, Shrek is life" 以确认。
      <div class="c-modal-hard-reset-danger">
        这会清空你的存档。
        <span v-if="hasExtraNG">
          <br>
          这也会移除你通关后解锁的所有符文外观！
        </span>
        <span v-if="hasSpeedrun">
          <br>
          你会失去进行速通的能力。若要重新开始本次速通，请改用“开始速通”按钮。
        </span>
      </div>
    </div>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-hard-reset__input"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-hard-reset-info">
      <div
        v-if="willHardReset"
        class="c-modal-hard-reset-danger"
      >
        确认短语正确，继续后将不可逆地删除存档！
      </div>
      <div v-else>
        输入正确短语后才能硬重置。
      </div>
    </div>
    <template #confirm-text>
      硬重置
    </template>
  </ModalWrapperChoice>
</template>
