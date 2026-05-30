<script>
export default {
  name: "ChallengeRecordsList",
  props: {
    name: {
      type: String,
      required: true
    },
    start: {
      type: Number,
      required: true
    },
    times: {
      type: Array,
      required: true
    }
  },
  computed: {
    displayName() {
      return {
        "Normal Challenge": "普通挑战",
        "Infinity Challenge": "无限挑战",
      }[this.name] || this.name;
    },
    timeSum() {
      return this.times.sum();
    },
    completedAllChallenges() {
      return this.timeSum < Number.MAX_VALUE;
    }
  },
  methods: {
    timeDisplayShort,
    completionString(time) {
      return time < Number.MAX_VALUE
        ? `纪录用时：${timeDisplayShort(time)}`
        : "尚未完成";
    }
  }
};
</script>

<template>
  <div>
    <br>
    <div
      v-for="(time, i) in times"
      :key="i"
    >
      <span>{{ displayName }} {{ start + i }}：{{ completionString(time) }}</span>
    </div>
    <br>
    <div v-if="completedAllChallenges">
      {{ displayName }}总纪录用时：{{ timeDisplayShort(timeSum) }}
    </div>
    <div v-else>
      你还没有完成全部{{ displayName }}。
    </div>
  </div>
</template>
