<script>
import HiddenTabGroup from "@/components/modals/options/hidden-tabs/HiddenTabGroup";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "HiddenTabsModal",
  components: {
    HiddenTabGroup,
    ModalWrapperOptions,
    PrimaryButton,
  },
  data() {
    return {
      isEnslaved: false,
      isAlmostEnd: false,
    };
  },
  computed: {
    tabs: () => Tabs.currentUIFormat,
  },
  methods: {
    update() {
      this.isEnslaved = Enslaved.isRunning;
      this.isAlmostEnd = Pelle.hasGalaxyGenerator;
    },
    showAllTabs() {
      for (const tab of this.tabs) {
        tab.unhideTab();
        for (const subtab of tab.subtabs)
          subtab.unhideTab();
      }
    }
  },
};
</script>

<template>
  <ModalWrapperOptions class="l-wrapper">
    <template #header>
      修改可见标签页
    </template>
    <div class="c-modal--short">
      点击按钮可切换标签页显示或隐藏。
      <br>
      部分标签页不能隐藏，当前所在标签页也不能隐藏。
      <br>
      如果某个标签页的所有子标签都已隐藏，重新显示该标签页时也会显示全部子标签；
      隐藏全部子标签也会隐藏对应主标签页。
      <br>
      <div v-if="isAlmostEnd">
        解锁星系发生器后不能再隐藏标签页。
      </div>
      <div v-if="isEnslaved">
        <br>
        <i>你必须……看见一切……</i>
        <br>
        （本次现实中不能隐藏标签页）
      </div>
      <PrimaryButton
        @click="showAllTabs"
      >
        显示全部标签页
      </PrimaryButton>
      <HiddenTabGroup
        v-for="(tab, index) in tabs"
        :key="index"
        :tab="tab"
        :change-enabled="!isEnslaved && !isAlmostEnd"
        class="l-hide-modal-tab-container"
      />
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.l-wrapper {
  width: 62rem;
}

.t-s12 .l-wrapper {
  width: 65rem;
}
</style>
