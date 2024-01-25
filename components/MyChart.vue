<template>
  <div>
    <div v-if="hasData" >
      <Bar :data="chartData" />
    </div>
    <div v-else>
     </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartLabels: {
      type: Array,
      required: true,
    },
    chartDataValues: {
      type: Array,
      required: true,
    },
    chartLabel: {
      type: String,
      default: 'Revenue',
    },
    chartBackgroundColor: {
      type: String,
      default: '#304D30',
    },
  },
  computed: {
    hasData() {
      return this.chartLabels.length > 0 && this.chartDataValues.length > 0;
    },
    chartData() {
      return {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.chartLabel,
            backgroundColor: this.chartBackgroundColor,
            data: this.chartDataValues,
          }
        ]
      };
    },
  },
};
</script>

<style scoped>

</style>