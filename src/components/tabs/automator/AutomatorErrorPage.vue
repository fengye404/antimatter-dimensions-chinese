<script>
export default {
  name: "AutomatorErrorPage",
  data() {
    return {
      errors: [],
    };
  },
  methods: {
    update() {
      this.errors = AutomatorData.currentErrors();
    },
    scrollToLine(line) {
      AutomatorScroller.scrollToLine(line);
      AutomatorHighlighter.updateHighlightedLine(line, LineEnum.Error);
    }
  }
};
</script>

<template>
  <div class="c-automator-docs-page">
    <div v-if="errors.length === 0">
      没有发现脚本错误！
    </div>
    <div v-else>
      <b>你的脚本有以下 {{ formatInt(errors.length) }} 个错误：</b>
      <br>
      <span
        v-for="(error, i) in errors"
        :key="i"
      >
        <b>第 {{ error.startLine }} 行：</b>
        <button
          v-tooltip="'跳转到这一行'"
          class="c-automator-docs--button fas fa-arrow-circle-right"
          @click="scrollToLine(error.startLine)"
        />
        <div class="c-automator-docs-page__indented">
          {{ error.info }}
        </div>
        <div class="c-automator-docs-page__indented">
          <i>建议修复：{{ error.tip }}</i>
        </div>
      </span>
      <i>
        注：有些错误会让自动机无法继续正确扫描脚本后续内容。这样可能导致后面的错误被前面的错误“掩盖”，
        或者带有内部代码块的命令（例如 IF、WHILE）把错误显示到后续格式正确的命令上。
        另外，如果错误原因不够明确，部分修复建议可能并不完全准确。
      </i>
    </div>
  </div>
</template>

<style scoped>

</style>
