<template>
  <div>
    <MyChart
      v-if="hasData"
      :chartLabels="chartLabels"
      :chartDataValues="chartDataValues"
      :chartCostValues="chartCostValues"
    />
    <div v-else></div>
  </div>
</template>

<script>
import MyChart from "/components/MyChart.vue";

export default {
  components: { MyChart },
  props: {
    chartLabels: {
      type: Array,
      required: true,
    },
    chartDataValues: {
      type: Array,
      required: true,
    },
    chartCostValues: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasData() {
      return (
        (this.chartLabels.length > 0 && this.chartDataValues.length) ||
        this.chartCostValues.length
      );
    },
  },
};
</script>
