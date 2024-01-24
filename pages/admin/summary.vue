<script setup>
import TopBar from "/components/TopBar.vue";
 import { ref, onMounted, watch } from 'vue';
 
  definePageMeta({ middlesware: "auth" });
 
 






const route = useRoute();
const parkingId = Number(route.query.parkingId);
 

 
 
const parkings = ref([]);
const filteredParkings = ref([]);
const selectedParking = ref(null);
const selectedParkingName = ref('');
const param= ref(true);

const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedPeriod = ref(null);

const yearFlag= ref(1);
const monthFlag= ref(1);
const periodFlag= ref(1);

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
  { id: 12, name: "December" }
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
  { id: 12, name: "Dec" }
]);
const labels = ref([]);
const precisionrevenu = ref([]);

const searchQuery = ref('');
const isLoading = ref(true);

const sumOfMonthlyCosts = ref(0);
const chartData = ref([]);
const monthsRevenue = ref([]);



const updateChart = () => {
 
};



const filterParkings = () => {
   filteredParkings.value = parkings.value.filter((parking) =>
    parking.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
};
const fetchParkings = async () => {
  try {
    const response = await fetch('/api/statistics/all');
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
  years.value=[];
  periods.value=[];
  chartData.value=[];

if (parkingId !== undefined   && parkings.value.some(parking => parking.id === parkingId) && param.value) {
  selectedParking.value = parkingId;
  selectedParkingData = parkings.value.find(parking => parking.id === parkingId);
  param.value = false;
 }
  else
  {
  selectedParking.value = id;
    selectedParkingData = parkings.value.find(parking => parking.id ===  selectedParking.value);
  }
  selectedParkingName.value = selectedParkingData.name;
await  fetchSummary();
await    fetchChart();
   addYearsFromChartData();


  };






const fetchChart= async () => {
  if (!selectedParking.value ) {
      return;}
  try {
    const response = await fetch(`/api/summary/chart/${selectedParking.value}`);
    const data = await response.json();
    chartData.value = data.transformedSessions;
    } catch (error) {
    console.error(error);
  }
};

const fetchSummary = async () => {
  if (!selectedParking.value ) {
      return;}
  try {
    const response = await fetch(`/api/summary/sum/${selectedParking.value}`);
    const data = await response.json();
    sumOfMonthlyCosts.value = data.sum;
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

   const yearsList = Array.from(uniqueYears).sort((a, b) => b - a);
    years.value = yearsList;


    if (years.value.length > 0) {
      if(selectedYear.value&& selectedYear.value!=years.value[0])
    {selectedYear.value = years.value[0];}
  else
 {
  if(!selectedYear.value)
  {selectedYear.value = years.value[0];}
else
  {yearFlag.value*=-1;}
 }
       }
       else
       {
        if(selectedYear.value)
        selectedYear.value=null;
        else
       yearFlag.value*=-1;

       }
      
}
}

const generatePeriodRange  = () => {
  if (selectedParking.value !== null) {
  periods.value = [];
   const maxPeriod = 13 - selectedMonth.value.id;
   periods.value.push(...Array.from({ length: maxPeriod }, (_, index) => index + 1));
  if(selectedPeriod.value != periods.value[0])
{
  selectedPeriod.value = periods.value[0];
  }
else
{      

  
  periodFlag.value*=-1;
}
  }
 };

 const calculateMonthlyRevenue = () => {
  if (selectedParking.value !== null) {
  monthsRevenue.value=[];
   const monthlyRevenue = Array.from({ length: 12 }, () => 0 - Number(sumOfMonthlyCosts.value));

   const filteredChartData = chartData.value.filter((item) => {
    const leaveDate = new Date(item.leaveDate);


    return leaveDate.getFullYear() === Number(selectedYear.value);
  });
   filteredChartData.forEach((item) => {
    const leaveDate = new Date(item.leaveDate);
    const month = leaveDate.getMonth();

     monthlyRevenue[month] += Number(item.finalCost);
  });

   monthsRevenue.value = monthlyRevenue;}
 };

 const generateValues = () => {
  if (selectedParking.value !== null) {
  const selectedMonthIndex = Number(selectedMonth.value.id) - 1;
  const selectedPeriodValue = Number(selectedPeriod.value);

  const startMonthIndex = selectedMonthIndex;
  const endMonthIndex = selectedMonthIndex + selectedPeriodValue;
  labels.value = [];
precisionrevenu.value = [];
  for (let i = startMonthIndex; i < endMonthIndex; i++) {
    labels.value.push(monthsshort.value[i].name);
    precisionrevenu.value.push(monthsRevenue.value[i]);
  } 
   updateChart();



}};


 const watchselectedyear = async () => {
  watch(
    [selectedYear, yearFlag],
    ([newOption, newFlag], [oldOption, oldFlag]) => {

      if (selectedParking.value !== null) {

        calculateMonthlyRevenue();
      if( selectedMonth.value != months.value[0])
      
      {
selectedMonth.value = months.value[0];
      }
    else
   {     
     monthFlag.value*=-1;
 
  }
      }
    },
    { deep: true }
  );
};

const watchselectedmonth = async () => {
  watch(
    [selectedMonth, monthFlag],
    ([newOption, newFlag], [oldOption, oldFlag]) => {
      if ( selectedParking.value !== null) {


      generatePeriodRange();
      }
     },
    { deep: true }
  );
};

const watchselectedperiod = async () => {
  watch(
    [selectedPeriod, periodFlag],
    ([newOption, newFlag], [oldOption, oldFlag]) => {
      if (selectedParking.value !== null) {

        generateValues();
        updateChart();

      }
    },
    { deep: true }
  );
};

 
onMounted(async () => {
  await nextTick();
 
 

   await watchselectedyear();
   
  await watchselectedmonth();
  await watchselectedperiod();
 await fetchParkings();
 var ctx = document.getElementById('myChart').getContext('2d');

// Sample data for a bar chart
var data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{
        label: 'Sample Data',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [65, 59, 80, 81, 56]
    }]
};

// Configuration options for the chart
var options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

// Create a bar chart
var myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});
 
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
            {{ parking.name }}
          </button>
          <p v-if="isLoading">Loading...</p>
        </div>
      </div>
      <div class="right-side">
        <div class="selected-title">{{ selectedParkingName }}</div>
        <div class="monthly-cost-container">
          <p>Monthly Costs: {{ sumOfMonthlyCosts }} PLN</p>
        </div>
        <div class="chart-container">
          <!-- Zaktualizowane: Selektory i etykiety w jednej linii -->
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
                <option v-for="month in months" :key="month.id" :value="month">
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

          <canvas ref="myChart" id="myChart"></canvas>

        </div>
      </div>
    </div>
  </TopBar>
