import { DC } from "@/core/constants";

export const MatterScale = {
  proton: new Decimal("2.82e-45"),

  estimate(matter) {
    if (!matter) return ["还没有反物质。"];
    if (matter.gt(DC.E100000)) {
      return [
        `如果你每秒写下 ${formatInt(3)} 个数字，需要`,
        TimeSpan.fromSeconds(matter.log10() / 3).toString(),
        "才能写完你的反物质数量。"
      ];
    }
    const planck = new Decimal("4.22419e-105");
    const planckedMatter = matter.times(planck);
    if (planckedMatter.gt(this.proton)) {
      const scale = this.macroScale(planckedMatter);
      const amount = format(planckedMatter.dividedBy(scale.amount), 2, 1);
      return [`如果每个反物质都有一个普朗克体积，这些反物质总体积大约相当于${amount} ${scale.name}。`];
    }
    const scale = this.microScale(matter);
    return [`如果每个反物质都有 ${format(this.proton.div(scale.amount).div(matter), 2, 1)} ${scale.name}，
      你就足够构成一个质子。`];
  },

  microScale(matter) {
    const micro = this.microObjects;
    for (let i = 0; i < micro.length; i++) {
      const scale = micro[i];
      if (matter.times(scale.amount).lt(this.proton)) {
        return scale;
      }
    }
    throw "Cannot determine smallest antimatter scale";
  },

  macroScale(matter) {
    const macro = this.macroObjects;
    const last = macro.last();
    if (matter.gte(last.amount)) return last;
    let low = 0;
    let high = macro.length;
    while (low !== high) {
      const mid = Math.floor((low + high) / 2);
      if (macro[mid].amount.lte(matter)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return macro[high - 1];
  },

  microObjects: [
    { amount: new Decimal("1e-54"), name: "立方阿米" },
    { amount: new Decimal("1e-63"), name: "立方仄米" },
    { amount: new Decimal("1e-72"), name: "立方幺米" },
    { amount: new Decimal("4.22419e-105"), name: "普朗克体积" }
  ],

  macroObjects: [
    { amount: new Decimal("2.82e-45"), name: "个质子" },
    { amount: new Decimal("1e-42"), name: "个原子核" },
    { amount: new Decimal("7.23e-30"), name: "个氢原子" },
    { amount: new Decimal("5e-21"), name: "个病毒" },
    { amount: new Decimal("9e-17"), name: "个红细胞" },
    { amount: new Decimal("6.2e-11"), name: "粒沙子" },
    { amount: new Decimal("5e-8"), name: "粒米" },
    { amount: new Decimal("3.555e-6"), name: "茶匙" },
    { amount: new Decimal("7.5e-4"), name: "瓶葡萄酒" },
    { amount: DC.D1, name: "台冰箱" },
    { amount: new Decimal("2.5e3"), name: "座奥运泳池" },
    { amount: new Decimal("2.6006e6"), name: "座吉萨大金字塔" },
    { amount: new Decimal("3.3e8"), name: "座万里长城" },
    { amount: new Decimal("5e12"), name: "颗大型小行星" },
    { amount: new Decimal("4.5e17"), name: "颗矮行星" },
    { amount: new Decimal("1.08e21"), name: "个地球" },
    { amount: new Decimal("1.53e24"), name: "个木星" },
    { amount: new Decimal("1.41e27"), name: "个太阳" },
    { amount: new Decimal("5e32"), name: "颗红巨星" },
    { amount: new Decimal("8e36"), name: "颗特超巨星" },
    { amount: new Decimal("1.7e45"), name: "片星云" },
    { amount: new Decimal("1.7e48"), name: "片奥尔特云" },
    { amount: new Decimal("3.3e55"), name: "个本地泡" },
    { amount: new Decimal("3.3e61"), name: "个星系" },
    { amount: new Decimal("5e68"), name: "个本星系群" },
    { amount: new Decimal("1e73"), name: "个玉夫座空洞" },
    { amount: new Decimal("3.4e80"), name: "个可观测宇宙" },
    { amount: new Decimal("1e113"), name: "个维度" },
    { amount: DC.C2P1024, name: "个无限维度" },
    { amount: new Decimal("1e65000"), name: "个时间维度" }
  ]
};
