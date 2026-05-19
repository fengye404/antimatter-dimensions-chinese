<script>
import AutosaveIntervalSlider from "./AutosaveIntervalSlider";
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";
import OptionsButton from "@/components/OptionsButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SaveFileName from "./SaveFileName";

import { STEAM } from "@/env";

export default {
  name: "OptionsSavingTab",
  components: {
    AutosaveIntervalSlider,
    OpenModalHotkeysButton,
    OptionsButton,
    PrimaryToggleButton,
    SaveFileName
  },
  data() {
    return {
      cloudAvailable: false,
      cloudEnabled: false,
      forceCloudOverwrite: false,
      showCloudModal: false,
      syncSaveIntervals: false,
      showTimeSinceSave: false,
      hideGoogleName: false,
      loggedIn: false,
      userName: "",
      canSpeedrun: false,
      inSpeedrun: false,
      creditsClosed: false,
      canModifySeed: false,
      githubEnabled: false,
      githubHasToken: false,
      githubGistId: "",
      githubGistUrl: "",
      githubLastSyncAt: 0,
      githubLastError: "",
      githubIsSyncing: false,
    };
  },
  computed: {
    modalTooltip() {
      return "开启后，游戏会在可能不应覆盖云端存档时弹出说明窗口，提醒你确认。";
    },
    overwriteTooltip() {
      if (this.showCloudModal) return "由于冲突提示弹窗已开启，此设置暂时不会生效。";
      return this.forceCloudOverwrite
        ? "本地存档将始终覆盖云端存档。"
        : "出现存档冲突时，本地存档不会写入云端。";
    },
    STEAM() {
      return STEAM;
    }
  },
  watch: {
    cloudEnabled(newValue) {
      player.options.cloudEnabled = newValue;
    },
    forceCloudOverwrite(newValue) {
      player.options.forceCloudOverwrite = newValue;
    },
    showCloudModal(newValue) {
      player.options.showCloudModal = newValue;
    },
    syncSaveIntervals(newValue) {
      player.options.syncSaveIntervals = newValue;
    },
    showTimeSinceSave(newValue) {
      player.options.showTimeSinceSave = newValue;
    },
    hideGoogleName(newValue) {
      player.options.hideGoogleName = newValue;
    }
  },
  methods: {
    update() {
      const options = player.options;
      this.cloudAvailable = Cloud.isAvailable;
      this.cloudEnabled = options.cloudEnabled;
      this.forceCloudOverwrite = options.forceCloudOverwrite;
      this.showCloudModal = options.showCloudModal;
      this.syncSaveIntervals = options.syncSaveIntervals;
      this.showTimeSinceSave = options.showTimeSinceSave;
      this.hideGoogleName = options.hideGoogleName;
      this.loggedIn = Cloud.loggedIn;
      this.canSpeedrun = player.speedrun.isUnlocked;
      this.inSpeedrun = player.speedrun.isActive;
      this.canModifySeed = Speedrun.canModifySeed();
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.updateGitHubStatus();
      if (!this.loggedIn) return;
      this.userName = Cloud.user.displayName;
    },
    updateGitHubStatus() {
      const status = GitHubBackup.getStatus();
      this.githubEnabled = status.enabled;
      this.githubHasToken = status.hasToken;
      this.githubGistId = status.gistId;
      this.githubGistUrl = status.gistUrl;
      this.githubLastSyncAt = status.lastSyncAt;
      this.githubLastError = status.lastError;
      this.githubIsSyncing = status.isSyncing;
    },
    formatGitHubSyncTime(timestamp) {
      if (!timestamp) return "尚未备份";
      return new Date(timestamp).toLocaleString();
    },
    saveGitHubSettings() {
      const token = this.$refs.githubToken.value.trim();
      const gistId = this.$refs.githubGistId.value.trim();
      const enabled = this.$refs.githubEnabled.checked;
      if (enabled && !token && !this.githubHasToken) {
        Modal.message.show("启用自动备份前，请先填写 GitHub Token。建议使用只允许 Gist 读写的细粒度 Token。");
        return;
      }
      if (!enabled && !token && !this.githubHasToken && !gistId && !this.githubGistId) {
        Modal.message.show("请填写 GitHub Token，或填写已有的 Gist ID 用于恢复。");
        return;
      }
      GitHubBackup.configure({ token, gistId, enabled });
      this.$refs.githubToken.value = "";
      this.updateGitHubStatus();
      GameUI.notify.info("GitHub 备份设置已保存");
    },
    async syncGitHubNow() {
      try {
        await GitHubBackup.syncNow("manual-sync");
      } catch (error) {
        Modal.message.show(error.message);
      } finally {
        this.updateGitHubStatus();
      }
    },
    async restoreFromGitHub() {
      try {
        await GitHubBackup.restoreLatest();
      } catch (error) {
        Modal.message.show(error.message);
      } finally {
        this.updateGitHubStatus();
      }
    },
    clearGitHubSettings() {
      GitHubBackup.clear();
      this.$refs.githubToken.value = "";
      this.$refs.githubGistId.value = "";
      this.updateGitHubStatus();
      GameUI.notify.info("GitHub 备份设置已清除");
    },
    importAsFile(event) {
      // This happens if the file dialog is canceled instead of a file being selected
      if (event.target.files.length === 0) return;

      const reader = new FileReader();
      reader.onload = function() {
        // File importing behavior should use the behavior on the existing and to-be-overwritten save instead of the
        // settings in the to-be-imported save. This is largely because the former is more easily edited by the player,
        // and in contrast with the import-as-string case which allows the player to choose.
        // Note: Do not move this into GameStorage.import, as this would cause the offline progress choice in the text
        // import modal (the only other place GameStorage.import is called) to always be overridden
        GameStorage.offlineEnabled = player.options.offlineProgress;
        GameStorage.offlineTicks = player.options.offlineTicks;
        GameStorage.import(reader.result);
      };
      reader.readAsText(event.target.files[0]);
    },
    openSeedModal() {
      if (this.canModifySeed) {
        Modal.modifySeed.show();
      } else {
        Modal.message.show("你已经在本轮生成过至少一个符文，不能再修改符文随机种子。");
      }
    }
  }
};
</script>

