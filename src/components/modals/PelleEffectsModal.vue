<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PelleEffectsModal",
  components: {
    PrimaryButton,
    ModalWrapper,
  },
  computed: {
    nerfs() {
      return [
        // Numerical nerfs and disabled boosts
        "通过 Pelle 升级解锁的内容无法再用原本方式解锁",
        "末日前所有无限点数和永恒点数倍率失效",
        "基于最快无限速度的无限点数产出失效",
        "末日前所有复制品速度倍率失效",
        `复制品超过 ${format(Number.MAX_VALUE, 2)} 后会衰减得更加剧烈`,
        "大多数永恒挑战会变得更难",
        `所有星系效果只剩 ${formatPercents(0.5)}`,
        `反物质维度倍率除以 ${formatInt(10)}`,
        "成就倍率和许多成就奖励失效",
        "所有无限与永恒相关倍率、自动产出效果失效",
        "黑洞失效",
        "现实升级“时间超越”失效",

        // Initial QoL and automation
        "除成就 21 外，所有提高初始资源的奖励失效",
        "所有防止资源被重置的奖励失效",
        "除 ECR 分组外，降低解锁花费的特权奖励失效",
        "无限挑战和永恒挑战自动完成失效",
        "所有维度和无限前自动购买器失效，直到通过 Pelle 重新获得",
        "时间定理自动购买器失效",
        "所有时间膨胀及之后阶段的自动化失效",

        // Time studies + Dilation
        "按游玩天数增强时间维度的永恒升级改为按本次末日时间计算",
        `除可购买的 ${formatX(2)} 外，末日前所有膨胀时间倍率失效`,
        "所有快子粒子倍率失效",
        "除膨胀升级外，末日前所有时间定理产出效果失效",

        // Glyphs
        "符文装备功能失效，直到重新获得",
        `符文等级会降低，稀有度固定为 ${formatPercents(0)}`,
        "符文献祭、转化和炼金效果全部失效",

        // Celestial features
        "无法进入其他天体现实",
        "无法购买音乐符文",
        "Effarig 的所有奖励失效",
        "所有储存时间相关功能失效",
        "V 的所有奖励失效",
        `Ra 中 Teresa 等级 ${formatInt(1)} 的效果失效`,
        "无限升级无法充能",
        "三元研究和空间定理失效",
        "除 DMD 和天体解锁相关效果外，虚幻升级失效",
        "连续统和奇点奖励失效"
      ];
    }
  }
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      末日中被削弱或禁用的效果
    </template>
    <div class="pelle-effects-container">
      <p
        v-for="(nerf, idx) in nerfs"
        :key="idx"
      >
        {{ nerf }}
      </p>
    </div>
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="emitClose"
    >
      确认
    </PrimaryButton>
  </ModalWrapper>
</template>

<style scoped>
.pelle-effects-container {
  overflow-y: scroll;
  height: 40rem;
}

p {
  margin-bottom: 1rem;
}
</style>
