<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "EternityModal",
  components: {
    ResetModal
  },
  data() {
    return {
      exitingEC: false,
      startingIP: new Decimal(),
      gainedEternityPoints: new Decimal(),
      gainedEternities: new Decimal()
    };
  },
  computed: {
    message() {
      return PlayerProgress.eternityUnlocked()
        ? `永恒会重置除成就、挑战记录，以及“统计”页签中“通用”栏目之外的几乎所有内容。`
        : `永恒会重置除成就、挑战记录，以及“统计”页签中“通用”栏目之外的几乎所有内容。
          你还会获得永恒点数，并解锁多种新升级。`;
    },
    gainedEPOnEternity() {
      return `本次永恒将获得 ${format(this.gainedEternities, 2)} 次永恒和
      ${format(this.gainedEternityPoints, 2)} EP。`;
    },
    startWithIP() {
      return this.startingIP.gt(0)
        ? `下一轮永恒开始时，你会拥有 ${format(this.startingIP, 2)} IP。`
        : ``;
    },
    eternityChallenge() {
      const ec = EternityChallenge.current;
      if (ec.isFullyCompleted) {
        return `永恒挑战 ${ec.id} 已经全部完成。`;
      }
      if (!Perk.studyECBulk.isBought) {
        return `你将获得永恒挑战 ${ec.id} 的 1 次完成。`;
      }
      const gainedCompletions = ec.gainedCompletionStatus.gainedCompletions;
      return `你将获得永恒挑战 ${ec.id} 的 ${formatInt(gainedCompletions)} 次完成。`;
    }
  },
  methods: {
    update() {
      this.exitingEC = EternityChallenge.isRunning;
      this.startingIP = Currency.infinityPoints.startingValue;
      this.gainedEternityPoints = gainedEternityPoints();
      this.gainedEternities = gainedEternities();
    },
    handleYesClick() {
      animateAndEternity();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ResetModal
    :header="exitingEC ? '完成永恒挑战' : '即将进入永恒'"
    :message="message"
    :gained-resources="gainedEPOnEternity"
    :starting-resources="startWithIP"
    :confirm-fn="handleYesClick"
    :alternate-condition="exitingEC"
    :alternate-text="exitingEC ? eternityChallenge : undefined"
    confirm-option="eternity"
  />
</template>
