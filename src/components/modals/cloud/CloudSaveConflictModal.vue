<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import SaveInfoEntry from "@/components/modals/cloud/SaveInfoEntry";

export default {
  name: "CloudSaveConflictModal",
  components: {
    ModalWrapperChoice,
    SaveInfoEntry,
  },
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflict;
    },
    older() {
      return this.conflict.saveComparison.older === -1;
    },
    farther() {
      return this.conflict.saveComparison.farther === -1;
    },
    hasDifferentName() {
      return this.conflict.cloud.saveName !== this.conflict.local.saveName;
    },
    wrongHash() {
      return this.conflict.saveComparison.hashMismatch;
    },
    suggestionText() {
      const goodStyle = `style="color: var(--color-good)"`;
      const badStyle = `style="color: var(--color-infinity)"`;

      const suggestions = ["保存到 Cloud"];
      const cloudProg = this.conflict.cloud.compositeProgress, localProg = this.conflict.local.compositeProgress;
      const warnOverwrite = this.farther && Math.abs(cloudProg - localProg) > 0.15;
      suggestions.push(warnOverwrite
        ? `<b ${badStyle}>会覆盖一份进度明显更多的存档</b>`
        : `<b ${goodStyle}>看起来是安全的</b>`);
      if (this.hasDifferentName || this.wrongHash) {
        suggestions.push(` ${warnOverwrite ? "另外" : "不过"}，你可能会覆盖一份
          <b ${badStyle}>来自另一台设备的存档</b>。`);
      }
      if (warnOverwrite || this.hasDifferentName || this.wrongHash) {
        suggestions.push(`<br><b ${badStyle}>确定要覆盖 Cloud 存档吗？</b>`);
      }
      return suggestions.join("");
    },
    noOverwriteInfo() {
      return `如果不覆盖，之后仍可能继续出现存档冲突提示。`;
    },
    overwriteInfo() {
      return `如果另一台设备也在用同一个 Google 账号同步 Cloud 存档，这个弹窗可能会反复出现。`;
    }
  },
  methods: {
    doNotSave() {
      player.options.cloudEnabled = false;
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
    @confirm="doNotSave()"
  >
    <template #header>
      保存游戏到 Cloud
    </template>
    <span v-if="wrongHash">
      本次游玩期间，你的 Cloud 存档已经被<b>另一台设备修改</b>。
    </span>
    <span v-else-if="hasDifferentName">
      本地存档和 Cloud 存档的<b>名称不同</b>。
    </span>
    <span v-else-if="older">
      保存到 Cloud 会<b>覆盖较旧的存档</b>。
    </span>
    <span v-else-if="farther">
      保存到 Cloud 会<b>覆盖进度更多的存档</b>。
    </span>
    <span v-else>
      本地存档和 Cloud 存档的<b>进度看起来接近</b>。
    </span>
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
    <br>
    <span>
      如果选择不覆盖，将会关闭 Cloud 保存；之后想继续使用时，需要手动重新开启。
      <span :ach-tooltip="noOverwriteInfo">
        <i class="fas fa-question-circle" />
      </span>
    </span>
    <span>
      如果选择覆盖，本次会强制写入 Cloud；多数情况下，这能避免之后继续弹出同样的冲突提示。
      <span :ach-tooltip="overwriteInfo">
        <i class="fas fa-question-circle" />
      </span>
    </span>
    <template #cancel-text>
      覆盖 Cloud 存档
    </template>
    <template #confirm-text>
      不覆盖
    </template>
  </ModalWrapperChoice>
</template>
