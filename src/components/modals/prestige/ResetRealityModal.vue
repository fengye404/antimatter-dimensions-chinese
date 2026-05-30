<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ResetRealityModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
      canReality: false,
    };
  },
  computed: {
    resetTerm() { return this.isDoomed ? "末日" : "现实"; },
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.canReality = isRealityAvailable();
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="resetReality"
    @confirm="handleYesClick"
  >
    <template #header>
      即将重置当前{{ resetTerm }}
    </template>
    <div class="c-modal-message__text">
      这会把你重置回当前{{ resetTerm }}的起点，
      并且不会获得本轮{{ resetTerm }}进度对应的任何奖励。
      <br>
      <br>
      确定要这样做吗？
      <div
        v-if="canReality"
        class="c-has-rewards"
      >
        <br>
        你现在已经可以完成一次现实并获得完整奖励；如果在这里重置，这些奖励将不会发放。
        若要领取奖励，请使用“创造新的现实”按钮。
      </div>
      <br>
    </div>
    <template #confirm-text>
      重置
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-has-rewards {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--color-bad);
}
</style>
