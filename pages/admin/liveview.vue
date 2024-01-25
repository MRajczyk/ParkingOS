<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const parkingId = route.query.parkingId;

const parkings = ref([]);
const filteredParkings = ref([]);
const searchQuery = ref('');
const selectedParking = ref({});
const selectedFloor = ref(1);
const rows = ref(1);
const spaces = ref([]);
const stage = ref(0);
const number = ref(0);
const spaceId = ref(0);
const ocuppied = ref(false);
const cost = ref(0);
const dailyEarning = ref(0);
const available = ref(true);

const filterParkings = () => {
  filteredParkings.value = parkings.value.filter((parking) =>
    parking.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
}

onMounted(async () => {
  axios
    .get("/api/admin/parking/parkings")
    .then((response) => {
      parkings.value = response.data;
      filteredParkings.value = response.data;
      selectedParking.value = response.data[0];

      if (parkingId) {
        selectedParking.value = parkings.value.find((p) => p.id === +parkingId);
      }

      rows.value = Math.ceil(selectedParking.value.parkingPlacesPerFloor / 10);

      axios
        .get("/api/admin/parking/spaces", {
          params: {
            id: +selectedParking.value.id,
          }
        })
        .then((response) => {
          spaces.value = response.data
        })
        .catch((error) => {
          console.error('Error fetching spaces:', error);
        });
    })
    .catch((error) => {
      console.error('Error fetching parkings:', error);
    });
});

function selectParking(parking) {
  stage.value = 0;
  selectedParking.value = parking;
  rows.value = Math.ceil(selectedParking.value.parkingPlacesPerFloor / 10);

  axios
    .get("/api/admin/parking/spaces", {
      params: {
        id: +parking.id,
      }
    })
    .then((response) => {
      console.log(response);
      spaces.value = response.data;
    })
    .catch((error) => {
      console.error('Error fetching spaces:', error);
    });
}

function stageUp(num, id, occupied, ava) {
  stage.value++;
  number.value = num;
  spaceId.value = id;
  ocuppied.value = occupied;
  available.value = ava;
  getCost();
}

function getCost() {
  let chargePlan = ref(null);

  axios
    .get("/api/ticket/tariff", {
      params: { parkingId: +selectedParking.value.id },
    })
    .then((response) => {
      chargePlan.value = response.data;

      axios
        .get("/api/admin/parkingSession", {
          params: {
            parkingId: +selectedParking.value.id,
            spot: spaceId.value,
          },
        })
        .then((response2) => {
          console.log(response2);

          if (response2.data[0]) {
            const entranceDate = new Date(response2.data[0].entranceDate);
            const currentDate = new Date();

            const timeDifference = currentDate - entranceDate;

            const hours = Math.floor(timeDifference / (1000 * 60 * 60));

            for (let ctr = 0; ctr <= hours; ctr++) {
              const hour = (entranceDate.getHours() + ctr) % 24;

              if (hour >= chargePlan.value.nightStart || hour < chargePlan.value.nightEnd) {
                if (ctr === 0) {
                  cost.value += chargePlan.value.nightHour1Tariff;
                } else if (ctr === 1) {
                  cost.value += chargePlan.value.nightHour2Tariff;
                } else if (ctr === 2) {
                  cost.value += chargePlan.value.nightHour3Tariff;
                } else {
                  cost.value += chargePlan.value.nightHour4Tariff;
                }
              } else {
                if (ctr === 0) {
                  cost.value += chargePlan.value.dayHour1Tariff;
                } else if (ctr === 1) {
                  cost.value += chargePlan.value.dayHour2Tariff;
                } else if (ctr === 2) {
                  cost.value += chargePlan.value.dayHour3Tariff;
                } else {
                  cost.value += chargePlan.value.dayHour4Tariff;
                }
              }
            }
          } else {
            cost.value = 0;
          }

          if (response2.data[1]._sum.finalCost) {
            dailyEarning.value = response2.data[1]._sum.finalCost;
          } else {
            dailyEarning.value = 0;
          }
          
        })
        .catch((error) => {
          console.error('Error fetching pending tickets:', error);
        });

    })
    .catch((error) => {
      console.error('Error fetching charge plan:', error);
      return null;
    });
}

</script>

<template>
  <div style="background-color: var(--bg-light);height: 100%;">
    <TopBar>
      <div class="bckg">
        <div class="left">
          <input type="text" id="search" v-model="searchQuery" @input="filterParkings" placeholder="Search" />
          <div class="container">
            <div v-for="parking in parkings" class="parking" :class="{ active: selectedParking === parking }"
              @click="selectParking(parking)">
              <div>
                {{ parking.name }}
              </div>
              <div style="font-size: small;">
                {{ parking.city }}, {{ parking.address }}
              </div>
            </div>
          </div>
        </div>

        <div class="right">
          <h1>{{ selectedParking.name }}</h1>

          <div v-if="stage === 0" class="background">
            <select v-model="selectedFloor">
              <option v-for="floor in selectedParking.floors" :key="floor" :value="floor">
                Floor {{ floor }}
              </option>
            </select>

            <div class="view">
              <div v-for="i in rows" class="rows">
                <div v-for="j in 10" class="space-wrapper">
                  <div v-if="(i - 1) * 10 + j <= selectedParking.parkingPlacesPerFloor" class="space"
                    :class="{ occupied: spaces[((selectedFloor - 1) * selectedParking.parkingPlacesPerFloor) + ((i - 1) * 10 + j - 1)].ocuppied }"
                    :title="'Space ocuppied: ' + spaces[((selectedFloor - 1) * selectedParking.parkingPlacesPerFloor) + ((i - 1) * 10 + j - 1)].ocuppied"
                    @click="stageUp((i - 1) * 10 + j, spaces[((selectedFloor - 1) * selectedParking.parkingPlacesPerFloor) + ((i - 1) * 10 + j - 1)].id, spaces[((selectedFloor - 1) * selectedParking.parkingPlacesPerFloor) + ((i - 1) * 10 + j - 1)].ocuppied, spaces[((selectedFloor - 1) * selectedParking.parkingPlacesPerFloor) + ((i - 1) * 10 + j - 1)].available)">
                    {{ (i - 1) * 10 + j }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="stage === 1" class="background">
            <div style="display: flex;">
              <div class="details" :class="{ occupied: ocuppied }">
                {{ number }}
              </div>
              <div class="info">
                <div>Ocuppied: {{ ocuppied }}</div>
                <div>Available: {{ available }}</div>
                <div v-if="ocuppied">Current earnings: {{ cost }} PLN</div>
                <div>Daily earnings: {{ dailyEarning }} PLN</div>
              </div>
            </div>

            <div class="buttons">
              <button class="back" @click="stage--">Back</button>
              <NuxtLink :to="{ path: '/admin/statisticsspace/', query: {spaceId: spaceId } }">
                <button>Statistics</button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </TopBar>
  </div>
</template>

<style scoped>
.bckg {
  display: flex;
  text-align: center;
}

.background {
  background-color: white;
  width: 70%;
  margin: 5% auto 0 auto;
  border-radius: 30px;
  padding: 2%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
}

.left {
  margin-top: 5%;
  width: 20%;
  border-right: 1px solid var(--shadow);
}

.right {
  width: 80%;
}

#search {
  padding: 2%;
  margin: 5% auto;
  border-radius: 16px;
  width: 70%;
  border: 1px solid var(--shadow);
}

.parking {
  margin: 5% auto;
  padding: 1% 4%;
  width: 80%;
  border-radius: 14px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  text-align: left;
}

.container {
  max-height: 700px;
  overflow-y: scroll;
}

.view::-webkit-scrollbar,
.container::-webkit-scrollbar {
  width: 10px;
  margin-left: 10px;
}

.view::-webkit-scrollbar-thumb,
.container::-webkit-scrollbar-thumb {
  background-color: var(--primary-lighter);
  border-radius: 20px;
  border: 6px solid transparent;
}

h1 {
  color: var(--shadow);
  font-weight: 1500;
  font-size: 60px;
  margin-top: 5%;
}

button:hover,
.space:hover,
.parking:hover {
  cursor: pointer;
}

.parking.active {
  background-color: var(--bg-darker);
}

select {
  padding: 0.5%;
  border-radius: 16px;
  width: 26%;
  border: 1px solid var(--shadow);
  font-size: large;
}

.view {
  margin: 2%;
  max-height: 500px;
  overflow-y: scroll;
  display: block;
}

.rows {
  display: flex;
  justify-content: center;
}

.space-wrapper {
  margin: 5% 0;
  width: 10%;
}

.space {
  padding-top: 50%;
  padding-bottom: 50%;
  border: 3px solid green;
}

.occupied {
  border-color: red;
}


.details.occupied {
  border-color: red;
}

.details {
  width: 20%;
  margin: 2% 16%;
  padding-top: 15%;
  padding-bottom: 15%;
  border: 3px solid green;
}

.info {
  padding-top: 2%;
  text-align: left;
}

button {
  margin: 6% 4% 0% 4%;
  padding: 2%;
  border-radius: 16px;
  width: 30%;
  background-color: var(--primary-lighter);
  color: var(--bg-light);
  font-size: larger;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  border: 0;
}

.back {
  color: var(--primary-lighter);
  background-color: var(--bg-light);
}
</style>
