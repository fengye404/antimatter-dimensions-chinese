<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ChangeNameModal",
  components: {
    ModalWrapperChoice,
  },
  data() {
    return {
      input: "",
      actualName: ""
    };
  },
  created() {
    this.input = player.speedrun.name;
    this.actualName = Speedrun.generateName(this.input);
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    updateName() {
      this.actualName = Speedrun.generateName(this.input);
    },
    confirmChange() {
      player.speedrun.name = this.actualName;
      this.emitClose();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="confirmChange">
    <template #header>
      修改速通玩家名称
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup="updateName"
      @keyup.enter="confirmChange"
      @keyup.esc="emitClose"
    >
    <i>
      计时器开始后将不能再修改名称，最多 {{ formatInt(40) }} 个字符。
    </i>
    <div>
      新名称将显示为 {{ actualName }}
    </div>
    <template #confirm-text>
      修改名称
    </template>
  </ModalWrapperChoice>
</template>
