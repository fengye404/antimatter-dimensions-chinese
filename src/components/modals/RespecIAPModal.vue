<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "RespecIAPModal",
  components: {
    ModalWrapperChoice
  },
  methods: {
    returnedSTDCount() {
      let std = 0;
      for (const purchase of ShopPurchase.all) {
        if (purchase.config.instantPurchase) continue;
        std += purchase.purchases * purchase.cost;
      }
      return std;
    },
    handleYesClick() {
      ShopPurchaseData.respecAll();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="respecIAP"
    @confirm="handleYesClick"
  >
    <template #header>
      即将重置商店购买
    </template>
    <div class="c-modal-message__text">
      确定要重置商店购买吗？这不会产生任何费用，并会返还你在永久倍率项目上花费的 {{ returnedSTDCount() }}
      <img
        src="images/std_coin.png"
        class="o-shop-button-button__img"
      >。
      <br>
      <br>
      花在离线进度和 Glyph 外观上的 STD 不会返还。Glyph 外观套装购买后永久保留，不会丢失，也不会被重置。
      <br>
      <br>
      <b class="o-warning">除非再次购买 STD 币，否则之后无法再次重置商店购买。</b>
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-modal-message__text {
  vertical-align: middle;
}

.o-shop-button-button__img {
  height: 2.5rem;
  vertical-align: middle;
}

.o-warning {
  color: var(--color-infinity);
}
</style>
