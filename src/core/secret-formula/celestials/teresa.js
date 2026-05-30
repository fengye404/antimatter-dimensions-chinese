export const teresa = {
  unlocks: {
    run: {
      id: 0,
      price: 1e14,
      description: "解锁 Teresa 的现实。",
      onUnlock: () => Teresa.quotes.unlockReality.show(),
    },
    epGen: {
      id: 1,
      price: 1e18,
      description: "解锁永恒点数被动生成。",
      isDisabledInDoomed: true
    },
    effarig: {
      id: 3,
      price: 1e24,
      description: "解锁远古遗物天体 Effarig。",
      onUnlock: () => Teresa.quotes.effarig.show(),
    },
    shop: {
      id: 2,
      price: 1e21,
      description: "解锁 Teresa 的特权点数商店。",
    },
    undo: {
      id: 4,
      price: 1e10,
      description: "解锁装备符文后的“撤销”。",
      isDisabledInDoomed: true
    },
    startEU: {
      id: 5,
      price: 1e6,
      description: "现实开局时自动解锁全部永恒升级。",
      isDisabledInDoomed: true,
      onUnlock: () => {
        for (const id of [1, 2, 3, 4, 5, 6]) player.eternityUpgrades.add(id);
      },
    }
  }
};
