export const vQuotes = {
  initial: {
    id: 0,
    lines: [
      "真可悲……"
    ],
  },
  unlock: {
    id: 1,
    lines: [
      "欢迎来到我的现实。",
      "真没想到你居然能抵达这里。",
      "毕竟这里可是我的领域……",
      "不是每个人都能像我一样伟大。",
    ],
  },
  realityEnter: {
    id: 2,
    lines: [
      "那就祝你好运吧！",
      "你会需要它的。",
      "我的现实完美无缺。你一定会失败。",
    ],
  },
  realityComplete: {
    id: 3,
    lines: [
      "这么快……",
      "别太把自己当回事。",
      "这只是开始。",
      "你永远不可能超过我。",
    ],
  },
  achievement1: {
    id: 4,
    requirement: () => V.spaceTheorems >= 1,
    lines: [
      "才一个？可悲。",
      "和我的成就相比，你这点成果黯然失色。",
    ],
  },
  achievement6: {
    id: 5,
    requirement: () => V.spaceTheorems >= 6,
    lines: [
      "这算不了什么。",
      "别太得意忘形。",
    ],
  },
  hex1: {
    id: 6,
    requirement: () => player.celestials.v.runUnlocks.filter(a => a === 6).length >= 1,
    lines: [
      "别以为之后会变得更容易。",
      "就这么一点成就，你未免也太骄傲了。",
    ],
  },
  achievement12: {
    id: 7,
    requirement: () => V.spaceTheorems >= 12,
    lines: [
      "你是怎么……",
      "这根本不算什么！",
      "你永远不可能全部完成。",
    ],
  },
  achievement24: {
    id: 8,
    requirement: () => V.spaceTheorems >= 24,
    lines: [
      "不可能……",
      "明明连我都费了那么大力气……",
    ],
  },
  hex3: {
    id: 9,
    requirement: () => player.celestials.v.runUnlocks.filter(a => a === 6).length >= 3,
    lines: [
      "不……不……不……",
      "这不可能……",
    ],
  },
  allAchievements: {
    id: 10,
    requirement: () => V.spaceTheorems >= 36,
    lines: [
      "我……你到底怎么做到的……",
      "我明明那么努力才得到它们……",
      "我是最伟大的……",
      "没有人比我更强……",
      "没有人……没有人……没——",
    ],
  }
};
