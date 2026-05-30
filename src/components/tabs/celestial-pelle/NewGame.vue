<script>
export default {
  name: "NewGame",
  data() {
    return {
      opacity: 0,
      visible: false,
      hasMoreCosmetics: false,
      selectedSetName: "",
    };
  },
  computed: {
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden",
      };
    }
  },
  methods: {
    update() {
      this.visible = GameEnd.endState > END_STATE_MARKERS.SHOW_NEW_GAME && !GameEnd.removeAdditionalEnd;
      this.opacity = (GameEnd.endState - END_STATE_MARKERS.SHOW_NEW_GAME) * 2;
      this.hasMoreCosmetics = GlyphAppearanceHandler.lockedSets.length > 0;
      this.selectedSetName = GlyphAppearanceHandler.chosenFromModal?.name ?? "未选择（将随机选择）";
    },
    startNewGame() {
      NG.startNewGame();
    },
    openSelectionModal() {
      Modal.cosmeticSetChoice.show();
    }
  }
};
</script>

<template>
  <div
    class="c-new-game-container"
    :style="style"
  >
    <h2>
      重置整个游戏，但保留自动机脚本、时间研究预设、隐藏主题、秘密成就、选项和同伴 Glyph。
    </h2>
    <h3>你可以使用右上角按钮，查看当前游戏状态。</h3>
    <div class="c-new-game-button-container">
      <button
        class="c-new-game-button"
        @click="startNewGame"
      >
        重新开始？
      </button>
    </div>
    <br>
    <h3 v-if="hasMoreCosmetics">
      完成游戏后，你还可以选择解锁一套新的 Glyph 外观。再次到达现实后即可自由调整；
      这些外观只改变显示效果，不提供任何玩法加成。
      <br>
      <button
        class="c-new-game-button"
        @click="openSelectionModal"
      >
        选择外观套装
      </button>
      <br>
      <br>
      已选择套装：{{ selectedSetName }}
    </h3>
    <h3 v-else>
      你已经解锁所有 Glyph 外观套装！
    </h3>
    <br>
    <h3>
      你也可以导入 “speedrun” 来重新开始游戏，并启用速通用的额外记录。
    </h3>
  </div>
</template>

<style scoped>
.c-new-game-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.t-s12 .c-new-game-container {
  color: white;
}

.c-new-game-button-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.c-new-game-button {
  font-family: Typewriter;
  background: grey;
  border: black;
  border-radius: var(--var-border-radius, 0.5rem);
  margin-top: 1rem;
  padding: 1rem;
  cursor: pointer;
}
</style>
