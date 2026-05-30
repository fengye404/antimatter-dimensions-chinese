<script>
export default {
  name: "StudyStringLine",
  props: {
    tree: {
      type: Object,
      required: true,
    },
    intoEmpty: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    importDestString() {
      return this.intoEmpty ? "导入到空树时" : "与当前树合并后";
    }
  },
  methods: {
    formatTheoremCost(tt, st) {
      const strTT = `${formatWithCommas(tt)} TT`;
      const strST = `${formatWithCommas(st)} ST`;
      return st === 0 ? strTT : `${strTT} + ${strST}`;
    }
  },
};
</script>

<template>
  <div class="l-modal-import-tree__tree-info-line">
    <div v-if="tree.timeTheorems === 0 && tree.spaceTheorems === 0">
      <i>{{ importDestString }}不会购买任何新的时间研究。</i>
    </div>
    <div v-else>
      {{ importDestString }}会购买：
      <br>
      {{ tree.newStudies }}
      （花费：{{ formatTheoremCost(tree.timeTheorems, tree.spaceTheorems) }}）
    </div>
    <br>
  </div>
</template>
