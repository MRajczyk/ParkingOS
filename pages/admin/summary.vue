<script setup>
import TopBar from "/components/TopBar.vue";
import { ref, onMounted, watch } from "vue";
import DynamicChart from "/components/DynamicChart.vue";

definePageMeta({ middlesware: "auth" });

const route = useRoute();
const parkingId = Number(route.query.parkingId);

const parkings = ref([]);
const filteredParkings = ref([]);
const selectedParking = ref(null);
const selectedParkingName = ref("");
const param = ref(true);

const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedPeriod = ref(null);
const chartFlag = ref(false);

const yearFlag = ref(1);
const monthFlag = ref(1);
const periodFlag = ref(1);
const years = ref([]);
const periods = ref([]);

const months = ref([
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
]);
const monthsshort = ref([
  { id: 1, name: "Jan" },
  { id: 2, name: "Feb" },
  { id: 3, name: "Mar" },
  { id: 4, name: "Apr" },
  { id: 5, name: "May" },
  { id: 6, name: "Jun" },
  { id: 7, name: "Jul" },
  { id: 8, name: "Aug" },
  { id: 9, name: "Sep" },
  { id: 10, name: "Oct" },
  { id: 11, name: "Nov" },
  { id: 12, name: "Dec" },
]);
const labels = ref([]);
const precisionrevenu = ref([]);
const precisionCosts = ref([]);

const searchQuery = ref("");
const isLoading = ref(true);

const monthlyCosts = ref([]);
const chartData = ref([]);
const monthsRevenue = ref([]);
const monthsCosts = ref([]);
const filteredMonths = ref([]);

