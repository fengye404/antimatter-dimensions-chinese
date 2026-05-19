<script>
export default {
  name: "ModalConfirmationCheck",
  props: {
    option: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      setting: true
    };
  },
  computed: {
    confirmation() {
      return ConfirmationTypes[this.option];
    },
    confirmationName() {
      const names = {
        sacrifice: "维度牺牲",
        challenges: "挑战",
        eternity: "永恒",
        dilation: "时间膨胀",
        resetReality: "重开现实",
        glyphReplace: "替换符文",
        glyphSacrifice: "牺牲符文",
        glyphTrash: "删除符文",
        armageddon: "末日",
        respecIAP: "重置商店加成",
        dimensionBoost: "维度提升",
        antimatterGalaxy: "反物质星系",
        replicantiGalaxy: "复制体星系",
        bigCrunch: "大坍缩",
        glyphSelection: "选择符文",
        harshAutoClean: "强制自动清理",
        glyphUndo: "撤销符文",
        glyphRefine: "提炼符文",
        reality: "现实"
      };

      return names[this.option] ?? this.confirmation.name;
    },
    confirmationClass() {
      return {
        "c-modal__confirmation-toggle__checkbox": true,
        "c-modal__confirmation-toggle__checkbox--active": !this.setting
      };
    },
    tooltipText() {
      return `${this.setting ? "禁用" : "重新启用"}${this.confirmationName}确认`;
    },
  },
  created() {
    this.setting = this.confirmation.option;
  },
  methods: {
    toggle() {
      this.setting = !this.setting;
      this.confirmation.option = this.setting;
    }
  }
};
</script>

<template>
  <div
    class="c-modal__confirmation-toggle"
    @click="toggle"
  >
    <div :class="confirmationClass">
      <span
        v-if="!setting"
        class="fas fa-check"
      />
      <div class="c-modal__confirmation-toggle__tooltip">
        {{ tooltipText }}
      </div>
    </div>
    <span class="c-modal__confirmation-toggle__text">
      不再显示此消息
    </span>
  </div>
</template>
