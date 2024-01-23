<script setup>
import TopBar from "/components/TopBar.vue";
import { QrcodeDropZone } from "vue-qrcode-reader";
import axios from "axios";

const { data } = useAuth();
const userId = ref(data.value.user.id);

let stage = ref(0);
const isSuccess = ref(false);
const ticketId = ref(null);
const tickets = ref([]);
let ticket = ref(null);
let cost = ref(0);
let isLoading = ref(true);

async function onDetect(codes) {
  try {
    if (
      typeof tickets.value.find(
        (ticket) => ticket.ticket === codes[0].rawValue
      ) === "undefined"
    ) {
      throw { error: "can't find ticket" };
    }

    ticketId.value = codes[0].rawValue;
    console.log(ticketId.value);
  } catch (error) {
    if (error.error == "can't find ticket") {
      alert("It's not your ticket!");
    } else {
      alert("Failed to load ticket info. Choose ticket from list.");
    }
  }
}

onMounted(async () => {
  axios
    .get("/api/ticket/tickets", {
      params: { id: userId.value },
    })
    .then((response) => {
      tickets.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching pending tickets:", error);
    });
});

function getCost() {
  let chargePlan = ref(null);
  ticket = tickets.value.find((ticket) => ticket.ticket === ticketId.value);

  axios
    .get("/api/ticket/tariff", {
      params: { parkingId: ticket.parkingId },
    })
    .then((response) => {
      chargePlan.value = response.data;

      axios
        .get("/api/ticket/parking-session", {
          params: { id: ticketId.value },
        })
        .then((response2) => {
          const entranceDate = new Date(response2.data.entranceDate);
          const currentDate = new Date();

          const timeDifference = currentDate - entranceDate;

          const hours = Math.floor(timeDifference / (1000 * 60 * 60));

          for (let ctr = 0; ctr <= hours; ctr++) {
            const hour = (entranceDate.getHours() + ctr) % 24;

            if (
              hour >= chargePlan.value.nightStart ||
              hour < chargePlan.value.nightEnd
            ) {
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

          stage.value++;
        })
        .catch((error) => {
          console.error("Error fetching pending tickets:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching charge plan:", error);
      return null;
    });
}

function pay() {
  isLoading.value = true;
  axios
    .post("/api/ticket/pay", {
      id: data.value.user.id,
      amount: cost.value,
    })
    .then((response) => {
      isSuccess.value = true;
      isLoading.value = false;

      const ticket = tickets.value.find(
        (ticket) => ticket.ticket === ticketId.value
      );

      axios
        .patch("/api/ticket/close-reservation", {
          ticketId: ticket.id,
          cost: cost.value,
          userId: +data.value.user.id,
        })
        .then((response) => {
          console.log(response.data.statusMessage);
        })
        .catch((error) => {
          console.log(error.response.data.statusMessage);
        });
      axios
        .patch("/api/ticket/car-state", {
          id: ticket.carId,
          isParked: "false",
        })
        .then((response) => {
          console.log(response.data.statusMessage);
        })
        .catch((error) => {
          console.log(error.response.data.statusMessage);
        });

      axios
        .patch("/api/ticket/space-state", {
          id: ticket.spot,
          ocuppied: "false",
        })
        .then((response) => {
          console.log(response.data.statusMessage);
        })
        .catch((error) => {
          console.log(error.response.data.statusMessage);
        });

      stage.value++;
    })
    .catch((error) => {
      isSuccess.value = false;
      stage.value++;
      console.log(error);
    });
}
</script>

<template>
  <div style="background-color: var(--bg-light); height: 100%">
    <TopBar>
      <div v-if="stage === 0" class="background">
        <h1>Payment</h1>

        <div class="search-wraper">
          <label class="label">Ticket ID</label>
          <select v-model="ticketId">
            <option
              v-for="ticket in tickets"
              :key="ticket.id"
              :value="ticket.ticket"
            >
              {{ ticket.ticket }}
            </option>
          </select>
        </div>

        <p class="or">Or</p>

        <qrcode-drop-zone class="drag" @detect="onDetect">
          Drop your QR code here
        </qrcode-drop-zone>

        <button @click="getCost" :disabled="ticketId === null">
          Check ticket
        </button>
      </div>

      <div v-else-if="stage === 1" class="background">
        <h1>Payment</h1>

        <div class="search-wraper">
          <label class="label">Ticket ID</label>
          <br />
          <div class="ticket-id">{{ ticketId }}</div>
        </div>

        <div class="amount-wraper">
          <h1 class="cost">Amount due:</h1>
          <h1 class="cost">{{ cost }} PLN</h1>
        </div>

        <button class="home" @click="stage--">Back</button>
        <button @click="pay">Pay</button>
      </div>

      <div
        v-else-if="stage === 2 && isSuccess && !isLoading"
        class="background"
      >
        <h1>Payment successful</h1>
        <img src="/images/success.png" class="failure" />
        <div class="payment-info">
          <p>Ticket id:</p>
          <p class="value">{{ ticketId }}</p>
        </div>
        <div class="payment-info">
          <h2 class="h2-split">Amount paid:</h2>
          <h2 class="value">{{ cost }} PLN</h2>
        </div>
        <NuxtLink to="/">
          <button>Home</button>
        </NuxtLink>
      </div>

      <div v-else-if="stage === 2 && !isSuccess" class="background">
        <h1>Insufficient funds</h1>
        <img src="/images/failure.png" class="failure" />
        <h2>
          You don’t have enough funds in your account. Add funds or resign.
        </h2>
        <NuxtLink to="/">
          <button class="home">Home</button>
        </NuxtLink>
        <NuxtLink to="/account/balance">
          <button>Add funds</button>
        </NuxtLink>
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

.cost {
  font-weight: 500;
  font-size: 30px;
}

h2 {
  margin-top: 10%;
  color: var(--shadow);
}

.h2-split {
  width: 50%;
}

.failure {
  margin: 10%;
  width: 20%;
}

p {
  margin: 1%;
  width: 50%;
  color: var(--shadow);
}

.or {
  margin: 10% 0%;
  width: 100%;
}

button {
  margin: 20% 4% 0% 4%;
  padding: 2%;
  border-radius: 16px;
  width: 36%;
  background-color: var(--primary-lighter);
  color: var(--bg-light);
  font-size: larger;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  border: 0;
}

button:hover {
  cursor: pointer;
}

button:disabled {
  background-color: var(--shadow);
  cursor: auto;
}

.drag {
  border-radius: 16px;
  border: 0;
  background-color: var(--bg-light);
  padding: 10%;
}

.home {
  color: var(--primary-lighter);
  background-color: var(--bg-light);
}

.payment-info {
  display: flex;
  text-align: left;
  margin: 0% 10%;
}

.value {
  width: 50%;
  text-align: right;
}

.search-wraper {
  margin: 10% auto 0 auto;
  width: 60%;
  text-align: left;
}

label {
  color: var(--shadow);
  padding-left: 5%;
}

select {
  padding: 3% 5%;
  border-radius: 16px;
  width: 100%;
  border: 1px solid var(--shadow);
  font-size: large;
}

input,
.ticket-id {
  padding: 3% 5%;
  border-radius: 16px;
  width: 89%;
  border: 1px solid var(--shadow);
  font-size: large;
}

.amount-wraper {
  margin-top: 20%;
  margin-bottom: 10%;
}
</style>
