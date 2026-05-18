export const catchupResources = [
  {
    name: "Antimatter Dimensions",
    displayName: "反物质维度",
    id: 0,
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: "每个反物质维度都会持续产出下一层级的维度，最低层级的反物质维度会产出反物质。"
  },
  {
    name: "Tickspeed Upgrades",
    displayName: "时间间隔升级",
    id: 1,
    openH2pEntry: "Tickspeed",
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: "时间间隔升级会让反物质维度像时间流逝得更快一样，更快地产出其他反物质维度或反物质。"
  },
  {
    name: "Autobuyers",
    displayName: "自动购买器",
    id: 2,
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: "自动购买器是游戏内置的自动化功能，会在你负担得起时自动购买反物质维度相关升级。"
  },
  {
    name: "Dimension Boosts",
    displayName: "维度提升",
    id: 3,
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: "维度提升会在你拥有足够数量的最高可用反物质维度后，重置反物质维度和时间间隔，并为反物质维度提供倍率。"
  },
  {
    name: "Antimatter Galaxies",
    displayName: "反物质星系",
    id: 4,
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: "反物质星系会重置反物质维度和维度提升，并以复合方式增强时间间隔升级的效果。"
  },
  {
    name: "Infinity",
    displayName: "无限",
    id: 5,
    requiredStage: PROGRESS_STAGE.EARLY_INFINITY,
    description: "无限是第一层主要重置。达到 1.80e308 反物质后，你可以重置此前的内容，以换取新内容和新资源。"
  },
  {
    name: "Infinity Points",
    displayName: "无限点数",
    id: 6,
    openH2pEntry: "Infinity",
    requiredStage: PROGRESS_STAGE.EARLY_INFINITY,
    description: "无限点数是完成第一次无限后的主要资源，可用于购买能在无限重置后保留的功能。"
  },
  {
    name: "Normal Challenges",
    displayName: "普通挑战",
    id: 7,
    openH2pEntry: "Normal Challenges",
    requiredStage: PROGRESS_STAGE.EARLY_INFINITY,
    description: "挑战要求你在更困难的条件下达到 1.80e308 反物质。完成挑战可以升级自动购买器。"
  },
  {
    name: "Break Infinity",
    displayName: "突破无限",
    id: 8,
    requiredStage: PROGRESS_STAGE.BREAK_INFINITY,
    description: "将大坍缩自动购买器升到最高后，你就可以超过 1.80e308 反物质，并随着反物质增加获得更多无限点数。"
  },
  {
    name: "Infinity Dimensions",
    displayName: "无限维度",
    id: 9,
    requiredStage: PROGRESS_STAGE.BREAK_INFINITY,
    description: "无限维度会像反物质维度一样逐层产出。最低层级的无限维度产出无限之力，而无限之力会大幅提高所有反物质维度的倍率。"
  },
  {
    name: "Infinity Challenges",
    displayName: "无限挑战",
    id: 10,
    requiredStage: PROGRESS_STAGE.BREAK_INFINITY,
    description: "无限挑战是目标超过 1.80e308 的新挑战。完成它们可以获得升级和产出加成。"
  },
  {
    name: "Replicanti",
    displayName: "复制体",
    id: 11,
    requiredStage: PROGRESS_STAGE.REPLICANTI,
    description: "复制体是一种会随时间自我增长的资源，并为所有无限维度提供倍率。达到 1.80e308 复制体后，" +
      "可以将其重置为 1，换取一个不会提高反物质星系花费的额外星系。复制体也会在每次无限后重置。"
  },
  {
    name: "Eternity",
    displayName: "永恒",
    id: 12,
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: "永恒是第二层主要重置。达到 1.80e308 无限点数后，你可以重置此前内容，以解锁新的内容和资源。"
  },
  {
    name: "Eternity Points",
    displayName: "永恒点数",
    id: 13,
    openH2pEntry: "Eternity",
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: "永恒点数是完成第一次永恒后的主要资源，获取量取决于完成永恒时拥有的无限点数。"
  },
  {
    name: "Time Studies",
    displayName: "时间研究",
    id: 14,
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: "时间研究类似技能树，可以在每次永恒后无损重新分配。部分研究分支有路径限制，不能同时选择互斥研究。"
  },
  {
    name: "Eternity Milestones",
    displayName: "永恒里程碑",
    id: 15,
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: "永恒里程碑提供内置自动化和便利功能，只需要完成更多次永恒即可解锁，不需要额外消耗资源。"
  },
  {
    name: "Time Dimensions",
    displayName: "时间维度",
    id: 16,
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: "时间维度也会逐层产出，最低层级会产出时间碎片。时间碎片提供额外的时间间隔升级，并且不会提高用反物质购买的时间间隔升级花费。"
  },
  {
    name: "Eternity Challenges",
    displayName: "永恒挑战",
    id: 17,
    requiredStage: PROGRESS_STAGE.ETERNITY_CHALLENGES,
    description: "永恒挑战是带有特殊限制的永恒，需要达到指定无限点数目标才能完成。每个挑战最多完成五次，次数越多越困难，奖励也越强。"
  },
  {
    name: "Time Dilation",
    displayName: "时间膨胀",
    id: 18,
    requiredStage: PROGRESS_STAGE.EARLY_DILATION,
    description: () => "时间膨胀是一种特殊永恒，其中时间间隔和所有维度倍率都会被大幅削弱。完成膨胀永恒可以获得快子粒子。"
  },
  {
    name: "Tachyon Particles",
    displayName: "快子粒子",
    id: 19,
    openH2pEntry: "Time Dilation",
    requiredStage: PROGRESS_STAGE.EARLY_DILATION,
    description: () => "快子粒子无法直接刷取，需要在膨胀永恒中达到更高反物质量来提高数量。快子粒子会产出膨胀时间。"
  },
  {
    name: "Reality",
    displayName: "现实",
    id: 20,
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: "现实是第三层，也是最后一层主要重置。达到 1e4000 永恒点数后，你可以选择重置此前内容，以解锁新内容并获得新资源。"
  },
  {
    name: "Reality Machines",
    displayName: "现实机器",
    id: 21,
    openH2pEntry: "Reality",
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: "现实机器是完成第一次现实后的主要资源，获取量取决于完成现实时拥有的永恒点数。"
  },
  {
    name: "Perks",
    displayName: "特权",
    id: 22,
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: "特权是类似永恒里程碑的可解锁功能，主要提供便利和自动化。它们消耗特权点购买，而特权点会在每次现实后获得。"
  },
  {
    name: "Glyphs",
    displayName: "符文",
    id: 23,
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: "符文是可装备升级，只能在现实之间卸下。每次现实后你都能从多个随机符文中选择一个，候选符文的平均质量取决于本次现实中部分资源达到的高度。"
  },
  {
    name: "Automator",
    displayName: "自动化脚本",
    id: 24,
    openH2pEntry: "Automator Overview",
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: "自动化脚本是内置脚本系统。随着升级和特权增加，它最终可以让你几乎无需手动操作就完成现实。"
  },
  {
    name: "Black Hole",
    displayName: "黑洞",
    id: 25,
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: "黑洞会按周期加速整个游戏，影响截至当前阶段的所有内容，效果类似让游戏额外运行了等量时间。"
  },
  {
    name: "Teresa",
    displayName: "Teresa",
    id: 26,
    requiredStage: PROGRESS_STAGE.TERESA,
    description: "Teresa 是第一位天体，拥有一个更困难的现实；完成程度会大幅增强符文献祭。她解锁的升级主要用于更轻松地测试和自动化现实。"
  },
  {
    name: "Effarig",
    displayName: "Effarig",
    id: 27,
    requiredStage: PROGRESS_STAGE.EFFARIG,
    description: "Effarig 是第二位天体，其现实会限制符文并带有逐步加强的削弱，但每抵达新的重置层都会给予奖励。他的升级侧重于自动选择和筛选大量符文，并消耗新资源“遗物碎片”购买。"
  },
  {
    name: "The Nameless Ones",
    displayName: "无名之辈",
    id: 28,
    openH2pEntry: "Nameless Ones",
    requiredStage: PROGRESS_STAGE.ENSLAVED,
    description: "无名之辈是第三位天体，其现实包含一长串极其严厉的削弱，但能让找到突破方法的玩家解锁超立方体。他们还会改造黑洞，使其能够储存时间。"
  },
  {
    name: "Stored Time",
    displayName: "储存时间",
    id: 29,
    openH2pEntry: "Nameless Ones",
    requiredStage: PROGRESS_STAGE.ENSLAVED,
    description: "黑洞可以用两种方式储存时间。充能会让你保留被加速的游戏时间，并在之后一次性释放为跳跃；储存现实时间则可以用真实时间模拟现实，或作为离线进度的替代。"
  },
  {
    name: "Tesseracts",
    displayName: "超立方体",
    id: 30,
    requiredStage: PROGRESS_STAGE.ENSLAVED,
    description: "无限维度不能无限购买，除了第 8 无限维度外都有购买次数硬上限。每个超立方体都会永久大幅提高这个上限。"
  },
  {
    name: "V",
    displayName: "V",
    id: 31,
    requiredStage: PROGRESS_STAGE.V,
    description: "V 是第四位天体，其改造现实类似 Teresa 的现实，但只有在其中达到特定资源里程碑才会给予奖励。她提供新资源“空间定理”，可用于购买额外时间研究且不受路径限制。"
  },
  {
    name: "Ra",
    displayName: "Ra",
    id: 32,
    requiredStage: PROGRESS_STAGE.RA,
    description: "Ra 是第五位天体，其改造现实会根据其中达到的资源总量产出“记忆块”。Ra 主要强化前四位天体留下的升级和主题，并补足后期自动化与便利功能。"
  },
  {
    name: "Memories",
    displayName: "记忆",
    id: 33,
    openH2pEntry: "Ra",
    requiredStage: PROGRESS_STAGE.RA,
    description: "Ra 掌控前四位天体，并根据记忆块数量持续产出记忆。记忆可用于提升这些天体的等级，并在达到特定等级时提供升级。"
  },
  {
    name: "Charged Infinity Upgrades",
    displayName: "充能无限升级",
    id: 34,
    openH2pEntry: "Ra",
    requiredStage: PROGRESS_STAGE.RA,
    description: "Teresa 的记忆允许你为无限升级充能，使其保留类似效果但显著增强。哪些升级被充能只能在现实之间调整。"
  },
  {
    name: "Glyph Alchemy",
    displayName: "符文炼金",
    id: 35,
    requiredStage: PROGRESS_STAGE.RA,
    description: "Effarig 的记忆会解锁符文炼金。它使用改造版符文献祭带来许多小幅加成；通过这种方式放弃符文获得的资源，需要在反应中组合才能完全升级效果。"
  },
  {
    name: "Amplified Black Hole",
    displayName: "强化黑洞",
    id: 36,
    openH2pEntry: "Ra",
    requiredStage: PROGRESS_STAGE.RA,
    description: "无名之辈的记忆会强化黑洞充能，使储存的游戏时间多于实际经过的游戏时间。释放储存时间也可以重复并自动执行。"
  },
  {
    name: "Harder V",
    displayName: "更难的 V",
    id: 37,
    openH2pEntry: "Ra",
    requiredStage: PROGRESS_STAGE.RA,
    description: "V 的记忆会解锁 V 原始现实的强化版本，目标更困难，并加入一组名为三元研究的新时间研究。"
  },
  {
    name: "Imaginary Machines",
    displayName: "虚幻机器",
    id: 38,
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: "虚幻机器是在达到 1e1000 现实机器后解锁的新资源。它会被动产出，直到达到上限；上限取决于你历史最远现实本应获得的现实机器数量。"
  },
  {
    name: "Lai'tela",
    displayName: "Lai'tela",
    id: 39,
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: "Lai'tela 是第六位天体，其现实拥有改造后的完成条件，并根据你达到条件的速度给予缩放奖励。她解锁的功能大多与“暗物质”相关。"
  },
  {
    name: "Continuum",
    displayName: "连续统",
    id: 40,
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: "连续统是一种改造后的产出方式，会让反物质维度像购买了小数数量的升级一样产出，但实际上并不会购买这些升级。"
  },
  {
    name: "Dark Matter Dimensions",
    displayName: "暗物质维度",
    id: 41,
    openH2pEntry: "Lai'tela",
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: "暗物质维度是逐层产出系统，但它基于游戏刻运行，而不是连续运行。最低层级产出暗物质，所有层级都会产出暗能量。"
  },
  {
    name: "Dimension Reset Mechanics",
    displayName: "维度重置机制",
    id: 42,
    openH2pEntry: "Lai'tela",
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: "暗物质维度可以通过两种方式重置。湮灭会重置所有暗物质维度，换取永久作用于全部暗物质维度的倍率；飞升会提高产出，但重置单个维度的间隔。"
  },
  {
    name: "Singularities",
    displayName: "奇点",
    id: 43,
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: "暗能量可用于产生奇点，奇点会根据总数量提供加成。生成奇点时，超过凝聚阈值的额外暗能量会被浪费。"
  },
  {
    name: "Pelle",
    displayName: "Pelle",
    id: 44,
    requiredStage: PROGRESS_STAGE.PELLE,
    description: "Pelle 是第七位也是最后一位天体，会永久毁灭你的游戏，把你投入一个无法逃离、极其困难的改造现实。"
  },
  {
    name: "Armageddon",
    displayName: "末日",
    id: 45,
    openH2pEntry: "Pelle",
    requiredStage: PROGRESS_STAGE.PELLE,
    description: "末日是 Pelle 专属重置，可以随时执行。它会把进度重置回毁灭现实的开端，但给予能产出现实碎片的遗迹。"
  },
  {
    name: "Pelle Strikes and Rifts",
    displayName: "Pelle 打击与裂隙",
    id: 46,
    openH2pEntry: "Pelle Strikes",
    requiredStage: PROGRESS_STAGE.PELLE,
    description: "在 Pelle 中达到特定进度里程碑后，会触发一次打击，并永久给毁灭现实附加新的削弱。每次打击都会伴随一个裂隙，允许你抽取某种资源来换取加成。这些内容是永久的，并会在末日后保持解锁。"
  },
];
