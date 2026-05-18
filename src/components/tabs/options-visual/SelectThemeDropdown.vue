<script>
const THEME_NAMES = {
  "AMOLED": "AMOLED",
  "AMOLED Metro": "AMOLED 都市",
  "Dark": "深色",
  "Dark Metro": "深色都市",
  "Inverted": "反色",
  "Inverted Metro": "反色都市",
  "Metro": "都市",
  "Normal": "普通"
};

export default {
  name: "SelectThemeDropdown",
  data() {
    return {
      availableThemeNames: []
    };
  },
  computed: {
    themes() {
      return this.availableThemeNames.map(name => Themes.find(name));
    }
  },
  methods: {
    update() {
      this.availableThemeNames = Themes.available().map(t => t.name);
    },
    localizeTheme(name) {
      return THEME_NAMES[name] || name;
    }
  }
};
</script>

<template>
  <div class="l-select-theme">
    <div class="l-select-theme__inner">
      <div
        v-for="theme in themes"
        :key="theme.name"
        class="o-primary-btn l-select-theme__item c-select-theme__item"
        @click="theme.set()"
      >
        {{ localizeTheme(theme.displayName()) }}
      </div>
    </div>
  </div>
</template>
