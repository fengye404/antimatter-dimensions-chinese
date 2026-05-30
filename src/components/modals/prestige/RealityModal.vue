<script>
import GlyphComponent from "@/components/GlyphComponent";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "RealityModal",
  components: {
    PrimaryButton,
    ModalWrapperChoice,
    GlyphComponent,
  },
  data() {
    return {
      firstReality: false,
      hasSpace: true,
      hasChoice: false,
      hasFilter: false,
      glyphs: [],
      bestLevel: 0,
      levelDifference: 0,
      selectedGlyph: undefined,
      canRefresh: false,
      level: 0,
      simRealities: 0,
      realityMachines: new Decimal(),
      shardsGained: 0,
      effarigUnlocked: false,
      willAutoPurge: false,
    };
  },
  computed: {
    firstRealityText() {
      return `现实会重置除挑战记录，以及“统计”页签中“通用”栏目之外的几乎所有内容。
        前 ${formatInt(13)} 行成就也会被重置，但之后每隔 ${timeDisplayNoDecimals(30 * 60000)}
        会自动恢复 1 个成就。你会根据永恒点数获得现实机器，并获得一个等级由永恒点数、复制品和膨胀时间决定的 Glyph；
        同时还会获得用于解锁便利性能力的 Perk 点数，并开启多种现实升级。`;
    },
    canSacrifice() {
      return RealityUpgrade(19).isEffectActive;
    },
    warnText() {
      if (!this.hasChoice) {
        return `你目前每次现实只能获得一个新 Glyph。取消本弹窗并购买 START Perk 后，
          就能在多个 Glyph 中进行选择。`;
      }

      if (this.hasFilter && this.selectedGlyph === undefined) {
        return `如果你不手动选择 Glyph，游戏会按当前 Glyph 过滤器自动选择。`;
      }
      return this.selectedGlyph === undefined
        ? `请选择一个 Glyph 后继续。`
        : null;
    },
    gained() {
      const gainedResources = [];
      gainedResources.push(`${formatInt(this.simRealities)} 次现实`);
      gainedResources.push(`${formatInt(this.simRealities)} 个 Perk 点数`);
      gainedResources.push(`${format(this.realityMachines, 2)} 个现实机器`);
      if (this.effarigUnlocked) {
        gainedResources.push(`${format(this.shardsGained, 2)} 个遗物碎片`);
      }
      return `你将获得${gainedResources.join("、")}。`;
    },
    levelStats() {
      // Bit annoying to read due to needing >, <, and =, with = needing a different format.
      if (this.level === this.bestLevel) {
        return `本次现实将获得等级 ${formatInt(this.level)} 的 Glyph，与历史最佳等级相同。`;
      }
      return `本次现实将获得等级 ${formatInt(this.level)} 的 Glyph，比历史最佳等级
        ${this.level > this.bestLevel ? "高" : "低"} ${formatInt(this.levelDifference)} 级。`;
    },
    confirmationToDisable() {
      return ConfirmationTypes.glyphSelection.isUnlocked() ? "glyphSelection" : undefined;
    },
    canConfirm() {
      return this.firstReality || this.selectedGlyph !== undefined || this.hasFilter;
    }
  },
  created() {
    this.getGlyphs();
    GlyphSelection.realityProps = getRealityProps(false, false);
  },
  methods: {
    update() {
      this.firstReality = player.realities === 0;
      this.hasChoice = Perk.firstPerk.isEffectActive;
      this.effarigUnlocked = TeresaUnlocks.effarig.canBeApplied;
      this.hasFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.level = gainedGlyphLevel().actualLevel;
      this.simRealities = 1 + simulatedRealityCount(false);
      this.hasSpace = GameCache.glyphInventorySpace.value >= this.simRealities;
      const simRMGained = MachineHandler.gainedRealityMachines.times(this.simRealities);
      this.realityMachines.copyFrom(simRMGained.clampMax(MachineHandler.distanceToRMCap));
      this.shardsGained = Effarig.shardsGained * (simulatedRealityCount(false) + 1);
      this.willAutoPurge = player.reality.autoAutoClean;
      if (this.firstReality) return;
      for (let i = 0; i < this.glyphs.length; ++i) {
        const currentGlyph = this.glyphs[i];
        const newGlyph = GlyphSelection.glyphList(
          GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false }
        )[i];
        if (currentGlyph.level === newGlyph.level) continue;
        currentGlyph.level = newGlyph.level;
        currentGlyph.effects = newGlyph.effects;
      }
      this.bestLevel = player.records.bestReality.glyphLevel;
      this.levelDifference = Math.abs(this.bestLevel - this.level);
    },
    glyphClass(index) {
      return {
        "l-modal-glyph-selection__glyph": true,
        "l-modal-glyph-selection__glyph--selected": this.selectedGlyph === index,
      };
    },
    getGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.upcomingGlyphs;
    },
    select(index) {
      this.selectedGlyph = index;
    },
    confirmModal(sacrifice) {
      if (!this.canConfirm) return;
      if (sacrifice) {
        // Sac isn't passed through confirm so we have to close it manually
        this.emitClose();
      }
      startManualReality(sacrifice, this.selectedGlyph);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :option="confirmationToDisable"
    :show-confirm="canConfirm"
    @confirm="confirmModal(false)"
  >
    <template #header>
      即将进入现实
    </template>
    <div
      v-if="firstReality"
      class="c-modal-message__text"
    >
      {{ firstRealityText }}
    </div>

    <div class="c-modal-message__text">
      {{ gained }}
    </div>
    <div
      v-if="!firstReality"
      class="l-glyph-selection__row"
    >
      <GlyphComponent
        v-for="(glyph, index) in glyphs"
        :key="index"
        :class="glyphClass(index)"
        :glyph="glyph"
        :is-in-modal="true"
        :ignore-modified-level="true"
        :show-sacrifice="canSacrifice"
        @click.native="select(index)"
      />
    </div>
    <div v-if="!firstReality">
      {{ levelStats }}
      <br>
      <b class="o-warning">
        {{ warnText }}
      </b>
    </div>
    <div v-if="simRealities > 1">
      <br>
      选择这个 Glyph 后，游戏会继续模拟剩余的现实，
      <br>
      并根据 Glyph 过滤器自动选择另外 {{ formatInt(simRealities - 1) }} 个 Glyph。
    </div>
    <div v-if="willAutoPurge">
      <br>
      当前已启用自动清理；你选择的 Glyph
      <br>
      触发后可能不会出现在库存中。
    </div>
    <div
      v-if="!hasSpace"
      class="o-warning"
    >
      <span v-if="simRealities > 1">
        模拟现实的次数超过了库存空位数量；部分 Glyph 可能会被献祭。
      </span>
      <span v-else>
        你的库存已经没有空位，所选 Glyph 将被自动{{ canSacrifice ? "献祭" : "删除" }}！
      </span>
    </div>
    <div v-if="confirmationToDisable">
      <br>
      即使已禁用确认弹窗，也可以按住 Shift 点击“现实”按钮强制显示它。
    </div>
    <template
      v-if="canSacrifice && canConfirm"
      #extra-buttons
    >
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="confirmModal(true)"
      >
        献祭
      </PrimaryButton>
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.o-warning {
  color: var(--color-infinity);
}
</style>
