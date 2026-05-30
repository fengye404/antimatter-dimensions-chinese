<script>
export default {
  name: "GlyphSortButtonGroup",
  data() {
    return {
      showScoreFilter: false,
    };
  },
  methods: {
    update() {
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
    },
    sortByLevel() {
      Glyphs.sortByLevel();
    },
    sortByPower() {
      Glyphs.sortByPower();
    },
    sortByScore() {
      Glyphs.sortByScore();
    },
    sortByEffect() {
      Glyphs.sortByEffect();
    },
    collapseEmpty() {
      Glyphs.collapseEmptySlots();
    }
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      整理符文：
    </div>
    <button
      class="c-glyph-inventory-option"
      @click="sortByLevel"
    >
      按等级排序
      <div class="c-glyph-inventory-option__tooltip">
        等级高的符文排在前面
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="sortByPower"
    >
      按强度排序
      <div class="c-glyph-inventory-option__tooltip">
        按“等级 × 稀有度”从高到低排列
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="sortByEffect"
    >
      按效果分组
      <div class="c-glyph-inventory-option__tooltip">
        将效果相近的符文放在一起
      </div>
    </button>
    <button
      v-if="showScoreFilter"
      class="c-glyph-inventory-option"
      @click="sortByScore"
    >
      按筛选分数排序
      <div class="c-glyph-inventory-option__tooltip">
        符文筛选分数高的排在前面
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="collapseEmpty"
    >
      收拢空位
      <div class="c-glyph-inventory-option__tooltip">
        将符文移动到靠前的空格
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
