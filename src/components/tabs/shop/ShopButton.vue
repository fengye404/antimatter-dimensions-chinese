<script>
const SHOP_TEXT = {
  dimPurchases: "永久使所有反物质维度倍率翻倍。",
  allDimPurchases: "永久使所有已解锁维度倍率翻倍。达到 32 倍前为乘算，之后线性增加。",
  IPPurchases: "所有来源的无限点获取翻倍。（叠加）",
  replicantiPurchases: "复制品增长提高 50%。（叠加）",
  EPPurchases: "所有来源的永恒点获取变为 3 倍。（叠加）",
  dilatedTimePurchases: "膨胀时间获取提高 50%。（叠加）",
  RMPurchases: "现实机器获取提高 100%。（叠加）",
  smallTimeSkip: "获得 6 小时离线产量。（自动购买器不会以完整速度运行）",
  bigTimeSkip: "获得 24 小时离线产量。（自动购买器不会以完整速度运行）",
  singleCosmeticSet: "解锁一个自选符文外观套装。",
  allCosmeticSets: "一次性解锁所有剩余符文外观套装。",
};

const LOCK_TEXT = {
  Infinity: "无限",
  Replicanti: "复制品",
  Eternity: "永恒",
  Dilation: "时间膨胀",
  Reality: "现实",
};

export default {
  name: "ShopButton",
  props: {
    purchase: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      currentMult: 0,
      nextMult: 0,
      cost: 0,
      lockedCount: 0,
    };
  },
  computed: {
    isAllCosmeticSets() {
      return this.purchase.config.key === "allCosmeticSets";
    },
    allSetsUnlocked() {
      return this.isAllCosmeticSets && !this.lockedCount;
    },
    description() {
      return SHOP_TEXT[this.purchase.config.key] ?? this.purchase.description;
    },
    lockText() {
      return LOCK_TEXT[this.purchase.lockText] ?? this.purchase.lockText;
    },
    purchaseUnavailableText() {
      return "中文版已禁用购买";
    },
  },
  methods: {
    update() {
      this.currentMult = this.purchase.currentMultForDisplay;
      this.nextMult = this.purchase.nextMultForDisplay;
      this.cost = Math.clampMin(this.purchase.cost, 0);
      this.lockedCount = GlyphAppearanceHandler.lockedSets.length;
    },
    formatSetCount() {
      return `${this.lockedCount} 个套装`;
    },
  },
};
</script>

<template>
  <div class="c-shop-button-container">
    <div class="o-shop-button-description">
      {{ description }}
      <br>
      <span
        v-if="purchase.shouldDisplayMult"
        class="o-shop-button-multiplier"
      >
        当前 {{ purchase.formatEffect(currentMult) }}，下一级 {{ purchase.formatEffect(nextMult) }}
      </span>
    </div>
    <div
      v-if="isAllCosmeticSets"
      class="o-shop-button-multiplier"
    >
      <span v-if="allSetsUnlocked">所有套装均已解锁</span>
      <span v-else>将解锁 {{ formatSetCount() }}</span>
    </div>
    <button
      class="o-shop-button-button o-shop-button-button--disabled"
      disabled
    >
      {{ purchaseUnavailableText }}（原价：{{ cost }} STD）
      <img
        src="images/std_coin.png"
        class="o-shop-button-button__img"
      >
    </button>
    <div
      v-if="!purchase.isUnlocked()"
      class="o-shop-button-locked-text"
    >
      此项目影响尚未解锁的功能（{{ lockText }}）
    </div>
  </div>
</template>

<style scoped>
.c-shop-button-container {
  display: flex;
  flex-direction: column;
  width: 30rem;
  min-height: 18rem;
  justify-content: space-between;
  color: white;
  background: #3c3c3c;
  border: var(--var-border-width, 0.2rem) solid #1f7d1f;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 0.5rem;
  padding: 1rem;
}

.o-shop-button-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Typewriter;
  background: turquoise;
  border: none;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 0 auto;
  padding: 0.5rem 1.2rem;
}

.o-shop-button-button--disabled {
  color: black;
  background: rgb(150, 150, 150);
  cursor: default;
}

.o-shop-button-button__img {
  height: 40px;
  margin-left: 1rem;
}

.o-shop-button-multiplier {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.o-shop-button-locked-text {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-bad);
}
</style>
