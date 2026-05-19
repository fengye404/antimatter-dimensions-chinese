<script>
import { MatterScale } from "./matter-scale";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "StatisticsTab",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realTimeDoomed: TimeSpan.zero,
      totalAntimatter: new Decimal(0),
      realTimePlayed: TimeSpan.zero,
      timeSinceCreation: 0,
      uniqueNews: 0,
      totalNews: 0,
      secretAchievementCount: 0,
      infinity: {
        isUnlocked: false,
        count: new Decimal(0),
        banked: new Decimal(0),
        projectedBanked: new Decimal(0),
        bankRate: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      eternity: {
        isUnlocked: false,
        count: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      reality: {
        isUnlocked: false,
        count: 0,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(0),
        bestRarity: 0,
      },
      matterScale: [],
      lastMatterTime: 0,
      paperclips: 0,
      fullTimePlayed: 0,
    };
  },
  computed: {
    // These are here to avoid extra spaces in-game pre-reality and to get around codefactor 120-char limits in the
    // HTML template due to the fact that adding a linebreak also adds a space
    infinityCountString() {
      const num = this.infinity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} 次无限`
        : "0 次无限";
    },
    eternityCountString() {
      const num = this.eternity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} 次永恒`
        : "0 次永恒";
    },
    fullGameCompletions() {
      return player.records.fullGameCompletions;
    },
    startDate() {
      return new Date(player.records.gameCreatedTime).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    },
    saveAge() {
      return TimeSpan.fromMilliseconds(this.timeSinceCreation);
    },
  },
  methods: {
    update() {
      const records = player.records;
      this.totalAntimatter.copyFrom(records.totalAntimatter);
      this.realTimePlayed.setFrom(records.realTimePlayed);
      this.fullTimePlayed = TimeSpan.fromMilliseconds(records.previousRunRealTime + records.realTimePlayed);
      this.uniqueNews = NewsHandler.uniqueTickersSeen;
      this.totalNews = player.news.totalSeen;
      this.secretAchievementCount = SecretAchievements.all.filter(a => a.isUnlocked).length;
      this.timeSinceCreation = Date.now() - player.records.gameCreatedTime;

      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked;
      const infinity = this.infinity;
      const bestInfinity = records.bestInfinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(Currency.infinities);
        infinity.banked.copyFrom(Currency.infinitiesBanked);
        infinity.projectedBanked = new Decimal(0).plusEffectsOf(
          Achievement(131).effects.bankedInfinitiesGain,
          TimeStudy(191)
        );
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.time)).times(60000);
        infinity.hasBest = bestInfinity.time < 999999999999;
        infinity.best.setFrom(bestInfinity.time);
        infinity.this.setFrom(records.thisInfinity.time);
        infinity.bestRate.copyFrom(bestInfinity.bestIPminEternity);
      }

      const isEternityUnlocked = progress.isEternityUnlocked;
      const eternity = this.eternity;
      const bestEternity = records.bestEternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(Currency.eternities);
        eternity.hasBest = bestEternity.time < 999999999999;
        eternity.best.setFrom(bestEternity.time);
        eternity.this.setFrom(records.thisEternity.time);
        eternity.bestRate.copyFrom(bestEternity.bestEPminReality);
      }

      const isRealityUnlocked = progress.isRealityUnlocked;
      const reality = this.reality;
      const bestReality = records.bestReality;
      reality.isUnlocked = isRealityUnlocked;

      if (isRealityUnlocked) {
        reality.count = Math.floor(Currency.realities.value);
        reality.best.setFrom(bestReality.time);
        reality.bestReal.setFrom(bestReality.realTime);
        reality.this.setFrom(records.thisReality.time);
        reality.totalTimePlayed.setFrom(records.totalTimePlayed);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(records.thisInfinity.realTime);
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.realTime)).times(60000);
        eternity.thisReal.setFrom(records.thisEternity.realTime);
        reality.thisReal.setFrom(records.thisReality.realTime);
        reality.bestRate.copyFrom(bestReality.RMmin);
        reality.bestRarity = Math.max(strengthToRarity(bestReality.glyphStrength), 0);
      }
      this.updateMatterScale();

      this.isDoomed = Pelle.isDoomed;
      this.realTimeDoomed.setFrom(player.records.realTimeDoomed);
      this.paperclips = player.news.specialTickerData.paperclips;
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? format(value, 3) : formatInt(Math.floor(value.toNumber()));
    },
    // Only updates once per second to reduce jitter
    updateMatterScale() {
      if (Date.now() - this.lastMatterTime > 1000) {
        this.matterScale = MatterScale.estimate(Currency.antimatter.value);
        this.lastMatterTime = Date.now();
      }
    },
    realityClassObject() {
      return {
        "c-stats-tab-title": true,
        "c-stats-tab-reality": !this.isDoomed,
        "c-stats-tab-doomed": this.isDoomed,
      };
    }
  },
};
</script>

