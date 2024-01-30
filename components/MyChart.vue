<template>
  <div>
    <div v-if="hasData" class="chart-container">
      <Bar
        :data="chartData"
        :options="chartOptions"
        :width="chartWidth"
        :height="chartHeight"
      />
    </div>
    <div v-else>
      <p>No data available.</p>
    </div>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
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
      default: "Revenue",
    },
    chartBackgroundColor: {
      type: String,
      default: "#304D30",
    },
    chartBackgroundColorRed: {
      type: String,
      default: "#FF0000",
    },
    chartWidth: {
      type: Number,
      default: 600,
    },
    chartHeight: {
      type: Number,
      default: 400,
    },
  },
  computed: {
    hasData() {
      return this.chartLabels.length > 0 && this.chartDataValues.length > 0;
    },
    chartData() {
      return {
        labels: this.chartLabels,
        //tu sie dodaje data testy
        datasets: [
          {
            label: this.chartLabel,
            backgroundColor: this.chartBackgroundColor,
            data: this.chartDataValues,
            stack: "stack 0",
          },
          // {
          //   label: "koszty",
          //   backgroundColor: this.chartBackgroundColorRed,
          //   data: this.chartDataValues.map((val) => val * -1),
          //   stack: "stack 0",
          // },
        ],
      };
    },
    chartOptions() {
      return {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            //tu sie gmera ze stackowaniem
            stacked: true,
            // beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + " PLN";
              },
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 15,
            },
          },
        },
      };
    },
  },
};
</script>

<style scoped>
.chart-container {
}
</style>
