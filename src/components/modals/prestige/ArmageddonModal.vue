<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ArmageddonModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
      remnantsGain: 0,
      realityShardGain: new Decimal(0),
      nextRealityShardGain: new Decimal(0),
      canArmageddon: false,
    };
  },
  computed: {
    topLabel() {
      if (!this.isDoomed) return `你即将让现实走向末日`;
      return `你即将进行末日重置`;
    },
    message() {
      const isFirstReset = (Currency.remnants.eq(0))
        ? `，并开始每秒获得 ${format(this.nextRealityShardGain, 2, 2)} 现实碎片`
        : `，并将现实碎片获取从每秒 ${format(this.realityShardGain, 2, 2)}
          提高到每秒 ${format(this.nextRealityShardGain, 2, 2)}`;

      return `末日重置会开启一个新的末日现实。你将获得
      ${format(this.remnantsGain, 2, 0)} 个残迹${isFirstReset}`;
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.remnantsGain = Pelle.remnantsGain;
      this.realityShardGain.copyFrom(Pelle.realityShardGainPerSecond);
      this.nextRealityShardGain.copyFrom(Pelle.nextRealityShardGain);
      this.canArmageddon = Pelle.canArmageddon;
    },
    handleYesClick() {
      Pelle.initializeRun();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :option="isDoomed ? 'armageddon' : undefined"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div
      v-if="!isDoomed"
      class="c-modal-message__text"
    >
      让现实走向末日会重置几乎所有内容，但会保留挑战记录、天神进度，以及统计页面中“总览”和“现实”分类下的记录。
      你不会从当前现实的进度中获得任何奖励。末日还会清除大多数未保护的符文，并禁用部分游戏机制。
      <br>
      <br>
      确定要这样做吗？
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
