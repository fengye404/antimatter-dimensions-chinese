<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UpgradeMechanicLockModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    isImaginary: {
      type: Boolean,
      required: true,
    },
    specialLockText: {
      type: String,
      required: false,
      default: null,
    }
  },
  computed: {
    upgradeStr() {
      return this.isImaginary ? "虚幻升级" : "现实升级";
    },
    lockEvent() {
      return this.specialLockText ?? this.upgrade.lockEvent;
    }
  },
  methods: {
    disableLock() {
      this.upgrade.setMechanicLock(false);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="disableLock"
  >
    <template #header>
      {{ upgradeStr }}条件锁定
    </template>
    <div class="c-modal-message__text">
      确定要{{ lockEvent }}吗？如果现在执行，将导致你
      <span class="l-emphasis">
        不再满足{{ upgradeStr }}“{{ upgrade.name }}”的要求
      </span>
      <span :ach-tooltip="upgrade.requirement">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      <br>
      选择“取消”会关闭弹窗且不产生任何效果；选择“禁用锁定”会关闭该升级的要求检查，
      除非你重新开启，否则不会再次显示这条提醒。
      <br>
      <br>
      这两个选项都不会执行你刚才尝试的操作，因此之后需要再操作一次。
    </div>
    <template #confirm-text>
      禁用锁定
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-emphasis {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
