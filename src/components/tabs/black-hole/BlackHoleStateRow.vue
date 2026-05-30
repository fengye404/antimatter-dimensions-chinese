<script>
export default {
  name: "BlackHoleStateRow",
  props: {
    blackHole: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isPermanent: false,
      isActive: false,
      isCharged: false,
      nextChange: "",
      state: "",
    };
  },
  computed: {
    description() {
      return this.blackHole.description(true);
    },
    id() {
      return this.blackHole.id;
    }
  },
  methods: {
    update() {
      const { blackHole } = this;
      this.isUnlocked = blackHole.isUnlocked;
      if (!this.isUnlocked) return;
      this.isPermanent = blackHole.isPermanent;
      this.isActive = blackHole.isActive;
      this.isCharged = blackHole.isCharged;
      this.nextChange = TimeSpan.fromSeconds(blackHole.timeWithPreviousActiveToNextStateChange).toStringShort();
      this.state = blackHole.displayState;
    }
  }
};
</script>

<template>
  <h3 v-if="isUnlocked">
    {{ description }} 状态：
    <template v-if="isPermanent">
      永久激活
    </template>
    <template v-else-if="isActive">
      激活中（剩余 {{ nextChange }}）
    </template>
    <template v-else-if="id === 2 && isCharged">
      已充能（随黑洞 1 激活，剩余 {{ nextChange }}）
    </template>
    <template v-else>
      未激活（{{ nextChange }} 后激活）
    </template>
  </h3>
</template>

<style scoped>

</style>
