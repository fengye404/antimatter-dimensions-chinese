<script>
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "HotkeysModal",
  components: {
    ModalWrapper
  },
  data() {
    return {
      updateIndicies: [],
      visible: [],
      timeStudyUnlocked: false,
      glyphSacUnlocked: false,
      isElectron: false
    };
  },
  computed: {
    moreShiftKeyInfo() {
      const shiftKeyFunctions = [];
      if (this.timeStudyUnlocked) {
        shiftKeyFunctions.push("购买时间研究时一次买到当前节点");
        shiftKeyFunctions.push("保存时间研究树");
      }
      if (this.glyphSacUnlocked) {
        shiftKeyFunctions.push("清理符文");
      }
      const shiftKeyInfo = shiftKeyFunctions.join("、");
      return (shiftKeyInfo === "")
        ? ""
        : `你还可以按住 Shift 来${shiftKeyInfo}。`;
    },
    hotkeyCount() {
      return shortcuts.length;
    },
    shortcutNames() {
      return shortcuts.map(x => this.localizeShortcutName(x.name));
    },
    shortcutKeys() {
      return shortcuts.map(x => x.keys.map(key => this.format(key)));
    }
  },
  created() {
    for (let i = 0; i < this.hotkeyCount; i++) {
      const visible = shortcuts[i].visible;
      if (typeof visible === "function") {
        this.updateIndicies.push(i);
      } else {
        this.visible[i] = visible;
      }
    }
  },
  methods: {
    update() {
      for (const index of this.updateIndicies) {
        this.$set(this.visible, index, shortcuts[index].visible());
      }
      const progress = PlayerProgress.current;
      this.timeStudyUnlocked = progress.isEternityUnlocked;
      this.glyphSacUnlocked = RealityUpgrade(19).isBought;

      // ElectronRuntime is a global which only exists on Steam (throws a ReferenceError on web)
      try {
        this.isElectron = ElectronRuntime.isActive;
      } catch {
        this.isElectron = false;
      }
    },
    format(x) {
      switch (x) {
        case "mod":
          return "CTRL/⌘";
        default:
          return x.toUpperCase();
      }
    },
    localizeShortcutName(name) {
      const names = {
        "Toggle Autobuyers": "切换自动购买器",
        "Buy one Tickspeed": "购买 1 次时间间隔升级",
        "Buy max Tickspeed": "购买最大时间间隔升级",
        "Max all": "全部最大",
        "Dimensional Sacrifice": "维度牺牲",
        "Dimension Boost": "维度提升",
        "Single Dimension Boost": "单次维度提升",
        "Antimatter Galaxy": "反物质星系",
        "Single Antimatter Galaxy": "单次反物质星系",
        "Big Crunch": "大坍缩",
        "Replicanti Galaxy": "复制品星系",
        "Eternity": "永恒",
        "Toggle Time Study respec": "切换时间研究重洗",
        "Enter/Exit Dilation": "进入/退出时间膨胀",
        "Reality": "现实",
        "Toggle Glyph unequip": "切换符文自动卸下",
        "Start/Pause Automator": "启动/暂停自动机",
        "Restart Automator": "重启自动机",
        "Undo Edit (Automator)": "撤销编辑（自动机）",
        "Redo Edit (Automator)": "重做编辑（自动机）",
        "Toggle Black Hole": "切换黑洞",
        "Toggle Continuum": "切换连续统",
        "Armageddon": "末日",
        "Toggle Glyph unequip (Pelle)": "切换符文自动卸下（珀勒）",
        "Open Hotkey List Modal": "打开快捷键列表",
        "Close Modal or open Options": "关闭弹窗或打开选项",
        "Confirm Modal": "确认弹窗",
        "Modify visible tabs": "修改可见标签页",
        "Save game": "保存游戏",
        "Export game": "导出存档",
        "Open How To Play Modal": "打开游戏玩法弹窗",
        "Paying respects": "表达敬意",
        "Change Tab": "切换主标签页",
        "Change Subtab": "切换子标签页",
        "Doesn't exist": "并不存在",
        "Adjust Autobuyers": "调整自动购买器",
        "Fullscreen": "全屏",
        "Zoom In": "放大",
        "Zoom Out": "缩小",
        "Reset Zoom": "重置缩放"
      };
      return names[name] ?? name;
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      快捷键列表
    </template>
    <span class="c-modal-hotkeys l-modal-hotkeys">
      <div class="l-modal-hotkeys__column">
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">购买 1 个维度</span>
          <kbd>SHIFT</kbd><kbd>1</kbd>-<kbd>SHIFT</kbd><kbd>8</kbd>
        </div>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">购买 10 个维度</span>
          <kbd>1</kbd>-<kbd>8</kbd>
        </div>
        <div
          v-for="index in hotkeyCount"
          :key="index"
        >
          <span
            v-if="visible[index - 1]"
            class="l-modal-hotkeys-row"
          >
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ shortcutNames[index - 1] }}</span>
            <kbd
              v-for="(key, i) in shortcutKeys[index - 1]"
              :key="i"
            >
              {{ key }}
            </kbd>
          </span>
        </div>
      </div>
      <div class="l-modal-hotkeys__column l-modal-hotkeys__column--right">
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">修饰键</span>
          <kbd>SHIFT</kbd>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          Shift 是修饰键，会在部分界面显示额外信息，也会改变某些按钮的功能。
          <br>
          {{ moreShiftKeyInfo }}
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">自动购买器控制</span>
          <kbd>ALT</kbd>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          Alt 是修饰键。按住 Alt 再按某个有对应自动购买器的快捷键时，会切换该自动购买器。
          <br>
          同时按住 Alt 和 Shift 时，会改为切换反物质维度和时间间隔自动购买器的“单次购买/购买最大”模式。
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">标签页移动</span>
          <div>
            <kbd>←</kbd><kbd>↓</kbd><kbd>↑</kbd><kbd>→</kbd>
          </div>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          方向键可以在游戏页面之间切换。上下方向键切换主标签页，左右方向键切换当前标签下的子标签页。
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">小键盘支持</span>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          由于技术原因，按小键盘数字键会尽可能购买 10 个对应维度；但配合 <kbd>SHIFT</kbd> 时不会购买单个维度。
          根据设备不同，这可能会滚动页面或切换游戏标签页。<kbd>ALT</kbd> 仍会按预期工作。
        </span>
        <template v-if="isElectron">
          <br>
          <div class="l-modal-hotkeys-row">
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">窗口缩放</span>
            <kbd>-</kbd><kbd>0</kbd><kbd>+</kbd>
          </div>
          <span class="c-modal-hotkeys__shift-description">
            按住 <kbd>ctrl</kbd> 并按 <kbd>-</kbd> 或 <kbd>+</kbd> 可缩小或放大窗口。
            <kbd>ctrl</kbd><kbd>0</kbd> 会把缩放重置为 100%。
          </span>
          <br>
          <div class="l-modal-hotkeys-row">
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">全屏</span>
            <kbd>F10</kbd>
          </div>
          <span class="c-modal-hotkeys__shift-description">
            按 <kbd>F10</kbd> 进入或退出全屏。
          </span>
        </template>
      </div>
    </span>
  </ModalWrapper>
</template>

<style scoped>
.l-modal-hotkeys__column {
  display: flex;
  flex-direction: column;
  width: 28rem;
}

.l-modal-hotkeys__column--right {
  margin-left: 1rem;
}

.c-modal-hotkeys {
  font-size: 1.25rem;
}

.l-modal-hotkeys {
  display: flex;
  flex-direction: row;
}

.l-modal-hotkeys-row {
  display: flex;
  flex-direction: row;
  line-height: 1.6rem;
  padding-bottom: 0.3rem;
}

.c-modal-hotkeys-row__name {
  text-align: left;
}

.l-modal-hotkeys-row__name {
  flex: 1 1 auto;
}

.c-modal-hotkeys__shift-description {
  text-align: left;
  font-size: 1.15rem;
  line-height: 1.55;
}
</style>
