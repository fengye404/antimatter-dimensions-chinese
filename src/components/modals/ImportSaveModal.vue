<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

const OFFLINE_PROGRESS_TYPE = {
  IMPORTED: 0,
  LOCAL: 1,
  IGNORED: 2,
};

export default {
  name: "ImportSaveModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton
  },
  data() {
    return {
      input: "",
      offlineImport: OFFLINE_PROGRESS_TYPE.IMPORTED,
    };
  },
  computed: {
    saveCheckString() {
      const save = GameSaveSerializer.deserialize(this.input);
      const rawString = GameStorage.checkPlayerObject(save);
      // Keep the length bounded; we don't want the modal to be too big for the screen for particularly bad errors
      return rawString.length > 300 ? `${rawString.slice(0, 297)}...` : rawString;
    },
    player() {
      return this.saveCheckString === "" ? GameSaveSerializer.deserialize(this.input) : undefined;
    },
    progress() {
      return PlayerProgress.of(this.player);
    },
    fileName() {
      return this.player.options.saveFileName;
    },
    antimatter() {
      return this.player.antimatter || this.player.money;
    },
    infinities() {
      // Infinity count data is stored in either player.infinitied or player.infinities based on if the save is before
      // or after the reality update, and this explicit check is needed as it runs before any migration code.
      const infinityData = this.player.infinitied ? this.player.infinitied : this.player.infinities;
      return new Decimal(infinityData);
    },
    hasInput() {
      return this.input !== "";
    },
    inputIsValid() {
      return this.inputIsValidSave || this.inputIsSecret;
    },
    inputIsValidSave() {
      return this.player !== undefined;
    },
    inputIsSecret() {
      return isSecretImport(this.input) || Theme.isSecretTheme(this.input);
    },
    isFromFuture() {
      return this.player.lastUpdate > Date.now();
    },
    lastOpened() {
      const ms = Date.now() - this.player.lastUpdate;
      return this.isFromFuture
        ? `这个存档的最后打开时间比当前系统时间晚 ${TimeSpan.fromMilliseconds(-ms).toString()}。`
        : `这个存档上次打开是在 ${TimeSpan.fromMilliseconds(ms).toString()} 前。`;
    },
    offlineType() {
      // We update here in the computed method instead of elsewhere because otherwise it initializes the text
      // to a wrong or undefined setting
      this.updateOfflineSettings();

      switch (this.offlineImport) {
        case OFFLINE_PROGRESS_TYPE.IMPORTED:
          return "使用导入存档设置";
        case OFFLINE_PROGRESS_TYPE.LOCAL:
          return "使用当前本地设置";
        case OFFLINE_PROGRESS_TYPE.IGNORED:
          return "不模拟离线时间";
        default:
          throw new Error("Unrecognized offline progress setting for importing");
      }
    },
    offlineDetails() {
      if (this.offlineImport === OFFLINE_PROGRESS_TYPE.IGNORED) {
        return `导入时不会结算离线进度。`;
      }
      if (!GameStorage.offlineEnabled) return "当前设置不会在导入后结算离线进度。";
      if (this.isFromFuture) return "系统时间与存档时间不一致，无法模拟离线进度。";

      const durationInMs = Date.now() - this.player.lastUpdate;
      const ticks = GameStorage.maxOfflineTicks(durationInMs);
      return `导入后将模拟 ${formatInt(ticks)} 个离线 tick，每个 tick 约
        ${TimeSpan.fromMilliseconds(durationInMs / ticks).toStringShort()}。`;
    },
    willLoseCosmetics() {
      const currSets = player.reality.glyphs.cosmetics.unlockedFromNG;
      const importedSets = this.player.reality?.glyphs.cosmetics?.unlockedFromNG ?? [];
      return currSets.filter(set => !importedSets.includes(set)).length > 0;
    },
    willLoseSpeedrun() {
      return player.speedrun.isUnlocked && !this.player.speedrun?.isUnlocked;
    }
  },
  mounted() {
    this.$refs.input.select();
  },
  destroyed() {
    // Explicitly setting this to undefined after closing forces the game to fall-back to the stored settings within
    // the player object if this modal is closed - ie. it makes sure actions in the modal don't persist
    GameStorage.offlineEnabled = undefined;
    GameStorage.offlineTicks = undefined;
  },
  methods: {
    changeOfflineSetting() {
      this.offlineImport = (this.offlineImport + 1) % 3;
    },
    updateOfflineSettings() {
      switch (this.offlineImport) {
        case OFFLINE_PROGRESS_TYPE.IMPORTED:
          // These are default values from a new save, used if importing from pre-reality where these props don't exist
          GameStorage.offlineEnabled = this.player.options.offlineProgress ?? true;
          GameStorage.offlineTicks = this.player.options.offlineTicks ?? 1e5;
          break;
        case OFFLINE_PROGRESS_TYPE.LOCAL:
          GameStorage.offlineEnabled = player.options.offlineProgress;
          GameStorage.offlineTicks = player.options.offlineTicks;
          break;
        case OFFLINE_PROGRESS_TYPE.IGNORED:
          GameStorage.offlineEnabled = false;
          break;
      }
    },
    importSave() {
      if (!this.inputIsValid) return;
      this.emitClose();
      GameStorage.import(this.input);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="false"
  >
    <template #header>
      输入存档
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup.enter="importSave"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-import__save-info">
      <div v-if="inputIsSecret">
        ???
      </div>
      <template v-else-if="inputIsValidSave">
        <div v-if="fileName">
          文件名：{{ fileName }}
        </div>
        <div>反物质：{{ formatPostBreak(antimatter, 2, 1) }}</div>
        <div v-if="progress.isInfinityUnlocked">
          无限次数：{{ formatPostBreak(infinities, 2) }}
        </div>
        <div v-if="progress.isEternityUnlocked">
          永恒次数：{{ formatPostBreak(player.eternities, 2) }}
        </div>
        <div v-if="progress.isRealityUnlocked">
          现实次数：{{ formatPostBreak(player.realities, 2) }}
        </div>
        <div v-if="progress.hasFullCompletion">
          完整通关次数：{{ formatInt(player.records.fullGameCompletions) }}
        </div>
        <div class="c-modal-import__warning">
          （当前存档会被覆盖！）
        </div>
        <br>
        <div>
          {{ lastOpened }}
          <div
            class="o-primary-btn"
            @click="changeOfflineSetting"
          >
            离线进度：{{ offlineType }}
          </div>
          <span v-html="offlineDetails" />
        </div>
      </template>
      <div v-else-if="hasInput">
        不是有效存档：
        <br>
        {{ saveCheckString }}
      </div>
      <div
        v-if="player"
        class="c-modal-hard-reset-danger"
      >
        <div v-if="willLoseCosmetics">
          <br>
          通关解锁的 Glyph 外观套装会绑定在存档中。
          <br>
          导入此存档会导致部分套装丢失。
        </div>
        <div v-if="willLoseSpeedrun">
          <br>
          你会失去进行速通的能力，因为导入的存档尚未解锁速通。
        </div>
      </div>
    </div>

    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="importSave"
    >
      导入
    </PrimaryButton>
  </ModalWrapperChoice>
</template>
