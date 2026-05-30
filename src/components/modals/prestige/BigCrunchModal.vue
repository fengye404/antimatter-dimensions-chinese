<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "BigCrunchModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedInfinities: new Decimal(),
      gainedInfinityPoints: new Decimal(),
      startingBoosts: 0,
      startingAM: 10,
      willStartWithGalaxy: false
    };
  },
  computed: {
    isFirstInfinity() {
      return !PlayerProgress.infinityUnlocked();
    },
    message() {
      const info = this.isFirstInfinity ? this.firstInfinityInfo : ``;
      return `进入无限会重置所有维度、维度提升和反物质星系。${info}`;
    },
    firstInfinityInfo() {
      return `作为回报，你会获得 1 个无限点数（IP），可在“无限”页签购买多种升级。
        你还会获得 1 次无限次数，这项统计可在“统计”页签查看。`;
    },
    ipGainInfo() {
      return `你将获得 ${format(this.gainedInfinities, 2, 0)} 次无限和
        ${format(this.gainedInfinityPoints, 2, 0)} IP。`;
    },
    startingResources() {
      const gainedResources = [];
      if (this.startingAM.gte(10)) gainedResources.push(`${format(this.startingAM, 2, 1)} 反物质`);
      if (this.startingBoosts > 0) gainedResources.push(`${formatInt(this.startingBoosts)} 次维度提升`);
      if (this.willStartWithGalaxy) gainedResources.push(`1 个反物质星系`);

      return `下一轮无限开始时，你会保留${gainedResources.join("、")}。`;
    }
  },
  methods: {
    update() {
      this.gainedInfinities = gainedInfinities().round();
      this.gainedInfinityPoints = gainedInfinityPoints().round();
      this.startingBoosts = DimBoost.startingDimensionBoosts;
      this.startingAM = Currency.antimatter.startingValue;
      this.willStartWithGalaxy = InfinityUpgrade.skipResetGalaxy.isBought;
    },
    handleYesClick() {
      bigCrunchResetRequest();
      EventHub.ui.offAll(this);
      if (this.isFirstInfinity) {
        setTimeout(() => Modal.message.show(`之后每次手动触发无限都会播放这个动画。若想关闭，
          可在“选项”页签中调整；游戏中的大多数视觉动画首次出现后都能单独禁用。`, {}, 3), 2000);
      }
    }
  },
};
</script>

<template>
  <ResetModal
    header="即将进入无限"
    :message="message"
    :gained-resources="ipGainInfo"
    :starting-resources="startingResources"
    :confirm-fn="handleYesClick"
    :alternate-condition="isFirstInfinity"
    :alternate-text="message"
    :confirm-option="isFirstInfinity ? undefined : 'bigCrunch'"
  />
</template>
