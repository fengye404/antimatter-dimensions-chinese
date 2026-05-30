import { Effarig } from "./effarig";
import { Enslaved } from "./enslaved";
import { Laitela } from "./laitela/laitela";
import { Pelle } from "./pelle/pelle";
import { Ra } from "./ra/ra";
import { Teresa } from "./teresa";
import { V } from "./V";

export const Celestials = {
  teresa: Teresa,
  effarig: Effarig,
  enslaved: Enslaved,
  v: V,
  ra: Ra,
  laitela: Laitela,
  pelle: Pelle
};

GameDatabase.celestials.descriptions = [
  {
    name: "Teresa",
    effects() {
      return `符文产生时间定理的效果被禁用。
      无限点数和永恒点数收益降低（x^${format(0.55, 2, 2)}）。`;
    },
  },
  {
    name: "Effarig",
    effects() {
      return `所有维度倍率、游戏速度与时间间隔都会像时间膨胀一样被大幅压低。
      无限能量会减轻生产和游戏速度惩罚，时间碎片会减轻时间间隔惩罚。
      符文等级暂时最高为 ${formatInt(Effarig.glyphLevelCap)}，稀有度不受影响。`;
    },
    description() {
      return `首次完成 Effarig 现实的每一层时，你会自动退出该现实。`;
    }
  },
  {
    name: "The Nameless Ones",
    effects() {
      return `符文等级至少提升到 ${formatInt(5000)}。
      无限维度、时间维度和第 8 反物质维度每个最多只能购买 ${formatInt(1)} 次。
      反物质维度倍率始终处于膨胀状态（符文效果仍只在真正时间膨胀中生效）。
      时间研究 192（复制器无上限）被锁定。
      黑洞被禁用。
      快子粒子与膨胀时间产量大幅降低。
      膨胀符文产生时间定理的效果被禁用。
      部分挑战目标提高。
      储存的游戏时间释放效果降低（指数^${format(0.55, 2, 2)}）。`;
    }
  },
  {
    name: "V",
    effects() {
      const vEffect = `All Dimension multipliers, Eternity Point gain, Infinity Point gain, and Dilated Time gain\
      per second are square-rooted. 
      The Replicanti interval is squared.`;
      const vEffectAdditional = `
      The Exponential Glyph Alchemy effect is disabled.`;

      return Ra.unlocks.unlockGlyphAlchemy.canBeApplied
        ? vEffect + vEffectAdditional
        : vEffect;
    }
  },
  {
    name: "Ra",
    effects() {
      return `你最多只能拥有 ${formatInt(4)} 次维度提升，且无法再获得更多。
      时间间隔购买倍率固定为 ${formatX(1.1245, 0, 3)}。`;
    },
  },
  {
    name: "Lai'tela",
    effects() {
      let disabledDims;
      const highestActive = 8 - Laitela.difficultyTier;
      switch (highestActive) {
        case 0:
          disabledDims = "all Dimensions";
          break;
        case 1:
          disabledDims = "2nd and higher Dimensions";
          break;
        case 2:
          disabledDims = "3rd and higher Dimensions";
          break;
        case 7:
          disabledDims = "8th Dimensions";
          break;
        default:
          disabledDims = `${highestActive + 1}th and higher Dimensions`;
          break;
      }
      const disabledText = highestActive === 8
        ? ""
        : `Production from ${disabledDims} is disabled.`;

      return `无限点数和永恒点数收益被时间膨胀压低。
      游戏速度降为 ${formatInt(1)}，并在 ${formatInt(10)} 分钟内逐渐恢复。
      黑洞储存、释放、脉冲与反转全部禁用。
      ${disabledText}`;
    },
    description() {
      return `在这个现实中，反物质会生成熵。\
      熵达到 ${formatPercents(1)} 后现实会失稳，\
      你会根据达到 ${formatPercents(1)} 熵的速度获得奖励。
      若在 ${formatInt(30)} 秒内让现实失稳，之后难度会显著提高，\
      但奖励也会强得多。\
      完成 ${formatInt(8)} 次后，还会使暗能量获取变为 ${formatX(8)}。`;
    }
  },

];
