import { DC } from "../../constants";

export const effarigUnlocks = {
  adjuster: {
    id: 0,
    description: "可调整符文等级因素权重",
    cost: 1e7,
    onPurchased: () => {
      Effarig.quotes.unlockWeights.show();
      ui.view.tabs.reality.openGlyphWeights = true;
      Tab.reality.glyphs.show();
    }
  },
  glyphFilter: {
    id: 1,
    description: "符文筛选",
    cost: 2e8,
    onPurchased: () => {
      Effarig.quotes.unlockGlyphFilter.show();
      player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.FILTER_SETTINGS;
    }
  },
  setSaves: {
    id: 2,
    description: "符文预设",
    cost: 3e9,
    onPurchased: () => {
      Effarig.quotes.unlockSetSaves.show();
      player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.SAVED_SETS;
    }
  },
  run: {
    id: 3,
    description: "Effarig 的现实",
    cost: 5e11,
    onPurchased: () => {
      Effarig.quotes.unlockRun.show();
    }
  },
  infinity: {
    id: 4,
    label: "无限",
    get description() {
      return ` 复制器上限会根据无限次数获得倍率
        无限次数会提高复制器星系上限
        在 Effarig 的现实中，基础无限点数收益最高为 ${format(DC.E200)}
        各类无限点数倍率在 Effarig 的现实中最高为 ${format(DC.E50)}`;
    },
  },
  eternity: {
    id: 5,
    label: "永恒",
    get description() {
      return ` 永恒次数会生成无限次数
        Effarig 的现实中不再限制无限点数
        解锁无名之辈`;
    },
  },
  reality: {
    id: 6,
    label: "现实",
    get description() {
      return " 解锁 Effarig 符文（最多只能装备一个，部分效果互斥）";
    },
  }
};
