<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PerkPointLabel",
  components: {
    PrimaryButton
  },
  data() {
    return {
      pp: 0,
      treeLayout: 0,
      physicsEnabled: false,
      physicsOverride: false,
    };
  },
  computed: {
    layoutText() {
      return PerkLayouts[this.treeLayout].buttonText;
    },
    physicsText() {
      const enableStr = (this.physicsOverride ?? this.physicsEnabled) ? "开启" : "关闭";
      return `${enableStr}${this.physicsOverride === undefined ? "" : "（固定）"}`;
    }
  },
  created() {
    this.treeLayout = player.options.perkLayout;
    this.physicsOverride = PerkLayouts[this.treeLayout].forcePhysics;
  },
  methods: {
    update() {
      this.pp = Math.floor(Currency.perkPoints.value);
      this.physicsEnabled = player.options.perkPhysicsEnabled;
    },
    togglePhysics() {
      if (this.physicsOverride !== undefined) return;
      player.options.perkPhysicsEnabled = !player.options.perkPhysicsEnabled;
      PerkNetwork.setPhysics(player.options.perkPhysicsEnabled);
    },
    physicsClassObject() {
      return {
        "o-primary-btn c-button-physics": true,
        "o-primary-btn--disabled": this.physicsOverride !== undefined
      };
    },
    centerTree() {
      PerkNetwork.resetPosition(true);
    },
    straightenEdges() {
      PerkNetwork.setEdgeCurve(false);
      PerkNetwork.setEdgeCurve(true);
    },
    cycleLayout() {
      // Step forward once, but if this lands us on a locked layout, keep stepping until it doesn't
      let newIndex = (player.options.perkLayout + 1) % PerkLayouts.length;
      while (!(PerkLayouts[newIndex].isUnlocked?.() ?? true)) {
        newIndex = (newIndex + 1) % PerkLayouts.length;
      }

      player.options.perkLayout = newIndex;
      this.treeLayout = newIndex;
      this.physicsOverride = PerkLayouts[this.treeLayout].forcePhysics;
      PerkNetwork.currentLayout = PerkLayouts[this.treeLayout];
      PerkNetwork.setPhysics(player.options.perkPhysicsEnabled);
      PerkNetwork.moveToDefaultLayoutPositions(this.treeLayout);
    }
  }
};
</script>

<template>
  <div class="c-perk-tab__header">
    你有 <span class="c-perk-tab__perk-points">{{ format(pp, 2) }}</span> 特权点数。
    <br>
    特权选择是永久的，无法重置。
    <br>
    菱形特权还会提供自动机点数。
    <br>
    <div class="perk-settings">
      <PrimaryButton
        class="o-primary-btn c-button-perk-layout"
        @click="cycleLayout"
      >
        特权布局：{{ layoutText }}
      </PrimaryButton>
      <PrimaryButton
        :class="physicsClassObject()"
        @click="togglePhysics"
      >
        物理效果：{{ physicsText }}
      </PrimaryButton>
      <br>
      <PrimaryButton
        class="o-primary-btn"
        @click="centerTree"
      >
        视图回到起点
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn"
        @click="straightenEdges"
      >
        拉直连线
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.perk-settings > button {
  margin-right: 1rem;
}

.c-button-perk-layout {
  width: 30rem;
  margin-bottom: 1rem;
}

.c-button-physics {
  width: 27rem;
  margin-bottom: 1rem;
}
</style>
