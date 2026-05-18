<script>
import ExpandingControlBox from "@/components/ExpandingControlBox";
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";
import OptionsButton from "@/components/OptionsButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SelectNotationDropdown from "@/components/tabs/options-visual/SelectNotationDropdown";
import SelectSidebarDropdown from "@/components/tabs/options-visual/SelectSidebarDropdown";
import SelectThemeDropdown from "@/components/tabs/options-visual/SelectThemeDropdown";
import UpdateRateSlider from "./UpdateRateSlider";

const DISPLAY_TEXT = {
  "AMOLED": "AMOLED",
  "AMOLED Metro": "AMOLED 都市",
  "Bar": "条形",
  "Blind": "盲文",
  "Blobs": "Blob",
  "Brackets": "括号",
  "Cancer": "癌症",
  "Classic": "经典",
  "Commas": "逗号",
  "Dark": "深色",
  "Dark Metro": "深色都市",
  "Dots": "点号",
  "Emoji": "Emoji",
  "Engineering": "工程计数法",
  "Hex": "十六进制",
  "Imperial": "英制",
  "Inverted": "反色",
  "Inverted Metro": "反色都市",
  "Latest Resource": "最新资源",
  "Letters": "字母",
  "Logarithm": "对数",
  "Mixed engineering": "混合工程计数法",
  "Mixed scientific": "混合科学计数法",
  "Modern": "现代",
  "Normal": "普通",
  "Prime": "质数",
  "Roman": "罗马数字",
  "Scientific": "科学计数法",
  "Shi": "中文数字",
  "Standard": "标准",
  "Zalgo": "乱码"
};

export default {
  name: "OptionsVisualTab",
  components: {
    UpdateRateSlider,
    PrimaryToggleButton,
    ExpandingControlBox,
    OptionsButton,
    OpenModalHotkeysButton,
    SelectThemeDropdown,
    SelectNotationDropdown,
    SelectSidebarDropdown
  },
  data() {
    return {
      theme: "",
      notation: "",
      sidebarResource: "",
      headerTextColored: true,
    };
  },
  computed: {
    sidebarDB: () => GameDatabase.sidebarResources,
    themeLabel() {
      return `主题：${this.localizeDisplayText(Themes.find(this.theme).displayName())}`;
    },
    notationLabel() {
      return `记数法：${this.localizeDisplayText(this.notation)}`;
    },
    sidebarLabel() {
      return `侧边栏（现代界面）：${this.localizeDisplayText(this.sidebarResource)}`;
    },
    UILabel() {
      return `界面：${this.$viewModel.newUI ? "现代" : "经典"}`;
    }
  },
  watch: {
    headerTextColored(newValue) {
      player.options.headerTextColored = newValue;
    },
  },
  methods: {
    localizeDisplayText(text) {
      return DISPLAY_TEXT[text] || text;
    },
    update() {
      const options = player.options;
      this.theme = Theme.currentName();
      this.notation = options.notation;
      this.sidebarResource = player.options.sidebarResourceID === 0
        ? "最新资源"
        : this.sidebarDB.find(e => e.id === player.options.sidebarResourceID).optionName;
      this.headerTextColored = options.headerTextColored;
    },
  }
};
</script>

<template>
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-large"
          onclick="GameOptions.toggleUI()"
        >
          {{ UILabel }}
        </OptionsButton>
        <UpdateRateSlider />
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.newsOptions.show();"
        >
          打开新闻选项
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="themeLabel"
        >
          <template #dropdown>
            <SelectThemeDropdown />
          </template>
        </ExpandingControlBox>
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="notationLabel"
        >
          <template #dropdown>
            <SelectNotationDropdown />
          </template>
        </ExpandingControlBox>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.notation.show();"
        >
          打开指数记数法选项
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.animationOptions.show();"
        >
          打开动画选项
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.infoDisplayOptions.show()"
        >
          打开信息显示选项
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.awayProgressOptions.show()"
        >
          打开离线进度选项
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.hiddenTabs.show()"
        >
          调整可见标签页
        </OptionsButton>
        <PrimaryToggleButton
          v-model="headerTextColored"
          class="o-primary-btn--option l-options-grid__button"
          label="重置收益文本着色："
          on="开启"
          off="关闭"
        />
        <ExpandingControlBox
          v-if="$viewModel.newUI"
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="sidebarLabel"
        >
          <template #dropdown>
            <SelectSidebarDropdown />
          </template>
        </ExpandingControlBox>
      </div>
      <OpenModalHotkeysButton />
    </div>
  </div>
</template>