<template>
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.export()"
        >
          导出存档
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.import.show()"
        >
          导入存档
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.hardReset.show()"
        >
          重置游戏
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.save(false, true)"
        >
          保存游戏
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.loadGame.show()"
        >
          选择存档
        </OptionsButton>
        <AutosaveIntervalSlider
          :min="10"
          :max="60"
          :interval="1"
        />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.exportAsFile()"
        >
          导出存档为文件
        </OptionsButton>
        <OptionsButton
          class="c-file-import-button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        >
          <input
            class="c-file-import"
            type="file"
            accept=".txt"
            @change="importAsFile"
          >
          <label for="file">从文件导入存档</label>
        </OptionsButton>
        <PrimaryToggleButton
          v-model="showTimeSinceSave"
          class="o-primary-btn--option l-options-grid__button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="显示距上次保存时间："
          on="开启"
          off="关闭"
        />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.backupWindows.show()"
        >
          打开自动保存备份菜单
        </OptionsButton>
        <SaveFileName />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          v-if="canSpeedrun"
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.enterSpeedrun.show()"
        >
          开始速通
        </OptionsButton>
        <OptionsButton
          v-if="inSpeedrun"
          :class="{
            'o-pelle-disabled-pointer': creditsClosed,
            'o-primary-btn--disabled': !canModifySeed
          }"
          @click="openSeedModal()"
        >
          修改符文随机种子
        </OptionsButton>
      </div>
      <OpenModalHotkeysButton />
    </div>
    <div class="c-github-backup-panel">
      <h3>GitHub 自动备份</h3>
      <p>
        将当前存档自动备份到你的 GitHub Gist。请使用只允许 Gist 读写的 Token；
        secret Gist 适合个人备份，但拿到链接的人仍可能访问，请不要公开分享链接。
        如果 Token 过期或丢失，可以重新创建 Token；如果只是恢复已有备份，也可以只填 Gist ID 后点击恢复。
      </p>
      <div class="c-github-backup-panel__status">
        状态：
        <b>{{ githubEnabled ? "已启用" : "未启用" }}</b>
        <span>Token：{{ githubHasToken ? "已保存" : "未保存" }}</span>
        <span>上次备份：{{ formatGitHubSyncTime(githubLastSyncAt) }}</span>
      </div>
      <div
        v-if="githubGistUrl"
        class="c-github-backup-panel__gist"
      >
        Gist：<a
          :href="githubGistUrl"
          target="_blank"
          rel="noopener"
        >{{ githubGistUrl }}</a>
      </div>
      <div
        v-if="githubLastError"
        class="c-github-backup-panel__error"
      >
        最近错误：{{ githubLastError }}
      </div>
      <div class="c-github-backup-panel__form">
        <input
          ref="githubToken"
          class="c-github-backup-panel__input"
          type="password"
          autocomplete="off"
          placeholder="GitHub Token（保存后不会再次显示）"
        >
        <input
          ref="githubGistId"
          class="c-github-backup-panel__input"
          type="text"
          :placeholder="githubGistId || 'Gist ID（留空会自动创建）'"
        >
        <label class="c-github-backup-panel__toggle">
          <input
            ref="githubEnabled"
            type="checkbox"
            :checked="githubEnabled"
          >
          启用自动备份（跟随游戏本地自动保存）
        </label>
      </div>
      <div class="c-github-backup-panel__actions">
        <OptionsButton @click="saveGitHubSettings()">
          保存 GitHub 设置
        </OptionsButton>
        <OptionsButton
          :class="{ 'o-primary-btn--disabled': githubIsSyncing }"
          @click="syncGitHubNow()"
        >
          立即备份到 GitHub
        </OptionsButton>
        <OptionsButton @click="restoreFromGitHub()">
          从 GitHub 恢复
        </OptionsButton>
        <OptionsButton @click="clearGitHubSettings()">
          清除 GitHub 设置
        </OptionsButton>
      </div>
    </div>
    <h2
      v-if="cloudAvailable"
      class="c-cloud-options-header"
    >
      <span v-if="hideGoogleName">已登录 Google <i>（名称已隐藏）</i></span>
      <span v-else-if="loggedIn">已登录为 {{ userName }}</span>
      <span v-else>未登录</span>
    </h2>
    <div v-if="loggedIn">
      <span v-if="cloudEnabled">云存档会每 10 分钟自动保存一次。</span>
      <span v-else>此存档已禁用云存档。</span>
    </div>
    <div
      v-if="cloudAvailable"
      class="l-options-grid"
    >
      <div
        v-if="!STEAM"
        class="l-options-grid__row"
      >
        <OptionsButton
          v-if="loggedIn"
          onclick="GameOptions.logout()"
        >
          断开 Google 账号并禁用云存档
        </OptionsButton>
        <OptionsButton
          v-else
          v-tooltip="'将你的 Google 账号连接到反物质维度存档。'"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameOptions.login()"
        >
          使用 Google 登录并启用云存档
        </OptionsButton>
        <PrimaryToggleButton
          v-if="loggedIn"
          v-model="hideGoogleName"
          v-tooltip="'为保护隐私，在界面中隐藏你的 Google 账号名称；保存和读取不受影响。'"
          class="o-primary-btn--option l-options-grid__button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="隐藏 Google 账号名称："
        />
      </div>
      <div
        v-if="loggedIn"
        class="l-options-grid__row"
      >
        <OptionsButton
          onclick="GameOptions.cloudSave()"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        >
          保存到云端
        </OptionsButton>
        <OptionsButton
          onclick="GameOptions.cloudLoad()"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        >
          从云端读取
        </OptionsButton>
        <PrimaryToggleButton
          v-model="syncSaveIntervals"
          class="o-primary-btn--option l-options-grid__button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="云存档前强制本地保存："
        />
      </div>
      <div
        v-if="loggedIn"
        class="l-options-grid__row"
      >
        <PrimaryToggleButton
          v-model="cloudEnabled"
          class="o-primary-btn--option l-options-grid__button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="自动云端保存/读取："
        />
        <PrimaryToggleButton
          v-model="showCloudModal"
          v-tooltip="modalTooltip"
          class="o-primary-btn--option l-options-grid__button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="可能冲突时显示弹窗："
        />
        <PrimaryToggleButton
          v-model="forceCloudOverwrite"
          v-tooltip="overwriteTooltip"
          class="o-primary-btn--option l-options-grid__button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="冲突时仍强制云存档："
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-github-backup-panel {
  width: min(110rem, calc(100% - 4rem));
  border: 0.1rem solid var(--color-good);
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 2rem auto;
  padding: 1.5rem;
  line-height: 1.55;
}

.c-github-backup-panel__status,
.c-github-backup-panel__actions,
.c-github-backup-panel__form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.c-github-backup-panel__input {
  width: 32rem;
  max-width: 100%;
  text-align: center;
  font-size: 1.25rem;
  line-height: 1.5;
  border: 0.1rem solid var(--color-good);
  border-radius: var(--var-border-radius, 0.4rem);
  padding: 0.6rem;
}

.c-github-backup-panel__toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.c-github-backup-panel__gist,
.c-github-backup-panel__error {
  margin-top: 1rem;
}

.c-github-backup-panel__error {
  color: var(--color-bad);
}
</style>
