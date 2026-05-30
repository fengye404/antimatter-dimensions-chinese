import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const IP = {
  total: {
    name: "本次无限可获得的无限点数",
    displayOverride: () => (Player.canCrunch
      ? format(gainedInfinityPoints(), 2, 2)
      : "无法大坍缩"),
    // This effectively hides everything if the player can't actually gain any
    multValue: () => (Player.canCrunch ? gainedInfinityPoints() : 1),
    isActive: () => PlayerProgress.infinityUnlocked() || Player.canCrunch,
    dilationEffect: () => (Laitela.isRunning ? 0.75 * Effects.product(DilationUpgrade.dilationPenalty) : 1),
    isDilated: true,
    overlay: ["∞", "<i class='fa-solid fa-layer-group' />"],
  },
  base: {
    name: "基础无限点数",
    isBase: true,
    fakeValue: DC.D5,
    multValue: () => {
      const div = Effects.min(308, Achievement(103), TimeStudy(111));
      return Decimal.pow10(player.records.thisInfinity.maxAM.log10() / div - 0.75);
    },
    isActive: () => player.break,
    icon: MultiplierTabIcons.CONVERT_FROM("AM"),
  },
  antimatter: {
    name: "由反物质换算的无限点数",
    displayOverride: () => `${format(player.records.thisInfinity.maxAM, 2, 2)} AM`,
    // Just needs to match the value in base and be larger than 1
    multValue: DC.D5,
    isActive: () => player.break,
    icon: MultiplierTabIcons.ANTIMATTER,
  },
  divisor: {
    name: "公式改良",
    displayOverride: () => {
      const div = Effects.min(308, Achievement(103), TimeStudy(111));
      return `log(AM)/${formatInt(308)} ➜ log(AM)/${format(div, 2, 1)}`;
    },
    powValue: () => 308 / Effects.min(308, Achievement(103), TimeStudy(111)),
    isActive: () => Achievement(103).canBeApplied || TimeStudy(111).isBought,
    icon: MultiplierTabIcons.DIVISOR("IP"),
  },
  infinityUpgrade: {
    name: () => `无限升级 - 可重复 ${formatX(2)} IP`,
    multValue: () => InfinityUpgrade.ipMult.effectOrDefault(1),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("infinity"),
  },
  achievement: {
    name: "成就",
    multValue: () => DC.D1.timesEffectsOf(
      Achievement(85),
      Achievement(93),
      Achievement(116),
      Achievement(125),
      Achievement(141).effects.ipGain,
    ),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  timeStudy: {
    name: "时间研究",
    multValue: () => DC.D1.timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143),
    ),
    isActive: () => player.break && !Pelle.isDoomed,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  dilationUpgrade: {
    name: "时间膨胀升级 - 基于膨胀时间的 IP 倍率",
    multValue: () => DilationUpgrade.ipMultDT.effectOrDefault(1),
    isActive: () => DilationUpgrade.ipMultDT.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
  glyph: {
    name: "已装备符文",
    multValue: () => Pelle.specialGlyphEffect.infinity.times(Pelle.isDoomed ? 1 : getAdjustedGlyphEffect("infinityIP")),
    powValue: () => (GlyphAlteration.isAdded("infinity") ? getSecondaryGlyphEffect("infinityIP") : 1),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  alchemy: {
    name: "符文炼金",
    multValue: () => Replicanti.amount.powEffectOf(AlchemyResource.exponential),
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  pelle: {
    name: "Pelle 破碎 - 真空裂隙",
    multValue: () => DC.D1.timesEffectsOf(PelleRifts.vacuum),
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  },
  iap: {
    name: "商店购买",
    multValue: () => ShopPurchase.IPPurchases.currentMult,
    isActive: () => ShopPurchaseData.totalSTD > 0,
    icon: MultiplierTabIcons.IAP,
  },

  nerfTeresa: {
    name: "Teresa 的现实",
    powValue: () => 0.55,
    isActive: () => Teresa.isRunning,
    icon: MultiplierTabIcons.GENERIC_TERESA,
  },
  nerfV: {
    name: "V 的现实",
    powValue: () => 0.5,
    isActive: () => V.isRunning,
    icon: MultiplierTabIcons.GENERIC_V,
  },
};
