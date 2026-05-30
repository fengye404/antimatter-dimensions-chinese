<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SwitchAutomatorEditorModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    callback: {
      type: Function,
      required: false,
      default: () => ({})
    },
    lostBlocks: {
      type: Number,
      required: false,
      default: 0,
    }
  },
  data() {
    return {
      errorCount: 0,
      isCurrentlyBlocks: false
    };
  },
  computed: {
    currentScriptID: {
      get() {
        return this.$viewModel.tabs.reality.automator.editorScriptID;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.editorScriptID = value;
      }
    },
    otherMode() {
      return this.isCurrentlyBlocks ? "文本" : "积木";
    }
  },
  methods: {
    update() {
      this.errorCount = AutomatorData.currentErrors().length;
      this.isCurrentlyBlocks = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
    },
    toggleAutomatorMode() {
      AutomatorBackend.changeModes(this.currentScriptID);
      this.callback?.();
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    option="switchAutomatorMode"
    @confirm="toggleAutomatorMode"
  >
    <template #header>
      将自动机切换为{{ otherMode }}编辑器
    </template>
    <div class="c-modal-message__text">
      如果当前脚本正在运行，切换编辑器会停止它！
      <div v-if="errorCount">
        <br>
        你的脚本存在一些错误，可能无法正确转换为{{ otherMode }}模式。继续操作会让自动机尝试解析这些行，
        但部分信息可能丢失或转换不完整。
      </div>
      <!-- Note: this can only ever appear on text-to-block -->
      <b v-if="lostBlocks">
        <br>
        警告：当前脚本中还有一些行无法解释为具体命令。由于没有可转换的积木，这些行会被删除。
        如果错误出现在循环或 IF 的开头，可能会导致大段脚本被删除！
        <span class="l-lost-text">
          现在切换编辑器会导致 {{ formatInt(lostBlocks) }} 行代码不可恢复地丢失！
        </span>
      </b>
      <br>
      <span class="l-lost-text">
        不建议隐藏此确认弹窗；如果脚本带着错误切换模式，部分脚本内容可能会立即且不可恢复地丢失。
      </span>
      <br>
      <br>
      确定要切换到{{ otherMode }}编辑器吗？
    </div>
    <template #confirm-text>
      切换模式
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-lost-text {
  color: var(--color-bad);
}
</style>
