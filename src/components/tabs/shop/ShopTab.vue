<script>
import ShopButton from "./ShopButton";

export default {
  name: "ShopTab",
  components: {
    ShopButton,
  },
  data() {
    return {
      availableSTD: 0,
      spentSTD: 0,
      IAPsEnabled: false,
    };
  },
  computed: {
    purchases() {
      return ShopPurchase.all;
    },
    iapStatusText() {
      return this.IAPsEnabled ? "免费商店加成当前已启用" : "免费商店加成当前未启用";
    },
  },
  methods: {
    update() {
      this.availableSTD = ShopPurchaseData.availableSTD;
      this.spentSTD = ShopPurchaseData.spentSTD;
      this.IAPsEnabled = ShopPurchaseData.isIAPEnabled;
    },
  },
};
</script>

<template>
  <div class="tab shop">
    <section class="c-shop-disclaimer">
      <strong>中文版说明：</strong>
      中文版商店不连接 Google、Steam 或支付后端。下方项目可直接免费购买，用于本地游玩和测试；
      购买记录保存在当前存档中，不会产生任何真实交易。
    </section>

    <section class="c-shop-panel">
      <h2>商店状态</h2>
      <p>{{ iapStatusText }}</p>
      <p>
        当前本地记录：{{ availableSTD }} STD 可用，{{ spentSTD }} STD 已使用。
        免费购买不会消耗 STD；若从原版导入带有商店记录的存档，页面也会继续显示这些记录。
      </p>
    </section>

    <section class="c-shop-panel c-shop-panel--muted">
      <h2>原版商店项目预览</h2>
      <p>
        下方项目保留原版商店效果，但按钮已改为本地免费购买。多次点击可重复购买可叠加项目。
      </p>
    </section>

    <div class="l-shop-buttons-container">
      <ShopButton
        v-for="purchase in purchases"
        :key="purchase.key"
        :purchase="purchase"
      />
    </div>
  </div>
</template>

<style scoped>
.shop {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
}

.c-shop-disclaimer,
.c-shop-panel {
  width: 80%;
  max-width: 100rem;
  border: var(--var-border-width, 0.2rem) solid black;
  border-radius: var(--var-border-radius, 1rem);
  margin-top: 0.8rem;
  padding: 1rem 1.5rem;
}

.c-shop-disclaimer {
  font-size: 1.7rem;
  line-height: 1.5;
  color: black;
  background: var(--color-good);
}

.c-shop-panel {
  font-size: 1.5rem;
  line-height: 1.45;
  background: var(--color-base);
}

.c-shop-panel h2 {
  margin: 0 0 0.6rem;
}

.c-shop-panel p {
  margin: 0.4rem 0;
}

.c-shop-panel--muted {
  color: var(--color-text);
  background: transparent;
  border-color: var(--color-disabled);
}

.t-s1 .c-shop-disclaimer,
.t-s6 .c-shop-disclaimer,
.t-s10 .c-shop-disclaimer {
  color: var(--color-good);
  background: black;
  border-color: var(--color-good);
}

.l-shop-buttons-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 93rem;
  max-width: 96vw;
  margin: 1rem auto;
}
</style>
