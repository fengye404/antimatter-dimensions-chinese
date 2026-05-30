export const raQuotes = {
  unlock: {
    id: 0,
    lines: [
      "啊……访客？",
      "我在这里！我就是你要找的人……大概吧……",
      "我刚才是什么来着？",
      "哦对，记忆天神。",
    ]
  },
  realityEnter: {
    id: 1,
    lines: [
      "我已经很久没见过其他天神了……",
      "你能帮我想起他们吗？",
      "作为交换，我可以给你力量。",
    ]
  },
  teresaStart: {
    id: 2,
    requirement: () => Ra.pets.teresa.level >= 2,
    lines: [
      "Te……re……sa……",
      "我想我记起来了。",
    ]
  },
  teresaLate: {
    id: 3,
    requirement: () => Ra.pets.teresa.level >= 15,
    lines: [
      "Teresa 好像负责机器。",
      "我记得自己去过 Teresa 的商店几次。",
      "等等，还有别人也开过商店，对吧？",
    ]
  },
  effarigStart: {
    id: 4,
    requirement: () => Ra.pets.effarig.level >= 2,
    lines: [
      "Eff……a……rig",
      "我记得 Effarig 曾经很友善。",
    ]
  },
  effarigLate: {
    id: 5,
    requirement: () => Ra.pets.effarig.level >= 15,
    lines: [
      "Effarig 很挑剔来着？",
      "我还记得一个可怕的现实……",
      "那是关于……痛苦？",
    ]
  },
  enslavedStart: {
    id: 6,
    requirement: () => Ra.pets.enslaved.level >= 2,
    lines: [
      "这个我还没法完全想起来……",
    ]
  },
  enslavedLate: {
    id: 7,
    requirement: () => Ra.pets.enslaved.level >= 15,
    lines: [
      "我开始想起来了……",
      "为什么我在这里……",
      "为什么我独自一人……",
      "帮帮我。",
    ]
  },
  vStart: {
    id: 8,
    requirement: () => Ra.pets.v.level >= 2,
    lines: [
      "我见过这位吗？",
      "如此孤独，却又甘愿如此……",
    ]
  },
  vLate: {
    id: 9,
    requirement: () => Ra.pets.v.level >= 15,
    lines: [
      "我想我见过 V 一次……",
      "我能想起那些成就。",
    ]
  },
  remembrance: {
    id: 10,
    requirement: () => Ra.remembrance.isUnlocked,
    lines: [
      "我想起了什么！",
      "看好了！",
      "追忆！",
      "现在我能更加专注地回忆他们了！",
    ]
  },
  midMemories: {
    id: 11,
    requirement: () => Ra.totalPetLevel >= 50,
    lines: [
      "现实是我的家，可我无法创造属于自己的现实。",
      "我只能复制朋友们的现实。",
      "可是……为什么我听到了声音？",
      "他们是在求救吗？",
    ]
  },
  lateMemories: {
    id: 12,
    requirement: () => Ra.totalPetLevel >= 80,
    lines: [
      "我觉得他们在叫我停下。",
      "你……无论你是什么？",
      "到底发生了什么？",
      "我做错什么了吗？",
    ]
  },
  maxLevels: {
    id: 13,
    requirement: () => Ra.totalPetLevel === Ra.maxTotalPetLevel,
    lines: [
      "终于，我全都想起来了。",
      "将我放逐的这片黑暗。",
      "Lai'tela……",
      "他们放逐我是对的。",
      "我的力量……",
      "会窃取，也会腐化。",
      "请离开。",
      "我不想连你也伤害。",
    ]
  },
};
