<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SpeedrunModeModal",
  components: {
    PrimaryButton,
    ModalWrapperChoice,
  },
  data() {
    return {
      onInfoPage: true,
      name: "",
      confirmPhrase: "",
    };
  },
  computed: {
    willStartRun() {
      return this.confirmPhrase === "Gotta Go Fast!";
    },
  },
  methods: {
    nextPage() {
      this.onInfoPage = false;
    },
    startRun() {
      if (!this.willStartRun) return;
      this.emitClose();
      Speedrun.prepareSave(Speedrun.generateName(this.name));
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!onInfoPage && !willStartRun"
    :show-confirm="!onInfoPage && willStartRun"
    confirm-class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
    @confirm="startRun"
  >
    <template #header>
      进入速通模式
    </template>
    <div
      v-if="onInfoPage"
      class="c-modal-message__text"
    >
      这会创建一个带额外统计追踪的存档，用来记录你到达游戏关键节点的时间。
      这些记录会显示在屏幕右下角，并保存在“统计”里的专用子标签页中。
      <br>
      <br>
      几乎所有动画和确认弹窗都会默认关闭，但你仍可以在达到对应进度前调整这些设置。
      开始速通后，游戏会在你的反物质量发生变化前保持暂停，方便你先配置好所有选项。
      为了避免优化开局前等待太久，游戏会免费给予少量成就。
      <br>
      <br>
      <i>
        速通模式不会提供额外游戏内容。
      </i>
      <br>
      <br>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
        @click="nextPage"
      >
        继续
      </PrimaryButton>
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      你可以在下方输入速通存档名称。名称不会影响游戏机制，只用于标识这个存档属于你。
      如果不输入名称，游戏会随机生成一个。只要计时器尚未开始，你都可以点击速通信息框里的名称进行修改。
      <input
        ref="name"
        v-model="name"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="emitClose"
      >
      <br>
      <br>
      速通存档可以像普通存档一样导入和导出。导入速通存档会把它标记为分段速通，
      因为导入/导出允许你单独优化某些游戏阶段。没有导入记录的存档会保持为单段速通。
      <br>
      <br>
      如果需要，你也可以在开始前到“选项”里修改符文随机种子。
      <br>
      <br>
      <div class="c-modal-hard-reset-danger">
        开始速通会把当前存档重置回游戏开局。完整通关统计、视觉设置、自动机脚本和符文外观等内容会保留，
        其余部分会变成刚通关并在制作人员名单界面选择重新开始后的状态。请在下方输入
        "Gotta Go Fast!" 来确认并开始或重新开始本次速通。
      </div>
      <input
        ref="confirmPhrase"
        v-model="confirmPhrase"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="emitClose"
      >
    </div>
    <template #confirm>
      开始速通！
    </template>
    <template #cancel>
      取消
    </template>
  </ModalWrapperChoice>
</template>
