<script>
import { createEntryInfo } from "./breakdown-entry-info";
import MultiplierBreakdownEntry from "./MultiplierBreakdownEntry";

const MULT_TAB_OPTIONS = [
  { id: 0, key: "AM", text: "反物质产量" },
  { id: 1, key: "tickspeed", text: "时间间隔" },
  { id: 2, key: "AD", text: "反物质维度" },
  { id: 3, key: "IP", text: "无限点数" },
  { id: 4, key: "ID", text: "无限维度" },
  { id: 5, key: "infinities", text: "无限次数" },
  { id: 6, key: "replicanti", text: "复制品速度" },
  { id: 7, key: "EP", text: "永恒点数" },
  { id: 8, key: "TD", text: "时间维度" },
  { id: 9, key: "eternities", text: "永恒次数" },
  { id: 10, key: "DT", text: "膨胀时间" },
  { id: 11, key: "gamespeed", text: "游戏速度" },
];

export default {
  name: "MultiplierBreakdownTab",
  components: {
    MultiplierBreakdownEntry
  },
  data() {
    return {
      availableOptions: [],
      currentID: player.options.multiplierTab.currTab,
    };
  },
  computed: {
    currentKey() {
      return MULT_TAB_OPTIONS.find(opt => opt.id === this.currentID).key;
    },
    resource() {
      return createEntryInfo(`${this.currentKey}_total`);
    },
    resourceSymbols() {
      return GameDatabase.multiplierTabValues[this.currentKey].total.overlay;
    }
  },
  methods: {
    update() {
      this.availableOptions = MULT_TAB_OPTIONS.map(opt => ({
        ...opt,
        isActive: this.checkActiveKey(opt.key)
      })).filter(opt => opt.isActive);
    },
    checkActiveKey(key) {
      const act = GameDatabase.multiplierTabValues[key].total.isActive;
      return typeof act === "function" ? act() : act;
    },
    accessProp(prop) {
      return typeof prop === "function" ? prop() : prop;
    },
    subtabClassObject(option) {
      return {
        "c-multiplier-subtab-btn": true,
        "c-multiplier-subtab-btn--active": option.key === this.currentKey,
      };
    },
    clickSubtab(index) {
      this.currentID = this.availableOptions[index].id;
      player.options.multiplierTab.currTab = MULT_TAB_OPTIONS.find(opt => opt.key === this.currentKey).id;
    }
  }
};
</script>

<template>
  <div class="c-stats-tab">
    <div class="l-multiplier-subtab-btn-container">
      <button
        v-for="(option, index) in availableOptions"
        :key="option.key + option.isActive"
        :class="subtabClassObject(option)"
        @click="clickSubtab(index)"
      >
        {{ option.text }}
      </button>
    </div>
    <div class="c-list-container">
      <span
        v-for="symbol in resourceSymbols"
        :key="symbol"
      >
        <span
          class="c-symbol-overlay"
          v-html="symbol"
        />
      </span>
      <MultiplierBreakdownEntry
        :key="resource.key"
        :resource="resource"
        :is-root="true"
      />
      <div class="c-multiplier-tab-text-line">
        注意：只有包含多个来源、且这些来源数值可能不同的条目才能展开。
        例如，对同一类型所有维度产生完全相同影响的效果，不会展开成八个相同数字。
        <br>
        <b>
          某些条目完全展开时可能造成卡顿。为了降低光敏风险，展开高度会在 200 毫秒内渐变，
          而不是瞬间改变；这可能会在重置事件后造成短暂的视觉异常。
        </b>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-list-container {
  position: relative;
  width: 100rem;
}

.l-multiplier-subtab-btn-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100rem;
  height: calc(4rem - var(--var-border-radius, 0.2rem));
}

.c-multiplier-subtab-btn {
  width: 100%;
  height: 4rem;
  margin: 0 0.5rem -0.1rem;
  z-index: 1;
  text-align: center;
  font-family: Typewriter;
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid;
  border-radius: var(--var-border-radius, 0.5rem) var(--var-border-radius, 0.5rem) 0 0;
  cursor: pointer;
}

.c-multiplier-subtab-btn--active {
  border-bottom: none;
  padding-bottom: 0.2rem;
  cursor: default;
}

.c-multiplier-tab-text-line {
  color: var(--color-text);
  font-size: 1.3rem;
}

.c-symbol-overlay {
  display: flex;
  width: 100%;
  height: 100%;
  top: -5%;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 40rem;
  color: var(--color-text);
  text-shadow: 0 0 3rem;
  pointer-events: none;
  user-select: none;
  opacity: 0.2;
  z-index: 1;
}

@media (max-width: 700px), (pointer: coarse) and (max-width: 900px) {
  .c-list-container,
  .l-multiplier-subtab-btn-container {
    box-sizing: border-box;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden;
  }

  .l-multiplier-subtab-btn-container {
    display: grid;
    grid-template-columns: 1fr;
    height: auto;
    gap: 0.55rem;
  }

  .c-multiplier-subtab-btn {
    box-sizing: border-box;
    width: 100% !important;
    max-width: calc(100vw - 3.2rem);
    min-height: 3.9rem;
    height: auto;
    margin: 0 auto !important;
    padding: 0.6rem 0.8rem;
    border-radius: 1rem;
  }
}
</style>
