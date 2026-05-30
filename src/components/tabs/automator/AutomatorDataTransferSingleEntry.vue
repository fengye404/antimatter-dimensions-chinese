<script>
export default {
  name: "AutomatorDataTransferSingleEntry",
  props: {
    script: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      presets: [],
      constants: [],
      hidePresets: true,
      hideConstants: true,
    };
  },
  computed: {
    presetData: () => player.timestudy.presets,
    constantData: () => player.reality.automator.constants,
    hasPresets() {
      return (this.presets?.length ?? 0) !== 0;
    },
    hasConstants() {
      return (this.constants?.length ?? 0) !== 0;
    },
  },
  methods: {
    update() {
      this.presets = AutomatorBackend.getUsedPresets(this.script.id);
      this.constants = AutomatorBackend.getUsedConstants(this.script.id);
    },
    iconClass(state) {
      return state ? "far fa-plus-square" : "far fa-minus-square";
    },
    exportData(id) {
      const toExport = AutomatorBackend.exportFullScriptData(id);
      if (toExport) {
        copyToClipboard(toExport);
        GameUI.notify.automator(`已将与“${this.script.name}”关联的全部数据复制到剪贴板`, 6000);
      } else {
        GameUI.notify.error("空白自动机脚本没有可导出的数据！");
      }
    }
  }
};
</script>

<template>
  <div class="l-entry-padding">
    <button
      v-tooltip="'导出完整脚本数据'"
      class="l-button-margin fas fa-file-export"
      @click="exportData(script.id)"
    />
    <b>脚本名称：{{ script.name }}</b>
    <br>
    <span v-if="hasPresets">
      <span
        :class="iconClass(hidePresets)"
        @click="hidePresets = !hidePresets"
      />
      引用了 {{ formatInt(presets.length) }} 个已识别的时间研究预设
      <span v-if="!hidePresets">
        <div
          v-for="id in presets"
          :key="id"
        >
          <span v-if="presetData[id].name">“{{ presetData[id].name }}”（槽位 {{ id + 1 }}）：</span>
          <span v-else>预设槽位 {{ id + 1 }}：</span>
          <br>
          <div class="l-value-padding">
            <span v-if="presetData[id].studies">{{ presetData[id].studies }}</span>
            <i v-else>空时间研究预设</i>
          </div>
        </div>
      </span>
    </span>
    <span v-else>
      未引用任何时间研究预设。
    </span>
    <br>
    <span v-if="hasConstants">
      <span
        :class="iconClass(hideConstants)"
        @click="hideConstants = !hideConstants"
      />
      引用了 {{ formatInt(constants.length) }} 个已定义常量
      <span v-if="!hideConstants">
        <div
          v-for="name in constants"
          :key="name"
        >
          "{{ name }}":
          <br>
          <div class="l-value-padding">
            {{ constantData[name] }}
          </div>
        </div>
      </span>
    </span>
    <span v-else>
      未引用任何已定义常量。
    </span>
  </div>
</template>

<style scoped>
.l-entry-padding {
  border: solid 0.1rem var(--color-automator-docs-font);
  border-radius: var(--var-border-radius, 0.5rem);
  overflow-wrap: break-word;
  padding: 1rem 1.5rem;
}

.l-value-padding {
  padding-left: 1.5rem;
}

.l-button-margin {
  margin-right: 1rem;
}
</style>
