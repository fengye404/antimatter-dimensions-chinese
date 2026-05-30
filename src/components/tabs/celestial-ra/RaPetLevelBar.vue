<script>
export default {
  name: "RaPetLevelBar",
  props: {
    petConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      level: 0,
      memories: 0,
      requiredMemories: 0,
      nextLevelEstimate: 0,
    };
  },
  computed: {
    pet() {
      return this.petConfig.pet;
    },
    shiftDown() {
      return ui.view.shiftDown;
    },
    unlocks() {
      return this.pet.unlocks;
    },
    importantLevels() {
      return this.unlocks.map(u => u.level);
    },
    barStyle() {
      return {
        width: `${100 * Math.min(1, this.memories / this.requiredMemories)}%`,
        background: this.pet.color
      };
    },
    petStyle() {
      return {
        "background-color": this.pet.color
      };
    },
    prevGoal() {
      const currentUpgrades = this.importantLevels.filter(goal => goal <= this.level);
      return Math.clampMax(currentUpgrades.max(), 15);
    },
    nextGoal() {
      const missingUpgrades = this.importantLevels.filter(goal => goal > this.level);
      return missingUpgrades.length === 0 ? 25 : missingUpgrades.min();
    },
    currentLevelGoal() {
      return this.level + 1;
    },
    classObject() {
      const available = this.memories >= this.requiredMemories;
      const pet = this.pet;
      return {
        "c-ra-level-up-btn": true,
        "c-ra-pet-btn--available": available,
        [`c-ra-pet-btn--${pet.id}`]: available
      };
    },
    nextUnlock() {
      const unlock = this.pet.unlocks.find(unl => unl.level === this.level + 1);
      return unlock ?? false;
    },
    showNextScalingUpgrade() {
      switch (this.pet.id) {
        case "teresa":
          return Math.min(12, Math.floor(this.level / 2)) !== Math.min(12, Math.floor((this.level + 1) / 2));
        case "effarig":
          return AlchemyResources.all.filter(res => res.unlockedAt === this.level + 1).length > 0;
        case "enslaved":
          return true;
        case "v":
          return Math.min(Math.floor(this.level / 6), 4) !== Math.min(Math.floor((this.level + 1) / 6), 4);
        default:
          return false;
      }
    },
    nextScalingUpgrade() {
      const effarigAlchemyResource = AlchemyResources.all.filter(res => res.unlockedAt === this.level + 1)[0];
      switch (this.pet.id) {
        case "teresa":
          return "可额外充能 1 个无限升级";
        case "effarig":
          return `在符文炼金中解锁“${effarigAlchemyResource.name}”资源，效果为：
          ${effarigAlchemyResource.description}`;
        case "enslaved":
          return `储存的游戏时间效果 ${formatX(20)}，并可额外储存 1 小时现实时间`;
        case "v":
          return "可额外购买 1 个三元研究";
        default:
          return "false";
      }
    },
    reward() {
      return (typeof this.nextUnlock.reward === "function") ? this.nextUnlock.reward() : this.nextUnlock.reward;
    }
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.memories = pet.memories;
      this.level = pet.level;
      this.requiredMemories = pet.requiredMemories;
      this.nextLevelEstimate = Ra.timeToGoalString(this.pet, this.requiredMemories - this.memories);
    },
    isImportant(level) {
      return this.importantLevels.includes(level);
    },
  },
};
</script>

<template>
  <div class="l-ra-bar-container">
    <div class="c-ra-exp-bar">
      <div
        class="c-ra-exp-bar-inner"
        :style="barStyle"
      />
    </div>
    <div
      :class="classObject"
      @click="pet.levelUp()"
    >
      <span class="fas fa-arrow-up" />
      <div class="c-ra-pet-upgrade__tooltip">
        <div class="c-ra-pet-upgrade__tooltip__name">
          将 {{ pet.name }} 提升到 {{ formatInt(level + 1) }} 级
        </div>
        <div class="c-ra-pet-upgrade__tooltip__description">
          {{ reward }}
          <div
            v-if="showNextScalingUpgrade"
            :style="{ 'margin-top': nextUnlock.reward ? '0.6rem' : '0' }"
          >
            {{ nextScalingUpgrade }}
          </div>
        </div>
        <div class="c-ra-pet-upgrade__tooltip__footer">
          花费：{{ format(requiredMemories, 2, 2) }} 点记忆
          <span v-if="memories <= requiredMemories">{{ nextLevelEstimate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
