<script>
import GameSpeedDisplay from "@/components/GameSpeedDisplay";

export default {
  name: "HeaderTickspeedInfo",
  components: {
    GameSpeedDisplay
  },
  data() {
    return {
      mult: new Decimal(0),
      tickspeed: new Decimal(0),
      galaxyCount: 0,
      purchasedTickspeed: 0,
      freeTickspeed: 0,
    };
  },
  computed: {
    tickspeedDisplay() {
      return `维度生产频率：${format(this.tickspeed, 2, 3)} 次/秒`;
    },
    perUpgrade() {
      if (InfinityChallenge(3).isRunning) return `每次时间间隔升级使所有反物质维度倍率乘以
        ${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)}`;
      return `每次时间间隔升级使反物质维度生产速度提高 ${formatX(this.mult.reciprocal(), 2, 3)}`;
    },
  },
  methods: {
    update() {
      this.mult.copyFrom(Tickspeed.multiplier);
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.galaxyCount = player.galaxies;
      this.purchasedTickspeed = player.totalTickBought;
      this.freeTickspeed = FreeTickspeed.amount;
    },
  },
};
</script>

<template>
  <div>
    <br>
    {{ perUpgrade }}
    <br>
    {{ tickspeedDisplay }}
    <br>
    <GameSpeedDisplay />
  </div>
</template>

<style scoped>

</style>
