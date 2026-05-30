<script>
import { isDecimal, isFunction, isNumber } from "@/utility";

/* eslint-disable no-empty-function */
export default {
  name: "CostDisplay",
  props: {
    config: {
      type: Object,
      required: false,
      default: undefined
    },
    br: {
      type: Boolean,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: "花费：",
      required: false
    }
  },
  data() {
    return {
      isVisible: false,
      cost: 0
    };
  },
  computed: {
    translatedName() {
      return {
        "Antimatter": "反物质",
        "Infinity Point": "无限点数",
        "Eternity Point": "永恒点数",
        "Reality Machine": "现实机器",
        "Time Theorem": "时间定理",
        "Tachyon Particle": "快子粒子",
        "Dilated Time": "膨胀时间",
        "Memory": "记忆",
        "Dark Matter": "暗物质",
        "Dark Energy": "暗能量",
        "Perk Point": "特权点数",
        "Relic Shard": "遗物碎片",
        "Reality Shard": "现实碎片",
        "Galaxy": "星系",
        "Imaginary Machine": "虚幻机器"
      }[this.name];
    },
    costText() {
      if (this.translatedName) return `${this.formatCost(this.cost)} ${this.translatedName}`;
      return quantify(this.name, this.cost, 0, 0, this.formatCost);
    }
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        this.updateFunction = () => { };
        const cost = config?.cost;
        this.isVisible = cost !== undefined;
        if (!this.isVisible) return;
        this.formatCost = config.formatCost ?? format;

        if (isNumber(cost)) {
          this.cost = cost;
          return;
        }

        if (isDecimal(cost)) {
          this.cost = Decimal.fromDecimal(cost);
          return;
        }

        if (!isFunction(cost)) {
          throw new Error(`CostDisplay config.cost has unsupported type "${typeof cost}"`);
        }

        const value = cost();

        if (isNumber(value)) {
          this.cost = value;
          this.updateFunction = () => this.cost = cost();
          return;
        }

        if (isDecimal(value)) {
          this.cost = Decimal.fromDecimal(value);
          this.updateFunction = () => this.cost.copyFrom(cost());
          return;
        }

        throw new Error(`CostDisplay config.cost is a function which returns` +
          ` unsupported type "${typeof value}"`);
      }
    }
  },
  beforeCreate() {
    this.updateFunction = () => { };
  },
  methods: {
    update() {
      this.updateFunction();
    },
  }
};
</script>

<template>
  <span v-if="isVisible">
    <br v-if="br">
    {{ label }} {{ costText }}
  </span>
</template>
