<script>
import ToggleButton from "@/components/ToggleButton";

export default {
  name: "GlyphProtectedRowButtonGroup",
  components: {
    ToggleButton
  },
  data() {
    return {
      protectedRows: 0,
      moveGlyphs: false,
    };
  },
  computed: {
    questionMarkTooltip() {
      return `受保护栏位不会被任何移动或清理符文的操作影响。
        新符文也不会自动放入这些栏位。`;
    }
  },
  watch: {
    moveGlyphs(newValue) {
      player.reality.moveGlyphsOnProtection = newValue;
    },
  },
  methods: {
    update() {
      this.moveGlyphs = player.reality.moveGlyphsOnProtection;
      this.protectedRows = player.reality.glyphs.protectedRows;
    },
    addRow() {
      Glyphs.changeProtectedRows(1);
    },
    removeRow() {
      Glyphs.changeProtectedRows(-1);
    },
    isProtectedRowsMax() {
      return this.protectedRows === Glyphs.totalSlots / 10 - 1;
    },
    addRowButtonClass() {
      return {
        "c-glyph-inventory-option": true,
        "o-non-clickable": this.isProtectedRowsMax()
      };
    },
    removeRowButtonClass() {
      return {
        "c-glyph-inventory-option": true,
        "o-non-clickable": this.protectedRows === 0
      };
    }
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      <div
        v-tooltip="questionMarkTooltip"
        class="o-questionmark"
      >
        ?
      </div>
      受保护栏位：（{{ formatInt(protectedRows) }} 行）
    </div>
    <button
      :class="addRowButtonClass()"
      @click="addRow"
    >
      增加一行保护栏位
      <div
        v-if="isProtectedRowsMax()"
        class="c-glyph-inventory-option__tooltip"
      >
        至少会保留一行非保护栏位，用于接收新符文
      </div>
    </button>
    <button
      :class="removeRowButtonClass()"
      @click="removeRow"
    >
      移除一行保护栏位
    </button>
    <ToggleButton
      v-model="moveGlyphs"
      class="c-glyph-inventory-option"
      label="改变行数时移动符文："
      on="开启"
      off="关闭"
    />
  </div>
</template>

<style scoped>
.o-non-clickable {
  cursor: auto;
}
</style>
