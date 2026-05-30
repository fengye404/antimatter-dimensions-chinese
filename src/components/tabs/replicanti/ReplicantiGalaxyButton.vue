<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ReplicantiGalaxyButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isAvailable: false,
      isAutoUnlocked: false,
      isAutoActive: false,
      isAutoEnabled: false,
      isDivideUnlocked: false,
      boughtGalaxies: 0,
      extraGalaxies: 0
    };
  },
  computed: {
    resetActionDisplay() {
      return this.isDivideUnlocked && !Pelle.isDoomed
        ? `复制品数量除以 ${format(Number.MAX_VALUE, 1, 1)}`
        : "重置复制品数量";
    },
    galaxyCountDisplay() {
      const bought = this.boughtGalaxies;
      const extra = this.extraGalaxies;
      const galaxyCount = extra > 0 ? `${formatInt(bought)}+${formatInt(extra)}` : formatInt(bought);
      return `当前：${galaxyCount}`;
    },
    autobuyer() {
      return Autobuyer.replicantiGalaxy;
    },
    autobuyerTextDisplay() {
      const auto = this.isAutoActive;
      const disabled = !this.isAutoEnabled;
      return `自动星系：${auto ? "开启" : "关闭"}${disabled ? "（已禁用）" : ""}`;
    },
  },
  methods: {
    update() {
      const rg = Replicanti.galaxies;
      this.isAvailable = rg.canBuyMore;
      this.boughtGalaxies = rg.bought;
      this.extraGalaxies = rg.extra;
      this.isDivideUnlocked = Achievement(126).isUnlocked;
      const auto = Autobuyer.replicantiGalaxy;
      this.isAutoUnlocked = auto.isUnlocked;
      this.isAutoActive = auto.isActive;
      this.isAutoEnabled = auto.isEnabled;
    },
    handleAutoToggle(value) {
      Autobuyer.replicantiGalaxy.isActive = value;
      this.update();
    },
    handleClick() {
      replicantiGalaxyRequest();
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <PrimaryButton
      :enabled="isAvailable"
      class="o-primary-btn--replicanti-galaxy"
      @click="handleClick"
    >
      {{ resetActionDisplay }}以获得 1 个复制品星系
      <br>
      {{ galaxyCountDisplay }}
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="isAutoUnlocked"
      :value="isAutoActive"
      :on="autobuyerTextDisplay"
      :off="autobuyerTextDisplay"
      class="l--spoon-btn-group__little-spoon o-primary-btn--replicanti-galaxy-toggle"
      @input="handleAutoToggle"
    />
  </div>
</template>

<style scoped>

</style>
