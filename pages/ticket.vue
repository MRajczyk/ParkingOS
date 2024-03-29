<script setup>
import TopBar from "/components/TopBar.vue";
import { useRoute } from "vue-router";
import QrcodeVue from "qrcode.vue";
import axios from "axios";

const route = useRoute();
const { data } = useAuth();
const userId = ref(data.value.user.id);

const parkingId = route.query.parkingId;
const parkingName = ref(null);
const space = ref(null);
const floor = ref(1);
const spaceCalculated = ref(1);
const car = route.query.car;
const isBanned = ref(null);
const isLoading = ref(true);
const ticketId = ref(null);

function getFormattedDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear() - 2000;
  const month = padZero(currentDate.getMonth() + 1);
  const day = padZero(currentDate.getDate());
  const hours = padZero(currentDate.getHours());
  const minutes = padZero(currentDate.getMinutes());

  return year + month + day + hours + minutes;
}

function padZero(value) {
  return value < 10 ? "0" + value : value;
}

function copy() {
  navigator.clipboard.writeText(ticketId.value);
  alert("ID coppied");
}

function download() {
  const link = document.createElement("a");
  link.download = ticketId.value + ".png";
  link.href = document.getElementById("qr").toDataURL();
  link.click();
}

onMounted(async () => {
  axios
    .get("/api/ticket/user-state", {
      params: { id: userId.value },
    })
    .then((response) => {
      isBanned.value = response.data;

      if (isBanned.value == false) {
        const floors = ref(1);
        const parkingPlacesPerFloor = ref(1);
        axios
          .get("/api/ticket/parking-info", {
            params: { id: parkingId },
          })
          .then((response) => {
            parkingName.value = response.data.name;
            floors.value = response.data.floors;
            parkingPlacesPerFloor.value = response.data.parkingPlacesPerFloor;
          })
          .catch((error) => {
            console.error("Error fetching parking info:", error);
          });

        axios
          .get("/api/ticket/space", {
            params: { id: parkingId },
          })
          .then((response) => {
            console.log(response)
            space.value = response.data[0].id;

            for (let i = 0; i < floors.value; i++) {
              if (response.data[1] >= floor.value * parkingPlacesPerFloor.value) {
                floor.value = floor.value + 1;
              } else {
                spaceCalculated.value = response.data[1] - (floor.value - 1) * parkingPlacesPerFloor.value + 1;
              }
            }

            const date = getFormattedDate();
            ticketId.value =
              "P" + parkingId + "C" + car + "S" + space.value + date;

            axios
              .post("/api/ticket/create-reservation", {
                ticket: ticketId.value,
                date: date,
                parkingId: parkingId,
                car: car,
                spot: space.value,
                userId: +userId.value,
              })
              .then((response) => {
                console.log(response.data.statusMessage);

                axios
                  .patch("/api/ticket/car-state", {
                    id: car,
                    isParked: "true",
                  })
                  .then((response) => {
                    console.log(response.data.statusMessage);
                  })
                  .catch((error) => {
                    console.log(error.response.data.statusMessage);
                  });

                axios
                  .patch("/api/ticket/space-state", {
                    id: space.value,
                    ocuppied: "true",
                  })
                  .then((response) => {
                    console.log(response.data.statusMessage);
                  })
                  .catch((error) => {
                    console.log(error.response.data.statusMessage);
                  });

                isLoading.value = false;
              })
              .catch((error) => {
                console.log(error.response.data.statusMessage);
              });
          })
          .catch((error) => {
            console.error("Error fetching spots:", error);
          });
      } else {
        isLoading.value = false;
      }
    })
    .catch((error) => {
      console.error("Error fetching parking info:", error);
    });
});
</script>

<template>
  <div style="background-color: var(--bg-light); height: 100%">
    <TopBar>
      <div v-if="isLoading"></div>
      <div v-else>
        <div v-if="!isBanned" class="background">
          <h1>Entrance ticket</h1>

          <qrcode-vue :value="ticketId" :size="200" id="qr"></qrcode-vue>

          <div class="ticket-id">
            <p>ID: {{ ticketId }}</p>
            <img src="/images/copy.png" class="copy" @click="copy" />
          </div>

          <p>Parking: {{ parkingName }}</p>
          <p>Floor: {{ floor }}</p>
          <p>Space: {{ spaceCalculated }}</p>

          <div class="buttons-div">
            <NuxtLink to="/">
              <button class="home">Home</button>
            </NuxtLink>
            <button @click="download">Download QR</button>
          </div>
        </div>
        <div v-else class="background">
          <h1>BANNED</h1>
          <img src="/images/failure.png" class="failure" />
          <h2>Contact admin or regulate pending costs</h2>
          <NuxtLink to="/">
            <button>Home</button>
          </NuxtLink>
        </div>
      </div>
    </TopBar>
  </div>
</template>

<style>
:root {
  --primary-lighter: #304d30;
  --bg-light: #eef0e5;
  --shadow: #5c5c5c;
}
</style>

<style scoped>
.background {
  background-color: white;
  width: 30%;
  margin: 5% auto 0 auto;
  border-radius: 30px;
  padding: 2%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  color: var(--shadow);
  font-weight: 1500;
  font-size: 50px;
}

h2 {
  margin: 10% 10% 20% 10%;
  color: var(--shadow);
}

.ticket-id {
  display: flex;
  justify-content: center;
}

.copy {
  width: 5%;
  height: 5%;
}

.failure {
  margin: 10%;
  width: 20%;
}

p {
  color: var(--shadow);
  margin: 1%;
}

#qr {
  margin: 0 auto;
  padding: 10%;
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

button:hover,
.copy:hover {
  cursor: pointer;
}

.home {
  color: var(--primary-lighter);
  background-color: var(--bg-light);
}
</style>
