<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SacrificeModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      currentMultiplier: new Decimal(),
      nextMultiplier: new Decimal(),
    };
  },
  computed: {
    message() {
      if (Achievement(118).isUnlocked && !Pelle.isDoomed) {
        return `维度献祭会根据献祭时拥有的第 1 反物质维度数量，增强第 8 反物质维度。`;
      }
      return `维度献祭会移除第 1 到第 7 反物质维度（价格和倍率不变），并根据累计献祭的第 1
        反物质维度数量增强第 8 反物质维度。献祭后需要一段时间恢复产能。`;
    },
    multiplierText() {
      return `当前倍率为 ${formatX(this.currentMultiplier, 2, 2)}，维度献祭后会提升至
        ${formatX(this.nextMultiplier, 2, 2)}。`;
    },
  },
  methods: {
    update() {
      this.currentMultiplier.copyFrom(Sacrifice.totalBoost);
      this.nextMultiplier.copyFrom(Sacrifice.nextBoost.times(Sacrifice.totalBoost));
    },
    handleYesClick() {
      sacrificeReset();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrifice"
    @confirm="handleYesClick"
  >
    <template #header>
      维度献祭
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-message__text">
      {{ multiplierText }}
      <br>
    </div>
  </ModalWrapperChoice>
</template>
