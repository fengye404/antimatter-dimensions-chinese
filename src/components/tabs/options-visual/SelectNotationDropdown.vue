<script>
const NOTATION_NAMES = {
  "ALL": "全部",
  "Bar": "条形",
  "Blind": "盲文",
  "Blobs": "Blob",
  "Brackets": "括号",
  "Cancer": "癌症",
  "Clock": "时钟",
  "Dots": "点号",
  "Emoji": "Emoji",
  "Engineering": "工程计数法",
  "Hex": "十六进制",
  "Imperial": "英制",
  "Infinity": "无限",
  "Letters": "字母",
  "Logarithm": "对数",
  "Mixed engineering": "混合工程计数法",
  "Mixed scientific": "混合科学计数法",
  "Prime": "质数",
  "Roman": "罗马数字",
  "Scientific": "科学计数法",
  "Shi": "中文数字",
  "Standard": "标准",
  "Zalgo": "乱码"
};

export default {
  name: "SelectNotationDropdown",
  computed: {
    notations: () => Notations.all,
  },
  methods: {
    localizeNotation(name) {
      return NOTATION_NAMES[name] || name;
    }
  }
};
</script>

<template>
  <div class="l-select-notation">
    <div class="l-select-notation__inner">
      <div
        v-for="notation in notations"
        :key="notation.name"
        class="o-primary-btn l-select-notation__item c-select-notation__item"
        @click="notation.setAsCurrent()"
      >
        {{ localizeNotation(notation.name) }}
      </div>
    </div>
  </div>
</template>
