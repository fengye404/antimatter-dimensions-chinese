<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import SaveInfoEntry from "@/components/modals/cloud/SaveInfoEntry";

export default {
  name: "CloudLoadConflictModal",
  components: {
    ModalWrapperChoice,
    SaveInfoEntry,
  },
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflict;
    },
    older() {
      return this.conflict.saveComparison.older === 1;
    },
    farther() {
      return this.conflict.saveComparison.farther === 1;
    },
    hasDifferentName() {
      return this.conflict.cloud.saveName !== this.conflict.local.saveName;
    },
    suggestionText() {
      const goodStyle = `style="color: var(--color-good)"`;
      const badStyle = `style="color: var(--color-bad)"`;

      const suggestions = ["加载这份 Cloud 存档"];
      const cloudProg = this.conflict.cloud.compositeProgress, localProg = this.conflict.local.compositeProgress;
      const warnOverwrite = this.farther && Math.abs(cloudProg - localProg) > 0.15;
      suggestions.push(warnOverwrite
        ? `<b ${badStyle}>会让本地存档丢失大量进度</b>`
        : `<b ${goodStyle}>看起来是安全的</b>`);
      if (this.hasDifferentName) {
        suggestions.push(`<br>${warnOverwrite ? "另外" : "不过"}，这份 Cloud 存档
          <b ${badStyle}>可能来自另一台设备</b>。`);
      }
      if (warnOverwrite || this.hasDifferentName) {
        suggestions.push(`<br><b ${badStyle}>确定要覆盖当前本地存档吗？</b>`);
      }
      return suggestions.join("");
    }
  },
  methods: {
    confirm() {
      this.conflict.onAccept?.();
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    class="c-modal-options__large"
    :cancel-class="'c-modal-message__okay-btn'"
    :confirm-class="'c-modal-message__okay-btn c-modal__confirm-btn'"
    :confirm-fn="confirm"
  >
    <template #header>
      从 Cloud 加载游戏
    </template>
    <span v-if="hasDifferentName">
      本地存档和 Cloud 存档的<b>名称不同</b>。
    </span>
    <span v-else-if="older">
      从 Cloud 加载会<b>切换到游玩时间更短的存档</b>。
    </span>
    <span v-else-if="farther">
      从 Cloud 加载会<b>导致当前进度回退</b>。
    </span>
    <span v-else>
      本地存档和 Cloud 存档的<b>进度看起来接近</b>。
    </span>
    请选择要继续游玩的存档。
    <br>
    <br>
    <SaveInfoEntry
      :save-data="conflict.local"
      :other-data="conflict.cloud"
      :save-id="conflict.saveId"
      :show-name="hasDifferentName"
      save-type="本地存档"
    />
    <SaveInfoEntry
      :save-data="conflict.cloud"
      :other-data="conflict.local"
      :save-id="conflict.saveId"
      :show-name="hasDifferentName"
      save-type="Cloud 存档"
    />
    <span v-html="suggestionText" />
    <template #cancel-text>
      保留本地存档
    </template>
    <template #confirm-text>
      用 Cloud 覆盖本地
    </template>
  </ModalWrapperChoice>
</template>
