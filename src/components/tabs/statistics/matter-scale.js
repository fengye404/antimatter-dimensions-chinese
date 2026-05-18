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
      return [`如果每个反物质都有一个普朗克体积，你就足够${scale.verb} ${amount} ${scale.name}。`];
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
    { amount: new Decimal("2.82e-45"), name: "protons", verb: "make" },
    { amount: new Decimal("1e-42"), name: "nuclei", verb: "make" },
    { amount: new Decimal("7.23e-30"), name: "Hydrogen atoms", verb: "make" },
    { amount: new Decimal("5e-21"), name: "viruses", verb: "make" },
    { amount: new Decimal("9e-17"), name: "red blood cells", verb: "make" },
    { amount: new Decimal("6.2e-11"), name: "grains of sand", verb: "make" },
    { amount: new Decimal("5e-8"), name: "grains of rice", verb: "make" },
    { amount: new Decimal("3.555e-6"), name: "teaspoons", verb: "fill" },
    { amount: new Decimal("7.5e-4"), name: "wine bottles", verb: "fill" },
    { amount: DC.D1, name: "fridge-freezers", verb: "fill" },
    { amount: new Decimal("2.5e3"), name: "Olympic-sized swimming pools", verb: "fill" },
    { amount: new Decimal("2.6006e6"), name: "Great Pyramids of Giza", verb: "make" },
    { amount: new Decimal("3.3e8"), name: "Great Walls of China", verb: "make" },
    { amount: new Decimal("5e12"), name: "large asteroids", verb: "make" },
    { amount: new Decimal("4.5e17"), name: "dwarf planets", verb: "make" },
    { amount: new Decimal("1.08e21"), name: "Earths", verb: "make" },
    { amount: new Decimal("1.53e24"), name: "Jupiters", verb: "make" },
    { amount: new Decimal("1.41e27"), name: "Suns", verb: "make" },
    { amount: new Decimal("5e32"), name: "red giants", verb: "make" },
    { amount: new Decimal("8e36"), name: "hypergiant stars", verb: "make" },
    { amount: new Decimal("1.7e45"), name: "nebulas", verb: "make" },
    { amount: new Decimal("1.7e48"), name: "Oort clouds", verb: "make" },
    { amount: new Decimal("3.3e55"), name: "Local Bubbles", verb: "make" },
    { amount: new Decimal("3.3e61"), name: "galaxies", verb: "make" },
    { amount: new Decimal("5e68"), name: "Local Groups", verb: "make" },
    { amount: new Decimal("1e73"), name: "Sculptor Voids", verb: "make" },
    { amount: new Decimal("3.4e80"), name: "observable universes", verb: "make" },
    { amount: new Decimal("1e113"), name: "Dimensions", verb: "make" },
    { amount: DC.C2P1024, name: "Infinity Dimensions", verb: "make" },
    { amount: new Decimal("1e65000"), name: "Time Dimensions", verb: "make" }
  ]
};
