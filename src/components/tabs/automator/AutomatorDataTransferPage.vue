<script>
import AutomatorDataTransferSingleEntry from "./AutomatorDataTransferSingleEntry";

export default {
  name: "AutomatorDataTransferPage",
  components: {
    AutomatorDataTransferSingleEntry,
  },
  data() {
    return {
      scripts: 0,
    };
  },
  computed: {
    maxScriptCount: () => AutomatorData.MAX_ALLOWED_SCRIPT_COUNT,
  },
  created() {
    this.loadScripts();
    this.on$(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => {
      this.loadScripts();
    });
  },
  methods: {
    loadScripts() {
      this.scripts = Object.values(player.reality.automator.scripts).map(script => ({
        id: script.id,
        name: script.name,
      }));
    },
  }
};
</script>

<template>
  <div class="l-panel-padding">
    这个页面可以导入或导出带有附加数据的脚本；编码文本会同时包含脚本中用到的时间研究预设和常量。
    这能更方便地在不同存档之间迁移可运行脚本，但由于预设和常量数量有限，导入过程中可能需要覆盖已有数据。
    从这里导出的数据，也会通过单脚本导入入口读取。
    <br>
    <br>
    注意：注释里提到的常量名或完整购买研究命令，也会被视为脚本“用到”的内容。
    这是有意设计，因为注释通常代表脚本想配合哪些预设或常量运行。
    <br>
    <br>
    <div
      v-for="(script, id) in scripts"
      :key="id"
    >
      <AutomatorDataTransferSingleEntry
        class="l-entry-margin"
        :script="script"
      />
    </div>
  </div>
</template>

<style scoped>
.l-panel-padding {
  padding: 0.5rem 2rem 1rem 0;
}

.l-entry-margin {
  margin-bottom: 1rem;
}

.c-import-button {
  margin: 1rem 1rem -1rem;
  border-radius: var(--var-border-radius, 0.4rem);
  border-width: var(--var-border-width, 0.2rem);
  cursor: pointer;
}
</style>
