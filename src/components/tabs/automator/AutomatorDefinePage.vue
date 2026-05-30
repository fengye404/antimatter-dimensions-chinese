<script>
import AutomatorDefineSingleEntry from "./AutomatorDefineSingleEntry";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "AutomatorDefinePage",
  components: {
    AutomatorDefineSingleEntry,
    PrimaryButton,
  },
  data() {
    return {
      constants: [],
      count: 0,
      refreshConstants: false,
    };
  },
  computed: {
    maxConstantCount() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_COUNT;
    },
    maxNameLength() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_NAME_LENGTH;
    },
    maxValueLength() {
      return AutomatorData.MAX_ALLOWED_CONSTANT_VALUE_LENGTH;
    },
    hasConstants() {
      return this.constants.length > 1 || this.constants[0] !== "";
    }
  },
  created() {
    // This key-swaps the container for all the constants in order to force a re-render when externally changed
    this.on$(GAME_EVENT.AUTOMATOR_CONSTANT_CHANGED, () => {
      this.refreshConstants = true;
      this.$nextTick(() => this.refreshConstants = false);
    });
  },
  methods: {
    update() {
      const existingValues = player.reality.automator.constantSortOrder;
      this.count = existingValues.length;
      this.constants = this.count < this.maxConstantCount ? [...existingValues, ""] : [...existingValues];
    },
    deleteAllConstants() {
      if (this.hasConstants) Modal.clearAutomatorConstants.show();
    },
    importPresets() {
      Modal.importTSConstants.show();
    },
  }
};
</script>

<template>
  <div class="l-panel-padding">
    这里可以定义区分大小写的常量，用来替代数字或时间研究导入字符串。这些定义会在所有脚本之间共享，
    最多可定义 {{ maxConstantCount }} 个常量。常量名和常量值长度分别不能超过
    {{ maxNameLength }} 和 {{ maxValueLength }} 个字符。正在运行的脚本需要重启后才会应用常量变更。
    <br>
    <br>
    举例来说，定义
    <b>first 🠈 11,21,22,31,32,33</b>
    后，就可以使用
    <b>studies purchase first</b>
    来购买前三行的全部研究。
    <br>
    <br>
    <PrimaryButton
      v-tooltip="hasConstants ? null : '没有可删除的有效常量！'"
      class="c-delete-margin o-primary-btn--subtab-option"
      :class="{ 'o-primary-btn--disabled' : !hasConstants }"
      @click="deleteAllConstants"
    >
      删除所有常量
    </PrimaryButton>
    <br>
    <br>
    <PrimaryButton
      class="c-delete-margin o-primary-btn--subtab-option"
      @click="importPresets"
    >
      导入时间研究预设
    </PrimaryButton>
    <div
      :key="count + refreshConstants"
      class="l-definition-container"
    >
      <AutomatorDefineSingleEntry
        v-for="(constant, i) in constants"
        :key="i"
        :constant="constant"
      />
    </div>
  </div>
</template>

<style scoped>
.c-delete-margin {
  margin: 0;
}

.l-panel-padding {
  padding: 0.5rem 2rem 0 0;
}

.l-definition-container {
  display: flex;
  flex-direction: column;
  border: solid 0.1rem var(--color-automator-docs-font);
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 0.5rem;
  margin-top: 1rem;
}
</style>
