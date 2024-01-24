<!-- BarChart.vue -->
<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';

const chartData = ref({
  labels: [],
  precisionrevenue: [],
});

const chartOptions = ref({
  // Definiuj opcje wykresu, jeśli są potrzebne
});

const BarChart = defineComponent({
  extends: Bar,
  props: ['labels', 'precisionrevenue', 'options'],
  mounted() {
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: 'Precision Revenue',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: this.precisionrevenue,
        },
      ],
    }, this.options);
  },
});

watch([() => BarChart.labels, () => BarChart.precisionrevenue, () => BarChart.options], ([newLabels, newPrecisionRevenue, newOptions]) => {
  // Update the chart data and options when props change
  const chart: any = BarChart;
  chart.renderChart({
    labels: newLabels,
    datasets: [
      {
        label: 'Precision Revenue',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: newPrecisionRevenue,
      },
    ],
  }, newOptions);
});

export default BarChart;
</script>
