<script setup>
import TopBar from "/components/TopBar.vue";
import { ref } from "vue";
import axios from "axios";

const parkings = ref([]);
const filteredParkings = ref([]);
const searchQuery = ref('');

onMounted(async () => {
  axios
    .get("/api/admin/parking/parkings")
    .then((response) => {
      parkings.value = response.data;
      filteredParkings.value = response.data;
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
});

const filterParkings = () => {
  filteredParkings.value = parkings.value.filter((parking) =>
    parking.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
}

function deleteParking(id) {
  axios
    .delete("/api/admin/parking/delete/", {
      data: {
        parkingId: +id,
      },
    })
    .then((response) => {

      const indexInParkings = parkings.value.findIndex(p => p.id === +id);
      const indexInFilteredParkings = filteredParkings.value.findIndex(p => p.id === +id);

      if (indexInParkings !== -1) {
        parkings.value.splice(indexInParkings, 1);
      }

      if (indexInFilteredParkings !== -1) {
        filteredParkings.value.splice(indexInFilteredParkings, 1);
      }

      alert("Parking deleted");
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.message && error.response.data.message === 'Unable to delete all spaces.') {
        alert("You cannot delete the parking because some parking spaces have cars parked on them. The unoccupied spaces have been successfully deleted. Please wait for all spaces to become vacant and try again.");
      } else {
        alert("Deletion failed");
      }
      console.log(error);
    });

}

</script>

<template>
  <div style="background-color: var(--bg-light);height: 100%;">
    <TopBar>
      <div class="background">
        <h1>Car parks</h1>
        <input type="text" id="search" v-model="searchQuery" @input="filterParkings" placeholder="Search" />

        <div class="container">
          <div v-for="parking in filteredParkings" class="parking-wrapper">
            <div class="part1">
              <div class="info">
                Name: {{ parking.name }}
                <br>
                Address: {{ parking.city }}, {{ parking.address }}
              </div>
              <div class="edit-delete">
                <img src="/images/recycle-bin.png" @click="deleteParking(parking.id)" style="width: 30%">
                <NuxtLink :to="{ path: '/admin/parkings/edit', query: { id: parking.id } }">
                  <img src="/images/edit.png" style="width: 30%;margin-left: 10%;">
                </NuxtLink>
              </div>
            </div>
            <div class="part2">
              <NuxtLink :to="{ path: '/admin/liveview', query: { parkingId: parking.id } }">
                <button class="actions">LiveView</button>
              </NuxtLink>
              <NuxtLink :to="{ path:'/admin/costs/' + parking.id }">
                <button class="actions">Costs</button>
              </NuxtLink>
              <!-- <NuxtLink :to="{ path: '/admin/statistics', query: { parkingId: parking.id } }"> -->
                <button class="actions">Statistics</button>
              <!-- </NuxtLink> -->
              <!-- <NuxtLink :to="{ path: '/admin/summary', query: { parkingId: parking.id } }"> -->
                <button class="actions">Summary</button>
              <!-- </NuxtLink> -->
            </div>
          </div>
        </div>

        <div class="buttons">
          <NuxtLink to="/">
            <button class="back">Back</button>
          </NuxtLink>
          <NuxtLink to="/admin/parkings/maker">
            <button>Add new</button>
          </NuxtLink>
        </div>
      </div>
    </TopBar>
  </div>
</template>

<style scoped>
.background {
  background-color: white;
  width: 40%;
  margin: 3% auto 0 auto;
  border-radius: 30px;
  padding: 2%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  color: var(--shadow);
  font-weight: 1500;
  font-size: 60px;
  margin-top: 5%;
}

#search {
  padding: 2%;
  margin: 5% auto;
  border-radius: 16px;
  width: 70%;
  border: 1px solid var(--shadow);
}

.parking-wrapper {
  padding: 3%;
  margin: 0 auto 3%;
  width: 90%;
  border-radius: 16px;
  border: 1px solid var(--shadow);
}

.part1 {
  display: flex;
}

.info {
  width: 80%;
  text-align: left;
}

.edit-delete {
  width: 20%;
}

.actions {
  margin: 3% 3% 0;
  width: 17%;
  background-color: #A6BE8D;
  color: var(--primary-lighter);
  font-size: medium;
  font-weight: 600;
}

button {
  margin: 6% 4% 0% 4%;
  padding: 2%;
  border-radius: 16px;
  width: 36%;
  background-color: var(--primary-lighter);
  color: var(--bg-light);
  font-size: larger;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  border: 0;
}

img:hover,
button:hover {
  cursor: pointer;
}

.back {
  color: var(--primary-lighter);
  background-color: var(--bg-light);
}

.container {
  overflow-y: scroll;
  max-height: 320px;
}

.container::-webkit-scrollbar {
  width: 10px;
  margin-left: 10px;
}

.container::-webkit-scrollbar-thumb {
  background-color: var(--primary-lighter);
  border-radius: 20px;
  border: 6px solid transparent;
}
</style>
