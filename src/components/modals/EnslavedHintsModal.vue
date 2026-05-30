<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "EnslavedHintsModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      currentStored: 0,
      nextHintCost: 0,
      canGetHint: false,
      shownEntries: [],
      realityHintsLeft: 0,
      glyphHintsLeft: 0,
      hints: 0,
    };
  },
  computed: {
    hintCost() {
      return `${format(TimeSpan.fromMilliseconds(this.nextHintCost).totalYears, 2)} 年`;
    },
    formattedStored() {
      return `${format(TimeSpan.fromMilliseconds(this.currentStored).totalYears, 2)} 年`;
    },
    hasProgress(id) {
      return this.progressEntries.some(entry => entry.id === id);
    },
    // Note: This calculation seems to behave extremely poorly if the goal has been raised more than 12 hints worth
    // of cost bumps and I'm not entirely sure why. There's probably a numerical issue I can't quite figure out, but
    // considering that much cost raising can't happen in practice I think I'm just going to leave it be.
    timeEstimate() {
      if (this.currentStored >= this.nextHintCost) return "";

      // Relevant values are stored as milliseconds, so multiply the rate by 1000 to get to seconds
      const storeRate = 1000 * (Enslaved.isStoringGameTime
        ? Enslaved.currentBlackHoleStoreAmountPerMs
        : getGameSpeedupFactor());
      const alreadyWaited = this.currentStored / storeRate;
      const decaylessTime = this.nextHintCost / storeRate;

      // Check if decay is irrelevant and don't do the hard calculations if so
      const minCostEstimate = (TimeSpan.fromYears(1e40).totalMilliseconds - this.currentStored) / storeRate;
      if (TimeSpan.fromSeconds(minCostEstimate).totalDays > this.hints) {
        return `${TimeSpan.fromSeconds(minCostEstimate).toStringShort(true)}`;
      }

      // Decay is 3x per day, but the math needs decay per second
      const K = Math.pow(3, 1 / 86400);
      const x = decaylessTime * Math.log(K) * Math.pow(K, alreadyWaited);
      const timeToGoal = productLog(x) / Math.log(K) - alreadyWaited;
      return `${TimeSpan.fromSeconds(timeToGoal).toStringShort(true)}`;
    }
  },
  methods: {
    update() {
      this.currentStored = player.celestials.enslaved.stored;
      this.nextHintCost = Enslaved.nextHintCost;
      this.canGetHint = this.currentStored >= this.nextHintCost;
      this.shownEntries = [];

      this.realityHintsLeft = EnslavedProgress.all.length;
      for (const prog of EnslavedProgress.all) {
        if (prog.hasHint) {
          this.shownEntries.push([false, prog]);
          this.realityHintsLeft--;
        }
      }

      const glyphHintCount = player.celestials.enslaved.glyphHintsGiven;
      for (let hintNum = 0; hintNum < glyphHintCount; hintNum++) {
        this.shownEntries.push([true, GameDatabase.celestials.enslaved.glyphHints[hintNum]]);
      }
      this.glyphHintsLeft = GameDatabase.celestials.enslaved.glyphHints.length - glyphHintCount;

      this.hints = Enslaved.hintCostIncreases;
    },
    giveRealityHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      EnslavedProgress.all.filter(prog => !prog.hasHint).randomElement().unlock();
    },
    giveGlyphHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      player.celestials.enslaved.glyphHintsGiven++;
    }
  },

};
</script>

<template>
  <ModalWrapper>
    <template #header>
      无名氏现实中的裂痕
    </template>
    <div class="c-enslaved-hint-modal c-modal--short">
      <div>
        这个现实似乎在抗拒你完成它。目前你已经做到：
      </div>
      <br>
      <div
        v-for="(entry, index) in shownEntries"
        :key="index"
      >
        <div v-if="!entry[0]">
          <span v-if="entry[1].hasHint && !entry[1].hasProgress">
            <i class="c-icon-wrapper fas fa-question-circle" />
            <b>你还没有弄明白这条提示的含义。</b>
          </span>
          <span v-else>
            <i class="c-icon-wrapper fa-solid fa-house-crack" />
            <b>你已经撬开了现实中的一道裂痕：</b>
          </span>
          <br>
          - {{ entry[1].hintInfo }}
          <br>
          - {{ entry[1].hasProgress ? entry[1].completedInfo : "?????" }}
        </div>
        <div v-else>
          <i class="fa-solid fa-shapes" /> <b>Glyph 提示：</b>
          <br>
          {{ entry[1] }}
        </div>
        <br>
      </div>
      <div v-if="realityHintsLeft + glyphHintsLeft > 0">
        你可以花费已储存时间继续寻找现实中的裂痕。不过每购买一条提示，下一条提示所需的已储存时间都会变为
        {{ formatInt(3) }} 倍。这个涨价会在 {{ formatInt(24) }} 小时内逐渐消退；如果你弄明白了提示的含义，
        费用会立刻除以 {{ formatInt(2) }}。提示费用不会低于 {{ format(1e40) }} 年。
        <br><br>
        下一条提示需要 {{ hintCost }} 已储存时间。你当前拥有 {{ formattedStored }}。
        <span v-if="currentStored < nextHintCost">
          继续给黑洞充能 {{ timeEstimate }} 后即可达到。
        </span>
        <br><br>
        <PrimaryButton
          :enabled="realityHintsLeft > 0 && canGetHint"
          class="l-enslaved-hint-button"
          @click="giveRealityHint(realityHintsLeft)"
        >
          获取一条关于现实本身的提示（剩余 {{ formatInt(realityHintsLeft) }} 条）
        </PrimaryButton>
        <br>
        <PrimaryButton
          :enabled="glyphHintsLeft > 0 && canGetHint"
          class="l-enslaved-hint-button"
          @click="giveGlyphHint(glyphHintsLeft)"
        >
          获取一条 Glyph 搭配提示（剩余 {{ formatInt(glyphHintsLeft) }} 条）
        </PrimaryButton>
      </div>
      <div v-else>
        <b>已经没有更多提示了！</b>
      </div>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.c-icon-wrapper {
  margin-right: 1rem;
}

.l-enslaved-hint-button {
  margin: 0.4rem 0;
}
</style>
