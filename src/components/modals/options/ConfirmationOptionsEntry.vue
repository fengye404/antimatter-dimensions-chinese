<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";

export default {
  name: "ConfirmationOptionsEntry",
  components: {
    ModalOptionsToggleButton,
  },
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      option: false,
    };
  },
  computed: {
    entry() {
      return ConfirmationTypes.index[this.index];
    },
    name() {
      const names = {
        "Dimension Boost": "维度提升",
        "Antimatter Galaxy": "反物质星系",
        Sacrifice: "牺牲",
        "Big Crunch": "大坍缩",
        Challenges: "挑战",
        "Exit Challenges": "退出挑战",
        "Replicanti Galaxy": "复制品星系",
        Eternity: "永恒",
        Dilation: "时间膨胀",
        "Reset Reality": "重置现实",
        "Glyph Replace": "替换符文",
        "Glyph Sacrifice": "献祭符文",
        "Glyph Purge": "清理符文",
        "Sacrifice All Glyphs": "献祭全部符文",
        "Glyph Selection": "符文选择",
        "Glyph Undo": "撤销符文操作",
        "Switch Automator Editor": "切换自动机编辑器",
        "Delete Glyph Preset": "删除符文预设",
        "Glyph Refine": "精炼符文",
        Armageddon: "末日",
        "Respec Shop Purchases": "重置商店购买"
      };
      return `${names[this.entry.name] ?? this.entry.name}:`;
    },
    styleObject() {
      return {
        "background-color": this.option ? "var(--color-good)" : "var(--color-gh-purple)",
      };
    },
  },
  watch: {
    option(newValue) {
      this.entry.option = newValue;
    },
  },
  created() {
    this.option = this.entry.option;
  },
  methods: {
    update() {
      const entry = this.entry;
      this.isUnlocked = entry.isUnlocked();
    }
  },
};
</script>

<template>
  <ModalOptionsToggleButton
    v-if="isUnlocked"
    v-model="option"
    :text="name"
    :style="styleObject"
  />
</template>
