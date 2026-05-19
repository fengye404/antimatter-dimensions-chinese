<script>
import HintText from "@/components/HintText";
import { secretAchievementText } from "@/core/chinese-achievement-i18n";

export default {
  name: "SecretAchievement",
  components: {
    HintText
  },
  props: {
    achievement: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isMouseOver: false,
      showUnlockState: false
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    config() {
      return this.achievement.config;
    },
    styleObject() {
      if (!this.isUnlocked) return undefined;
      return {
        "background-position": `-${(this.achievement.column - 1) * 104}px -${(this.achievement.row - 1) * 104}px`
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--hidden": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--secret": true
      };
    },
    indicatorIconClass() {
      return this.isUnlocked ? "fas fa-check" : "fas fa-times";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--locked": !this.isUnlocked
      };
    },
    displayName() {
      return secretAchievementText(this.achievement, "name");
    },
    displayDescription() {
      return secretAchievementText(this.achievement, "description");
    }
  },
  beforeDestroy() {
    clearTimeout(this.mouseOverInterval);
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked;
      this.showUnlockState = player.options.showHintText.achievementUnlockStates;
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 300);
    },
    onClick() {
      if (this.id === 11) {
        SecretAchievement(11).unlock();
      }
    }
  }
};
</script>

<template>
  <div
    :class="classObject"
    :style="styleObject"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      v-if="isUnlocked"
      class="o-achievement__zh-title"
    >
      {{ displayName }}
    </div>
    <HintText
      type="achievements"
      class="l-hint-text--achievement"
    >
      S{{ id }}
    </HintText>
    <div class="o-achievement__tooltip">
      <template v-if="isMouseOver">
        <div class="o-achievement__tooltip__name">
          {{ displayName }} (S{{ id }})
        </div>
        <div
          v-if="isUnlocked"
          class="o-achievement__tooltip__description"
        >
          {{ displayDescription }}
        </div>
      </template>
    </div>
    <div
      v-if="showUnlockState"
      :class="indicatorClassObject"
    >
      <i :class="indicatorIconClass" />
    </div>
  </div>
</template>

<style scoped>
.o-achievement--secret {
  background-image: none !important;
}

.o-achievement__zh-title {
  display: flex;
  width: calc(100% - 1.2rem);
  height: calc(100% - 1.2rem);
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  z-index: 1;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0.4rem;
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
  font-size: 1.18rem;
  font-weight: 800;
  line-height: 1.2;
  color: #071308;
  text-shadow: 0 0.1rem 0.2rem rgba(255, 255, 255, 50%);
  pointer-events: none;
}

.o-achievement__indicator {
  z-index: 2;
}
</style>
