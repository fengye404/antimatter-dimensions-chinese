<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "BreakInfinityModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      const infinity = formatPostBreak(Number.MAX_VALUE, 2);
      return `突破无限后，你可以让反物质超过 ${infinity}${PlayerProgress.eternityUnlocked()
        ? "。" : `，也能阅读超过 ${infinity} 的数字。`}
        反物质达到 ${infinity} 后，维度和时间间隔升级的花费会增长得更快。
        大坍缩时，你会根据超过 ${infinity} 的反物质量获得额外无限点数。\
        ${EternityMilestone.keepAutobuyers.isReached ? "" : "\n同时会解锁突破无限升级，并把所有普通挑战自动购买器升至最大。"}`.split("\n");
    },
  },
  methods: {
    handleYesClick() {
      breakInfinity();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="false"
    @confirm="handleYesClick"
  >
    <template #header>
      正在突破无限
    </template>
    <div class="c-modal-message__text">
      <span
        v-for="(line, index) in message"
        :key="index"
      >
        {{ line }} <br>
      </span>
    </div>
    <template #confirm-text>
      突破
    </template>
  </ModalWrapperChoice>
</template>
