<script>
import ConfirmationOptionsEntry from "@/components/modals/options/ConfirmationOptionsEntry";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "ConfirmationOptionsModal",
  components: {
    ModalWrapperOptions,
    ConfirmationOptionsEntry,
  },
  computed: {
    count() {
      return ConfirmationTypes.index.length;
    },
    noConfirmations() {
      return ConfirmationTypes.index.every(x => !x.isUnlocked());
    }
  }
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      确认选项
    </template>
    <div class="c-modal-options__button-container">
      <span v-if="noConfirmations">
        你当前没有任何需要确认的操作；以后解锁后会显示在这里。
      </span>
      <ConfirmationOptionsEntry
        v-for="entryNumber in count"
        :key="entryNumber"
        :index="entryNumber - 1"
      />
    </div>
  </ModalWrapperOptions>
</template>