</template>
<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  width: 100%;
  height: 100%;
  position: relative;
}

.container {
  display: flex;
  justify-content: space-between;
  background-color: #eef0e5;
  width: 100%;
  height: 100%;
  color: #333;
  max-height: 100%;
}

.left-side {
  width: 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1%;
  max-height: 100%;
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
  margin-bottom: 65px;
  font-size: 64px;
  max-height: 100%;
  font-weight: bold;
  color: #5c5c5c;
}

.search-input-container {
  position: relative;
  width: 100%;
  margin-bottom: 25px;
}

input {
  margin-top: 80px;
  padding: 10px;
  border-radius: 20px;
  width: 90%;
  margin-right: 10%;
  max-height: 200px;
  height: 50px;
  font-size: 30px;
  color: #333;
  background-color: #eef0e5;
}

.buttons-container {
  max-height: 45%;
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.left-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  background-color: #ffffff;
  color: #000000;
  flex-shrink: 0;
  box-sizing: border-box;
  margin-right: 5%;
  height: 50px;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 95%;
  font-size: 30px;
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
  padding: 10px;
  border-radius: 20px;
  max-width: 50%; /* Zwiększ maksymalną szerokość */
  width: 50%; /* Zwiększ bieżącą szerokość */
  margin-top: 30px;
  max-height: 200px;
  height: 50px;
  font-size: 25px;
  margin-bottom: 30px;
  color: #333;
  background-color: #eef0e5;
  text-align: center;
}

.monthly-cost-container {
  margin-left: 11%;
  font-size: 30px;
  color: #000000;
  margin-bottom: 20px;
  margin-top: 20px;
}
.chart-container {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px;
  margin-left: 8%;
  margin-right: 15%;

  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 77%;
  width: 77%;
  box-sizing: border-box;
  max-height: 60%;

  /* Zaktualizowane: Selektory i etykiety w jednej linii */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

/* Zaktualizowane: Styl dla kontenera z selektorami */
.selectors-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* Zaktualizowane: Styl dla każdego z trzech selektorów */
.select-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px; /* Ustal równą szerokość dla każdego selektora */
}

.select-container label {
  margin-bottom: 5px; /* Dostosuj margines między etykietą a selektorem według potrzeb */
  color: #5c5c5c;
}

.select-container select {
  margin-top: 5px; /* Dostosuj margines między selektorem a etykietą według potrzeb */
  width: 100%; /* Zajmij całą dostępną szerokość wewnątrz kontenera */
}
</style>


