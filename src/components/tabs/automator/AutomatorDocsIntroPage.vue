<script>
export default {
  name: "AutomatorDocsIntroPage",
};
</script>

<template>
  <div>
    欢迎使用反物质维度自动机！
    <br>
    <br>
    这里是自动机的快速概览。它可以按照脚本替你执行游戏操作，适合后期重复流程。
    更细的功能说明可以在“游戏玩法”或对应页面里查看。
    <br>
    <br>
    <b>脚本语言：</b>自动机使用专门的脚本语言执行游戏操作。点击
    <div class="fas fa-list c-automator-button-icon" /> 可以查看可用命令；也可以在
    <div class="fas fa-book c-automator-button-icon" /> 页面定义常量，给常用数值取短名字。
    <br>
    <br>
    <b>布局：</b>左侧是脚本和运行控制，右侧是自动机说明。点击右上角
    <div class="fas fa-expand-arrows-alt c-automator-button-icon" /> 可以展开为全屏编辑。
    <br>
    <br>
    <b>编辑模式：</b>自动机有积木编辑器（默认）和文本编辑器。可用左侧右上角开关切换。
    注意：带错误的脚本可能无法在两种模式间正确转换，严重时会丢失部分内容。
    <br>
    <br>
    <b>脚本管理：</b>第二行下拉菜单可切换或新建脚本。当前脚本可用
    <div class="fas fa-edit c-automator-button-icon" /> 重命名，或用
    <div class="fas fa-trash c-automator-button-icon" /> 删除。自动机至少会保留一个脚本。
    <br>
    <br>
    <b>编写脚本：</b>积木编辑器通过
    <div class="fas fa-cubes c-automator-button-icon" /> 添加积木；文本编辑器则直接在左侧输入。
    也可以用模板生成器 <div class="fas fa-file-code c-automator-button-icon" /> 快速生成常用脚本。
    <div class="fas fa-arrow-rotate-left c-automator-button-icon" /> 和
    <div class="fas fa-arrow-rotate-right c-automator-button-icon" /> 可撤销/重做有限次数的编辑。
    <br>
    <br>
    <b>调试：</b>脚本无法运行时看错误日志
    <div class="fas fa-exclamation-triangle c-automator-button-icon" />；脚本能跑但结果不对时看事件日志
    <div class="fas fa-eye c-automator-button-icon" />。
    <br>
    <br>
    <b>导入/导出：</b>可用
    <div class="fas fa-file-export c-automator-button-icon" /> 和
    <div class="fas fa-file-import c-automator-button-icon" /> 以文本形式导出或导入脚本，也可以打开
    <div class="fas fa-window-restore c-automator-button-icon" /> 使用扩展导出选项。
    <br>
    <br>
    <b>脚本保存：</b>脚本改动并非在所有情况下都会立即写入本地；详情见自动机玩法说明。
    为避免卡顿，自动机还限制单个脚本和全部脚本的字符数，上方会显示当前用量。
  </div>
</template>

<style scoped>
.c-automator-button-icon {
  padding: 0.3rem 0.8rem;
  width: 3.3rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-automator-controls-border);
  border-radius: var(--var-border-radius, 0.3rem);
  color: var(--color-automator-docs-font);
  background-color: var(--color-automator-controls-inactive);
}
</style>
