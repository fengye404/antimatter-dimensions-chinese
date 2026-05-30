<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ReplicantiGalaxyModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      replicanti: new Decimal(),
      divideReplicanti: false,
      canBeBought: 0,
    };
  },
  computed: {
    topLabel() {
      return `即将购买 ${formatInt(this.canBeBought)} 个复制品星系`;
    },
    message() {
      const reductionString = this.divideReplicanti
        ? `每购买一个复制品星系都会让复制品数量除以 ${format(Number.MAX_VALUE, 2, 2)}
          (${format(this.replicanti, 2, 2)} to
          ${format(this.replicanti.divide(Decimal.NUMBER_MAX_VALUE.pow(this.canBeBought)), 2, 2)})`
        : `将复制品数量重置为 ${formatInt(1)}`;
      return `复制品星系会像反物质星系一样增强时间间隔升级，但不会提高反物质星系的价格，
        也不会受到专门增强反物质星系的倍率影响。本次购买会${reductionString}。`;
    }
  },
  methods: {
    update() {
      this.replicanti.copyFrom(player.replicanti.amount);
      this.divideReplicanti = Achievement(126).isUnlocked;
      this.canBeBought = Replicanti.galaxies.gain;
      if (this.replicanti.lt(Number.MAX_VALUE)) this.emitClose();
    },
    handleYesClick() {
      replicantiGalaxy(false);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="replicantiGalaxy"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
