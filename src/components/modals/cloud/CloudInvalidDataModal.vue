<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "CloudInvalidDataModal",
  components: {
    ModalWrapperChoice,
  },
  props: {
    isSaving: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflict;
    },
    overwriteText() {
      return this.isSaving
        ? "覆盖 Cloud 存档"
        : "从 Cloud 加载存档";
    }
  },
  methods: {
    ignore() {
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    },
    overwrite() {
      this.conflict.onAccept?.();
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    class="c-modal-options__large"
    :cancel-class="'c-modal-message__okay-btn'"
    :confirm-class="'c-modal-message__okay-btn c-modal__confirm-btn'"
    :cancel-fn="overwrite"
    @confirm="ignore()"
  >
    <template #header>
      无法与 Cloud 存档比较
    </template>
    比较存档时，游戏无法正确处理 Cloud 存档中的数据。这通常是因为 Cloud 存档太旧，
    使用了早期版本的数据格式。
    <br>
    <br>
    <span v-if="isSaving">
      覆盖这份 Cloud 存档通常是安全的。如果你想尝试转换旧存档，也可以点击“从 Cloud 加载”
      强制读取它，让游戏尝试转换为可用格式。
    </span>
    <span v-else>
      你可以尝试从 Cloud 加载这份数据。游戏会尝试转换格式后读取它，但不保证成功；
      最糟糕的情况下，可能需要重置这个存档栏位才能继续正常游戏。
    </span>
    <br>
    注意：无论设置如何，这个弹窗都会出现。因为在问题解决前，它会持续阻止 10 分钟自动保存。
    <template #cancel-text>
      {{ overwriteText }}
    </template>
    <template #confirm-text>
      不覆盖
    </template>
  </ModalWrapperChoice>
</template>