<template>
  <div class="c-stats-tab">
    <div>
      <PrimaryButton onclick="Modal.catchup.show(0)">
        查看内容概要
      </PrimaryButton>
      <div class="c-stats-tab-title c-stats-tab-general">
        总览
      </div>
      <div class="c-stats-tab-general">
        <div>你总共产出了 {{ format(totalAntimatter, 2, 1) }} 反物质。</div>
        <div>你已游玩 {{ realTimePlayed }}。（真实时间）</div>
        <div v-if="reality.isUnlocked">
          你的存在已经跨越了 {{ reality.totalTimePlayed }}。（游戏时间）
        </div>
        <div>
          你的存档创建于 {{ startDate }}（{{ saveAge }} 前）
        </div>
        <br>
        <div>
          你总共看过 {{ formatInt(totalNews) }} 条新闻。
        </div>
        <div>
          你看过 {{ formatInt(uniqueNews) }} 条不重复新闻。
        </div>
        <div>
          你已解锁 {{ formatInt(secretAchievementCount) }} 个秘密成就。
        </div>
        <div v-if="paperclips">
          你拥有 {{ formatInt(paperclips) }} 个没用的回形针。
        </div>
        <div v-if="fullGameCompletions">
          <br>
          <b>
            你已完整通关 {{ formatInt(fullGameCompletions) }} 次。
            <br>
            所有周目合计游玩时间为 {{ fullTimePlayed }}。
          </b>
        </div>
      </div>
      <div>
        <br>
        <div class="c-matter-scale-container c-stats-tab-general">
          <div
            v-for="(line, i) in matterScale"
            :key="i"
          >
            {{ line }}
          </div>
          <br v-if="matterScale.length < 2">
          <br v-if="matterScale.length < 3">
        </div>
      </div>
      <br>
    </div>
    <div
      v-if="infinity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-infinity">
        无限
      </div>
      <div>
        你有 {{ infinityCountString }}<span v-if="eternity.isUnlocked">，计入本次永恒</span>。
      </div>
      <div v-if="infinity.banked.gt(0)">
        你拥有 {{ formatDecimalAmount(infinity.banked.floor()) }} 个储备无限。
      </div>
      <div v-if="infinity.hasBest">
        你最快的一次无限用时 {{ infinity.best.toStringShort() }}。
      </div>
      <div v-else>
        你还没有最快无限记录<span v-if="eternity.isUnlocked">（本次永恒）</span>。
      </div>
      <div>
        你已在本次无限中花费 {{ infinity.this.toStringShort() }}。
        <span v-if="reality.isUnlocked">
          （{{ infinity.thisReal.toStringShort() }} 真实时间）
        </span>
      </div>
      <div>
        你<span v-if="eternity.count.gt(0)">本次永恒中</span>最高每分钟无限点数为
        {{ format(infinity.bestRate, 2, 2) }}。
      </div>
      <br>
    </div>
    <div
      v-if="eternity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-eternity">
        永恒
      </div>
      <div>
        你有 {{ eternityCountString }}<span v-if="reality.isUnlocked">，计入本次现实</span>。
      </div>
      <div v-if="infinity.projectedBanked.gt(0)">
        永恒时你会获得 {{ formatDecimalAmount(infinity.projectedBanked.floor()) }} 个储备无限
        （每分钟 {{ formatDecimalAmount(infinity.bankRate) }} 个）。
      </div>
      <div v-else-if="infinity.banked.gt(0)">
        永恒时你不会获得储备无限。
      </div>
      <div v-if="eternity.hasBest">
        你最快的一次永恒用时 {{ eternity.best.toStringShort() }}。
      </div>
      <div v-else>
        你还没有最快永恒记录<span v-if="reality.isUnlocked">（本次现实）</span>。
      </div>
      <div>
        你已在本次永恒中花费 {{ eternity.this.toStringShort() }}。
        <span v-if="reality.isUnlocked">
          （{{ eternity.thisReal.toStringShort() }} 真实时间）
        </span>
      </div>
      <div>
        你<span v-if="reality.isUnlocked">本次现实中</span>最高每分钟永恒点数为
        {{ format(eternity.bestRate, 2, 2) }}。
      </div>
      <br>
    </div>
    <div
      v-if="reality.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div :class="realityClassObject()">
        {{ isDoomed ? "毁灭现实" : "现实" }}
      </div>
      <div>你有 {{ formatInt(reality.count) }} 次现实。</div>
      <div>你最快的一次游戏时间现实用时 {{ reality.best.toStringShort() }}。</div>
      <div>你最快的一次真实时间现实用时 {{ reality.bestReal.toStringShort() }}。</div>
      <div :class="{ 'c-stats-tab-doomed' : isDoomed }">
        你已在本次{{ isDoomed ? "末日" : "现实" }}中花费 {{ reality.this.toStringShort() }}。
        （{{ reality.thisReal.toStringShort() }} 真实时间）
      </div>
      <div
        v-if="isDoomed"
        class="c-stats-tab-doomed"
      >
        你已经毁灭了 {{ realTimeDoomed.toStringShort() }}（真实时间）。
      </div>
      <div>
        你最高每分钟现实机器为 {{ format(reality.bestRate, 2, 2) }}。
      </div>
      <div>你获得过的最佳符文稀有度为 {{ formatRarity(reality.bestRarity) }}。</div>
      <br>
    </div>
  </div>
</template>

<style scoped>
.c-matter-scale-container {
  height: 5rem;
}

.c-stats-tab-general {
  color: var(--color-text);
}

.c-stats-tab-title {
  font-size: 2rem;
  font-weight: bold;
}

.c-stats-tab-subheader {
  height: 15rem;
}

.c-stats-tab-infinity {
  color: var(--color-infinity);
}

.c-stats-tab-eternity {
  color: var(--color-eternity);
}

.c-stats-tab-reality {
  color: var(--color-reality);
}

.c-stats-tab-doomed {
  color: var(--color-pelle--base);
}
</style>
