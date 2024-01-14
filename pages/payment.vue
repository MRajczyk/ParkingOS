<script setup>
import TopBar from "/components/TopBar.vue";
// definePageMeta({ middleware: "auth" });

const { status, data } = useAuth();

const stage = ref(0);
const isSuccess = ref(false);
const cost = ref(21.31);
const ticketId = ref(null);
//todo
const tickets = [{ id: "P1C1S10801231010" }, { id: "2" }, { id: "3" }];
</script>

<template>
  <TopBar>
    <div v-if="stage === 0" class="background">
      <h1>Payment</h1>

      <div class="search-wraper">
        <label class="label">Ticket ID</label>
        <select v-model="ticketId">
          <option v-for="ticket in tickets" :key="ticket.id" :value="ticket.id">
            {{ ticket.id }}
          </option>
        </select>
      </div>

      <p class="or">Or</p>

      <div class="search-wraper">
        <label class="label">Ticket ID</label>
        <input type="file" @change="handleFileChange" accept=".png" />
      </div>

      <button @click="stage++" :disabled="ticketId === null">
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
      <button @click="stage++">Pay</button>
    </div>

    <div v-else-if="stage === 2 && isSuccess" class="background">
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
      <h2>You don’t have enough funds in your account. Add funds or resign.</h2>
      <NuxtLink to="/">
        <button class="home">Home</button>
      </NuxtLink>
      <NuxtLink to="/">
        <button>Add funds</button>
      </NuxtLink>
    </div>
  </TopBar>
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
