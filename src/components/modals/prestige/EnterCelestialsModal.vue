<script>
import EnterCelestialsRaPet from "@/components/modals/prestige/EnterCelestialsRaPet";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterCelestialsModal",
  components: {
    ModalWrapperChoice,
    EnterCelestialsRaPet,
  },
  props: {
    number: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      laitelaFastest: 3600,
      teresaBestAM: new Decimal(),
      teresaRunMult: 0,
      effarigDone: false,
      effarigLayer: "",
      enslavedDone: false,
      laitelaTime: "",
    };
  },
  computed: {
    effects() {
      return GameDatabase.celestials.descriptions[this.number].effects().split("\n");
    },
    description() {
      const description = GameDatabase.celestials.descriptions[this.number].description;
      return description ? description() : "";
    },
    topLabel() {
      return `${this.name}现实`;
    },
    message() {
      return `进行一次现实重置并进入${this.name}现实。在这里：`;
    },
    extraLine() {
      switch (this.number) {
        case 0:
          return this.teresaBestAM.eq(1)
            ? `你还没有解锁 Teresa 现实的奖励。需要购买现实研究，并首次完成 Teresa 现实。`
            : `你在 Teresa 现实中的最高纪录是 ${format(this.teresaBestAM, 2, 2)} 反物质，
              因此 Glyph 献祭强度获得 ${formatX(this.teresaRunMult, 2)} 倍加成。`;
        case 1: return this.effarigDone
          ? "Effarig 已完成！"
          : `你当前处于 ${this.effarigLayer} 层。`;
        case 2: return this.enslavedDone
          ? "我们……还……帮得不够吗……"
          : "我们……能帮你……让我们……帮你……";
        case 3: return "";
        case 4: return `在 Ra 的现实中，一些资源会根据自身数量为天体记忆生成记忆碎片：`;
        case 5: return this.laitelaFastest >= 300
          ? "你还没有在这一阶层完成 Lai'tela。"
          : `你在这一阶层的最快完成时间是 ${this.laitelaTime}。`;
        case 6: return "";
        default: throw new Error(`Attempted to start an Unknown Celestial in Celestial Modal Confirmation.`);
      }
    }
  },
  methods: {
    update() {
      this.teresaBestAM.copyFrom(player.celestials.teresa.bestRunAM);
      this.teresaRunMult = Teresa.runRewardMultiplier;
      const effarigStage = Effarig.currentStage;
      this.effarigDone = effarigStage === EFFARIG_STAGES.COMPLETED;
      this.effarigLayer = [null, "无限", "永恒", "现实"][effarigStage];
      this.enslavedDone = Enslaved.isCompleted;
      this.laitelaFastest = player.celestials.laitela.fastestCompletion;
      this.laitelaTime = TimeSpan.fromSeconds(this.laitelaFastest).toStringShort();
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      switch (this.number) {
        case 0: return Teresa.initializeRun();
        case 1: return Effarig.initializeRun();
        case 2: return Enslaved.initializeRun();
        case 3: return V.initializeRun();
        case 4: return Ra.initializeRun();
        case 5: return Laitela.initializeRun();
        case 6: throw new Error(`Attempted to start Pelle through EnterCelestialsModal instead of ArmageddonModal`);
        default: throw new Error(`Attempted to start an Unknown Celestial in Celestial Modal Confirmation.`);
      }
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
      <br>
      <br>
      <div class="c-modal-celestial__run-effects">
        <div
          v-for="(effect, i) in effects"
          :key="i"
          class="c-modal-celestial__run-effects__line"
        >
          <b v-if="effect.trim()">&bull;</b>
          <b>&nbsp;</b>
          {{ effect }}
        </div>
      </div>
      <div
        v-if="description"
        class="reality-description"
      >
        <br><br>
        {{ description }}
      </div>
      <br><br>
      <div>
        {{ extraLine }}
      </div>
      <span v-if="number === 4">
        <EnterCelestialsRaPet
          v-for="id in 4"
          :key="id"
          :pet-id="id - 1"
        />
      </span>
    </div>
    <template #confirm-text>
      Begin
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-modal-celestial__run-effects {
  display: inline-block;
  max-width: 45rem;
  text-align: left;
}
.c-modal-celestial__run-effects__line {
  display: flex;
  margin-bottom: 0.5rem;
}

.reality-description {
  padding: 0 2rem;
}
</style>