const filterParkings = () => {
  filteredParkings.value = parkings.value.filter((parking) =>
    parking.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
};
const fetchParkings = async () => {
  try {
    const response = await fetch("/api/statistics/all");
    const data = await response.json();
    parkings.value = data.data;
    filterParkings();

    if (parkings.value.length > 0) {
      selectParking(parkings.value[0].id, parkings.value[0].name);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const selectParking = async (id) => {
  let selectedParkingData;

  chartFlag.value = false;
  monthlyCosts.value = [];
  years.value = [];
  monthsRevenue.value = [];
  periods.value = [];
  chartData.value = [];
  filteredMonths.value = [];
  labels.value = [];
  precisionrevenu.value = [];
  if (
    parkingId !== undefined &&
    parkings.value.some((parking) => parking.id === parkingId) &&
    param.value
  ) {
    selectedParking.value = parkingId;
    selectedParkingData = parkings.value.find(
      (parking) => parking.id === parkingId
    );
    param.value = false;
  } else {
    selectedParking.value = id;
    selectedParkingData = parkings.value.find(
      (parking) => parking.id === selectedParking.value
    );
  }
  selectedParkingName.value = selectedParkingData.name;
  await fetchSummary();
  await fetchChart();
  addYearsFromChartData();
};

const fetchChart = async () => {
  if (!selectedParking.value) {
    return;
  }
  try {
    const response = await fetch(`/api/summary/chart/${selectedParking.value}`);
    const data = await response.json();
    chartData.value = data.transformedSessions;
  } catch (error) {
    console.error(error);
  }
};

const fetchSummary = async () => {
  if (!selectedParking.value) {
    return;
  }

  try {
    const response = await fetch(`/api/summary/sum/${selectedParking.value}`);
    const data = await response.json();
    monthlyCosts.value = data.costs;
  } catch (error) {
    console.error(error);
  }
};

const addYearsFromChartData = () => {
  if (selectedParking.value !== null) {
    const uniqueYears = new Set();

    chartData.value.forEach((item) => {
      const leaveDate = new Date(item.leaveDate);
      const year = leaveDate.getFullYear();

      uniqueYears.add(year);
    });

    //tu dodaje lata w ktorych sie koszty zaczynaly
    monthlyCosts.value.forEach((item) => {
      const currentYear = new Date().getFullYear();
      const cyclicCostStartYear = new Date(item.startYear, 1, 1).getFullYear();

      let iteratorYears = cyclicCostStartYear;
      while (iteratorYears <= currentYear) {
        uniqueYears.add(iteratorYears);
        iteratorYears++;
      }
    });

    const yearsList = Array.from(uniqueYears).sort((a, b) => b - a);
    years.value = yearsList;

    if (years.value.length > 0) {
      if (selectedYear.value && selectedYear.value != years.value[0]) {
        selectedYear.value = years.value[0];
      } else {
        if (!selectedYear.value) {
          selectedYear.value = years.value[0];
        } else {
          yearFlag.value *= -1;
        }
      }
    } else {
      chartFlag.value = false;
      if (selectedYear.value) selectedYear.value = null;
      else yearFlag.value *= -1;
    }
  }
};

//patrzec moze jakos na koszty
const generatePeriodRange = () => {
  periods.value = [];

  if (selectedParking.value !== null && years.value.length > 0) {
    const maxPeriod =
      Math.max(...filteredMonths.value.map((month) => month.id)) +
      1 -
      selectedMonth.value.id;

    periods.value.push(
      ...Array.from({ length: maxPeriod }, (_, index) => index + 1)
    );

    if (selectedPeriod.value != periods.value[0]) {
      selectedPeriod.value = periods.value[0];
    } else {
      periodFlag.value *= -1;
    }
  } else if (years.value.length === 0) {
    selectedPeriod.value = null;
  }
};

const calculateMonthlyRevenue = () => {
  monthsRevenue.value = [];
  if (selectedParking.value !== null && years.value.length > 0) {
    const monthlyRevenue = Array.from({ length: 12 }, () => 0);
    const monthlyCostAmount = Array.from({ length: 12 }, () => 0);

    //tutaj filtruje sobie hajs z sesyjek
    //todo: pomylec czy tu tez nie filtrowac kosztów, ale to TODO:  w kosztach tez zwracac z ep wszystkie dane i paczec po roku + jezeli jest finish date to czy miesiac jest winkszy
    monthlyCosts.value.forEach((cost) => {
      if (!cost.cyclic) {
        if (cost.startYear === Number(selectedYear.value)) {
          monthlyCostAmount[cost.startMonth] += Number(cost.costValue);
        }
      } else {
        if (cost.startYear === Number(selectedYear.value)) {
          if (cost.endYear) {
            if (cost.endYear > Number(selectedYear.value)) {
              for (let i = cost.startMonth; i < 12; ++i) {
                monthlyCostAmount[i] += Number(cost.costValue);
              }
            } else if (cost.endYear === Number(selectedYear.value)) {
              for (let i = cost.startMonth; i <= cost.endMonth; ++i) {
                monthlyCostAmount[i] += Number(cost.costValue);
              }
            }
          } else {
            for (let i = cost.startMonth; i < 12; ++i) {
              monthlyCostAmount[i] += Number(cost.costValue);
            }
          }
        } else if (cost.startYear < Number(selectedYear.value)) {
          if (cost.endYear > Number(selectedYear.value)) {
            for (let i = 0; i < 12; ++i) {
              monthlyCostAmount[i] += Number(cost.costValue);
            }
          } else if (cost.endYear === Number(selectedYear.value)) {
            for (let i = 0; i <= cost.endMonth; ++i) {
              monthlyCostAmount[i] += Number(cost.costValue);
            }
          }
        }
      }
    });

    const filteredChartData = chartData.value.filter((item) => {
      const leaveDate = new Date(item.leaveDate);

      return leaveDate.getFullYear() === Number(selectedYear.value);
    });
    filteredChartData.forEach((item) => {
      const leaveDate = new Date(item.leaveDate);
      const month = leaveDate.getMonth();

      monthlyRevenue[month] += Number(item.finalCost);
    });

    monthsRevenue.value = monthlyRevenue;
    monthsCosts.value = monthlyCostAmount;
    console.log(monthlyCostAmount);
  }
};

//ta funkcja dodaje do tablicy dane do wyswietlenia na wyrkesie - precisionrevenu (xd) to po kolei hajs dla danego miesiaca co jest labels
const generateValues = () => {
  chartFlag.value = false;
  labels.value = [];
  precisionrevenu.value = [];
  precisionCosts.value = [];
  if (selectedParking.value !== null && selectedPeriod.value != null) {
    const selectedMonthIndex = Number(selectedMonth.value.id) - 1;
    const selectedPeriodValue = Number(selectedPeriod.value);

    const startMonthIndex = selectedMonthIndex;
    const endMonthIndex = selectedMonthIndex + selectedPeriodValue;

    for (let i = startMonthIndex; i < endMonthIndex; i++) {
      labels.value.push(monthsshort.value[i].name);
      precisionrevenu.value.push(Number(monthsRevenue.value[i]));
      precisionCosts.value.push(Number(monthsCosts.value[i]));
    }
    if (years.value.length > 0) chartFlag.value = true;
  }
};

const generateMonthOptions = () => {
  filteredMonths.value = [];
  filteredMonths.value = months.value;
  // if (selectedParking.value !== null && years.value.length > 0) {
  //   const currentYear = new Date().getFullYear();
  //   const selectedYearValue = selectedYear.value;

  //   let minimumMonth = 1;
  //   let maximumMonth = 12;

  //   //tu moze zostawie narazie tak, albo w ogole zmienie zeby zawsze od poczatku roku sie dalo
  //   if (Number(selectedYearValue) === currentYear) {
  //     minimumMonth = 1;
  //     maximumMonth = new Date().getMonth() + 1;
  //   } else if (Number(selectedYearValue) === Math.min(...years.value)) {
  //     const earliestLeaveDate = new Date(
  //       Math.min(
  //         ...chartData.value
  //           .filter(
  //             (item) =>
  //               new Date(item.leaveDate).getFullYear() ===
  //               Number(selectedYearValue)
  //           )
  //           .map((item) => new Date(item.leaveDate).getTime())
  //       )
  //     );
  //     minimumMonth = earliestLeaveDate.getMonth() + 1;
  //     if (!minimumMonth) {
  //       minimumMonth = 1;
  //     }

  //     maximumMonth = 12;
  //   }

  //   filteredMonths.value = months.value.filter(
  //     (month) => month.id >= minimumMonth && month.id <= maximumMonth
  //   );
  // }
};

const watchselectedyear = async () => {
  watch(
    [selectedYear, yearFlag],
    ([newOption, newFlag], [oldOption, oldFlag]) => {
      if (selectedParking.value !== null) {
        calculateMonthlyRevenue();
        generateMonthOptions();

        if (filteredMonths.value.length > 0) {
          if (selectedMonth.value != filteredMonths.value[0]) {
            selectedMonth.value = filteredMonths.value[0];
          } else {
            monthFlag.value *= -1;
          }
        } else {
          if (selectedMonth.value) {
            selectedMonth.value = null;
          } else {
            monthFlag.value *= -1;
          }
        }
      }
    }
  );
};

const watchselectedmonth = async () => {
  watch(
    [selectedMonth, monthFlag],
    ([newOption, newFlag], [oldOption, oldFlag]) => {
      if (selectedParking.value !== null) {
        generatePeriodRange();
      }
    }
  );
};

const watchselectedperiod = async () => {
  watch(
    [selectedPeriod, periodFlag],
    ([newOption, newFlag], [oldOption, oldFlag]) => {
      if (selectedParking.value != null) {
        generateValues();
      }
    }
  );
};

onMounted(async () => {
  await nextTick();
  await watchselectedyear();
  await watchselectedmonth();
  await watchselectedperiod();
  await fetchParkings();
});
</script>
<template>
  <TopBar>
    <div class="container">
      <div class="left-side">
        <div class="search-input-container">
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            @input="filterParkings"
            placeholder="Search"
          />
        </div>
        <div class="buttons-container" ref="buttonsList">
          <button
            v-if="!isLoading"
            v-for="parking in filteredParkings"
            :key="parking.id"
            class="left-button"
            :class="{ active: selectedParking === parking.id }"
            @click="selectParking(parking.id)"
          >
            <div>
              <div style="font-size: medium">
                {{ parking.name }}
              </div>
              <div style="font-size: small">
                {{ parking.city }}, {{ parking.address }}
              </div>
            </div>
          </button>
          <p v-if="isLoading">Loading...</p>
        </div>
      </div>
      <div class="right-side">
        <div class="selected-title">{{ selectedParkingName }}</div>
        <div class="chart-container">
          <div class="selectors-container">
            <div class="select-container">
              <label for="year">Year:</label>
              <select v-model="selectedYear" id="year">
                <option v-for="year in years" :key="year">{{ year }}</option>
              </select>
            </div>
            <div class="select-container">
              <label for="startingMonth">Starting month:</label>
              <select v-model="selectedMonth" id="startingMonth">
                <option
                  v-for="month in filteredMonths"
                  :key="month.id"
                  :value="month"
                >
                  {{ month.name }}
                </option>
              </select>
            </div>

            <div class="select-container">
              <label for="period">Period in month:</label>
              <select v-model="selectedPeriod" id="period">
                <option v-for="period in periods" :key="period">
                  {{ period }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <DynamicChart
              v-if="chartFlag"
              :chartLabels="labels"
              :chartDataValues="precisionrevenu"
              :chartCostValues="precisionCosts"
            />
            <div v-else></div>
          </div>
        </div>
      </div>
    </div>
  </TopBar>
</template>
<style scoped>
.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: #eef0e5;
  width: 100%;
  height: 100%;
  color: #333;
  overflow-y: auto;
}

.left-side {
  width: 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1%;
  height: 100%;
  border-right: 1px solid #ccc;
}

.right-side {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.selected-title {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
  font-size: 40px;
  font-weight: bold;
  color: #5c5c5c;
}
.search-input-container {
  margin-top: 30px;
  align-items: center;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 35px;
}

input {
  margin-top: 60px;
  border-radius: 14px;
  width: 80%;
  padding: 1% 4%;
  margin-left: 10%;
  margin-right: 10%;

  color: #333;
  background-color: white;
}

.buttons-container {
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.left-button {
  align-items: left;
  display: flex;
  text-align: left;
  justify-content: left;
  margin: 5% auto;
  padding: 1% 4%;
  cursor: pointer;
  border: none;
  border-radius: 14px;
  background-color: #ffffff;
  color: #000000;
  box-sizing: border-box;

  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  width: 90%;
}

.buttons-container::-webkit-scrollbar {
  width: 10px;
  margin-left: 10px;
}

.buttons-container::-webkit-scrollbar-thumb {
  background-color: #c7e5c2;
  border-radius: 20px;
  border: 6px solid transparent;
}

.buttons-container::-webkit-scrollbar-track {
  background-color: #eef0e5;
}

.left-button.active {
  background-color: #dde7dd;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
}

.left-button:hover {
  background-color: #c7e5c2;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

select {
  padding: 5px;
  border-radius: 14px;
  max-width: 50%;
  width: 50%;
  margin-top: 30px;

  margin-bottom: 15px;
  color: #333;
  background-color: #eef0e5;
  text-align: center;
}

.chart-container {
  background-color: #ffffff;
  border-radius: 14px;
  padding: 15px;
  margin-left: 8%;
  margin-right: 15%;

  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 77%;
  width: 77%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.selectors-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 35px;
}

.select-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
}

.select-container label {
  margin-bottom: 5px;
  color: #5c5c5c;
}

.select-container select {
  margin-top: 5px;
  width: 100%;
}
</style>
