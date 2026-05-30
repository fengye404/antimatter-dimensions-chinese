<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitChallengeModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    challengeName: {
      type: String,
      required: true,
    },
    normalName: {
      type: String,
      required: true,
    },
    hasHigherLayers: {
      type: Boolean,
      required: true,
    },
    exitFn: {
      type: Function,
      required: true,
    }
  },
  computed: {
    isCelestial() {
      return this.challengeName.match("Reality");
    },
    isRestarting() {
      return this.isCelestial ? player.options.retryCelestial : player.options.retryChallenge;
    }
  },
  methods: {
    handleYesClick() {
      this.exitFn();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="exitChallenge"
    @confirm="handleYesClick"
  >
    <template #header>
      即将{{ isRestarting ? "重新开始" : "退出" }}{{ challengeName }}
    </template>

    <div class="c-modal-message__text">
      <span v-if="isRestarting">
        确认后会立即重新进入{{ challengeName }}。
      </span>
      <span v-else>
        这会让你回到没有限制的普通{{ normalName }}。
      </span>
      <span v-if="hasHigherLayers">
        来自更高层级限制的其他效果仍会继续生效。
      </span>
    </div>
    <template #confirm-text>
      {{ isRestarting ? "重新开始" : "退出" }}
    </template>
  </ModalWrapperChoice>
</template>
