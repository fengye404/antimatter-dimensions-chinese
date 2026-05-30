<script>
import SplitPane from "vue-splitpane";

import AutomatorDocs from "./AutomatorDocs";
import AutomatorEditor from "./AutomatorEditor";
import AutomatorPointsList from "./AutomatorPointsList";

export default {
  name: "AutomatorTab",
  components: {
    SplitPane,
    AutomatorEditor,
    AutomatorPointsList,
    AutomatorDocs
  },
  data() {
    return {
      automatorUnlocked: false,
      interval: 0,
      currentChars: 0,
      totalChars: 0,
      withinLimit: false,
    };
  },
  computed: {
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
    tabClass() {
      if (!this.fullScreen) return undefined;
      return "c-automator-tab--full-screen";
    },
    fullScreenIconClass() {
      return this.fullScreen ? "fa-compress-arrows-alt" : "fa-expand-arrows-alt";
    },
    intervalText() {
      const speedupText = `每次现实都会让自动机加快 ${formatPercents(0.006, 1)}，最高
        ${formatInt(1000)} 条命令/秒。`;
      return this.interval === 1
        ? `自动机正以最高速度运行（${formatInt(1000)} 条命令/真实秒）。`
        : `自动机正以 ${format(1000 / this.interval, 2, 2)} 条命令/真实秒运行。
          ${speedupText}`;
    },
    maxScriptChars() {
      return AutomatorData.MAX_ALLOWED_SCRIPT_CHARACTERS;
    },
    maxTotalChars() {
      return AutomatorData.MAX_ALLOWED_TOTAL_CHARACTERS;
    },
  },
  methods: {
    update() {
      this.automatorUnlocked = Player.automatorUnlocked;
      this.interval = AutomatorBackend.currentInterval;
      this.currentChars = AutomatorData.singleScriptCharacters();
      this.totalChars = AutomatorData.totalScriptCharacters();
      this.withinLimit = AutomatorData.isWithinLimit();
    }
  }
};
</script>

<template>
  <div
    :class="tabClass"
    class="c-automator-tab l-automator-tab"
  >
    <div v-if="automatorUnlocked">
      <div>
        {{ intervalText }}
      </div>
      <span :class="{ 'c-overlimit': currentChars > maxScriptChars }">
        当前脚本：{{ formatInt(currentChars) }} / {{ formatInt(maxScriptChars) }}
      </span>
      |
      <span :class="{ 'c-overlimit': totalChars > maxTotalChars }">
        所有脚本：{{ formatInt(totalChars) }} / {{ formatInt(maxTotalChars) }}
      </span>
      <br>
      <span
        v-if="!withinLimit"
        class="c-overlimit"
      >
        （字符数超过限制，当前改动不会保存！）
      </span>
      <div class="c-automator-split-pane">
        <SplitPane
          :min-percent="44"
          :default-percent="50"
          split="vertical"
        >
          <template #paneL>
            <AutomatorEditor />
          </template>
          <template #paneR>
            <AutomatorDocs />
          </template>
        </SplitPane>
      </div>
    </div>
    <AutomatorPointsList v-else />
  </div>
</template>

<style scoped>
.c-overlimit {
  font-weight: bold;
  color: var(--color-bad);
}

.c-automator-tab {
  width: 80%;
  min-width: 100rem;
}

.l-automator-tab {
  position: relative;
  align-self: center;
  margin-top: 0.5rem;
}

.c-automator-split-pane {
  width: 100%;
  height: 57rem;
  background-color: #bbbbbb;
}

.s-base--dark .c-automator-split-pane {
  width: 100%;
  background-color: #474747;
}

.c-automator-tab--full-screen .c-automator-split-pane {
  width: 100%;
  height: 100%;
  position: fixed;
  inset: 0;
  z-index: 5;
  margin-top: 0;
  padding-bottom: 0;
}
</style>
