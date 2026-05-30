<script>
export default {
  name: "AutomatorDocsTemplateList",
  data() {
    return {
      isBlock: false,
      blockTemplates: [],
      selectedTemplateID: -1,
    };
  },
  computed: {
    templates: () => GameDatabase.reality.automator.templates.scripts,
    pasteText() {
      return this.isBlock
        ? "创建一个可拖拽的特殊区块。把它放到自动机中想插入的位置后，它会自动展开为模板所需的所有区块"
        : "把模板脚本复制到剪贴板。你可以直接粘贴到自动机中想插入的位置";
    }
  },
  methods: {
    update() {
      this.isBlock = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
      this.blockTemplates = AutomatorData.blockTemplates;
    },
    showModal(template) {
      Modal.automatorScriptTemplate.show(template);
    },
    unpackTemplateBlocks(event) {
      const templateBlocks = this.blockTemplates[this.selectedTemplateID].blocks;
      const beforeBlocks = BlockAutomator.lines.slice(0, event.newIndex);
      // Note that slice will also pick up the Vue observer, so we need to remove that as well
      const afterBlocks = BlockAutomator.lines.slice(event.newIndex).filter(b => b.cmd);

      // Remap IDs, in case the template gets added more than once
      const maxExistingID = Math.max(...BlockAutomator._idArray.filter(id => id));
      const minTemplateID = Math.min(...templateBlocks.map(b => b.id));
      const blocksToAdd = [];
      for (const block of templateBlocks) {
        blocksToAdd.push({
          ...block,
          id: block.id + maxExistingID - minTemplateID + 1
        });
      }
      BlockAutomator.lines = beforeBlocks;
      BlockAutomator.lines.push(...blocksToAdd);
      BlockAutomator.lines.push(...afterBlocks);
      BlockAutomator.updateIdArray();
    },
    setIndex(index) {
      this.selectedTemplateID = index;
    }
  }
};
</script>

<template>
  <div>
    这些模板可以帮你在自动机里完成一些常见操作。它们可能比手写脚本稍慢一点，但不需要编程经验。
    点击任意模板按钮后，会弹出一组输入项，并生成可以放入自动机的脚本。
    <button
      v-for="template in templates"
      :key="template.name"
      class="o-primary-btn c-automator-docs-template--button l-automator__button"
      @click="showModal(template)"
    >
      模板：{{ template.displayName || template.name }}
    </button>
    你当前使用的是{{ isBlock ? "区块" : "文本" }}编辑器，因此这里会{{ pasteText }}。
    <br>
    <br>
    <draggable
      v-if="isBlock"
      :key="blockTemplates.length"
      class="template-container"
      :list="blockTemplates"
      :group="{ name: 'code-blocks', pull: 'clone', put: false }"
      :sort="false"
      @end="unpackTemplateBlocks"
    >
      <div
        v-for="(template, i) in blockTemplates"
        :key="i"
        class="o-automator-command o-automator-block-list draggable-blocks"
        @dragstart="setIndex(i)"
      >
        {{ template.name }}
      </div>
    </draggable>
  </div>
</template>

<style scoped>
.c-automator-docs-template--button {
  margin: 0.4rem;
  border-radius: var(--var-border-radius, 0.4rem);
  border-width: var(--var-border-width, 0.2rem);
  cursor: pointer;
}

.template-container {
  display: flex;
  flex-direction: column;
}
</style>
