<script setup>
import TopBar from "/components/TopBar.vue";
import { ref } from "vue";
import axios from "axios";

const parkings = ref([]);
const filteredParkings = ref([]);
const searchQuery = ref("");

onMounted(async () => {
  axios
    .get("/api/admin/parking/parkings")
    .then((response) => {
      parkings.value = response.data;
      filteredParkings.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching parkings:", error);
    });
});

const filterParkings = () => {
  filteredParkings.value = parkings.value.filter((parking) =>
    parking.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

function deleteParking(id) {
  axios
    .delete("/api/admin/parking/delete/", {
      data: {
        parkingId: +id,
      },
    })
    .then((response) => {
      const indexInParkings = parkings.value.findIndex((p) => p.id === +id);
      const indexInFilteredParkings = filteredParkings.value.findIndex(
        (p) => p.id === +id
      );

      if (indexInParkings !== -1) {
        parkings.value.splice(indexInParkings, 1);
      }

      if (indexInFilteredParkings !== -1) {
        filteredParkings.value.splice(indexInFilteredParkings, 1);
      }

      alert("Parking deleted");
    })
    .catch((error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message === "Unable to delete all spaces."
      ) {
        alert(
          "You cannot delete the parking because some parking spaces have cars parked on them. The unoccupied spaces have been marked as not available. Please wait for all spaces to become vacant and try again."
        );
      } else {
        alert("Deletion failed");
      }
      console.log(error);
    });
}

const showModalFlag = ref(false);
const idForModal = ref(null);

function discardCallback() {
  if (idForModal.value) {
    deleteParking(idForModal.value);
  }
}

function showModal(id) {
  idForModal.value = id;
  showModalFlag.value = true;
}

function hideModal() {
  idForModal.value = null;
  showModalFlag.value = false;
}
</script>

<template>
  <div style="background-color: var(--bg-light); height: 100%">
    <TopBar>
      <div class="modal" v-if="showModalFlag" @click="hideModal()">
        <div class="modal-content">
          <p>Do you really wanna delete this parking?</p>
          <p style="color: red"><b>This action cannot be reversed.</b></p>
          <button
            class="modal-button"
            @click="discardCallback()"
            style="background-color: red; margin-top: 10px"
          >
            Delete
          </button>
          <button
            class="modal-button"
            style="margin-top: 4px"
            @click="hideModal()"
          >
            Back
          </button>
        </div>
      </div>
      <div class="background">
        <h1>Car parks</h1>
        <input
          type="text"
          id="search"
          v-model="searchQuery"
          @input="filterParkings"
          placeholder="Search"
        />

        <div class="container">
          <div v-for="parking in filteredParkings" class="parking-wrapper">
            <div class="part1">
              <div class="info">
                Name: {{ parking.name }}
                <br />
                Address: {{ parking.city }}, {{ parking.address }}
              </div>
              <div class="edit-delete">
                <img
                  src="/images/recycle-bin.png"
                  @click="showModal(parking.id)"
                  style="width: 30%"
                />
                <!-- totu -->
                <NuxtLink
                  :to="{
                    path: '/admin/parkings/edit',
                    query: { id: parking.id },
                  }"
                >
                  <img
                    src="/images/edit.png"
                    style="width: 30%; margin-left: 10%"
                  />
                </NuxtLink>
              </div>
            </div>
            <div class="part2">
              <NuxtLink
                :to="{
                  path: '/admin/liveview',
                  query: { parkingId: parking.id },
                }"
              >
                <button class="actions">LiveView</button>
              </NuxtLink>
              <NuxtLink :to="{ path: '/admin/costs/' + parking.id }">
                <button class="actions">Costs</button>
              </NuxtLink>
              <NuxtLink
                :to="{
                  path: '/admin/statistics',
                  query: { parkingId: parking.id },
                }"
              >
                <button class="actions">Statistics</button>
              </NuxtLink>
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
.modal {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  background-color: white;
  width: 300px;
  gap: 4px;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 20px;
}

.modal-content > p {
  color: var(--primary-lighter);
}

.modal-button {
  border-radius: 20px;
  text-decoration: none;
  text-align: center;
  width: 160px;
  padding: 10px 0px;
  color: white;
  font-size: 20px;
  background-color: var(--primary);
  cursor: pointer;
  margin: 0;
}
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
  background-color: #a6be8d;
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
