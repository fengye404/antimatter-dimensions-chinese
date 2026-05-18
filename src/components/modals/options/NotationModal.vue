<script>
import * as ADNotations from "@antimatter-dimensions/notations";

import ModalWrapper from "@/components/modals/ModalWrapper";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "NotationModal",
  components: {
    ModalWrapper,
    SliderComponent
  },
  data() {
    return {
      commaDigits: 0,
      notationDigits: 0,
    };
  },
  computed: {
    sampleNums() {
      const largestExponent = "123456789012345";
      const numbers = [];
      for (let digits = 4; digits < 16; digits++) numbers.push(Decimal.pow10(largestExponent.substring(0, digits)));
      return numbers;
    },
    sliderProps() {
      return {
        min: 3,
        max: 15,
        interval: 1,
        width: "100%",
        tooltip: false
      };
    },
  },
  watch: {
    commaDigits(newValue) {
      player.options.notationDigits.comma = newValue;
      ADNotations.Settings.exponentCommas.min = 10 ** newValue;
    },
    notationDigits(newValue) {
      player.options.notationDigits.notation = newValue;
      ADNotations.Settings.exponentCommas.max = 10 ** newValue;
    },
  },
  // This puts the sliders in the right spots on initialization
  created() {
    const options = player.options.notationDigits;
    this.commaDigits = options.comma;
    this.notationDigits = options.notation;
  },
  methods: {
    update() {
      const options = player.options.notationDigits;
      this.commaDigits = options.comma;
      this.notationDigits = options.notation;
    },

    // These need a bit of extra logic to ensure that the notation threshold is always >= the comma threshold
    adjustSliderComma(value) {
      this.commaDigits = value;
      player.options.notationDigits.comma = value;
      if (value > this.notationDigits) this.adjustSliderNotation(value);
    },
    adjustSliderNotation(value) {
      this.notationDigits = value;
      player.options.notationDigits.notation = value;
      if (value < this.commaDigits) this.adjustSliderComma(value);
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      指数记数法设置
    </template>
    你可以调整超大数字的指数显示方式。指数较小时会直接显示，不做额外格式化；更大的指数会插入逗号，
    便于阅读；最大的指数会继续套用当前记数法来缩短显示长度。下面两个阈值用于划分这些显示区域：
    <br>
    <br>
    <div class="c-single-slider">
      <b class="o-digit-text">指数加逗号的最小位数：{{ formatInt(commaDigits) }} 位</b>
      <SliderComponent
        class="o-primary-btn--slider__slider o-slider"
        v-bind="sliderProps"
        :value="commaDigits"
        @input="adjustSliderComma($event)"
      />
    </div>
    <div class="c-single-slider">
      <b class="o-digit-text">指数套用记数法的最小位数：{{ formatInt(notationDigits) }} 位</b>
      <SliderComponent
        class="o-primary-btn--slider__slider o-slider"
        v-bind="sliderProps"
        :value="notationDigits"
        @input="adjustSliderNotation($event)"
      />
    </div>
    <br>
    指数格式化示例：
    <div class="c-sample-numbers">
      <span
        v-for="(num, id) in sampleNums"
        :key="id"
        class="o-single-number"
      >
        {{ formatPostBreak(num) }}
      </span>
    </div>
    <br>
    注意：界面通常按科学记数法下 {{ formatInt(5) }} 位和 {{ formatInt(9) }} 位的设置优化。
    如果设置和默认值相差太大，部分文本可能看起来不自然，或者溢出按钮/文本框。另外，某些记数法下这些设置可能不会带来明显视觉变化。
  </ModalWrapper>
</template>

<style scoped>
.c-single-slider {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.o-digit-text {
  width: 40rem;
}

.o-slider {
  width: 25rem;
}

.c-sample-numbers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 1.5rem;
}

.o-single-number {
  width: 33%;
}
</style>
