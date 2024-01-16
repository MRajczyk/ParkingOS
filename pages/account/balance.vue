<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });

const { status, data } = useAuth();

const amount = ref("");
const startingAmount = ref("");
const isAmountError = ref(false);
const operationSuccess = ref("");
const operationError = ref("");

axios
  .get("http://localhost:3000/api/funds/" + data.value.user.id)
  .then((response) => {
    console.log(response);
    startingAmount.value = response.data.data;
  })
  .catch((error) => {
    alert(error);
  });

function addFunds() {
  isAmountError.value = false;
  operationSuccess.value = "";
  operationError.value = "";

  if (amount.value.length === 0 || amount.value <= 0) {
    isAmountError.value = true;
    return;
  }

  axios
    .post("http://localhost:3000/api/funds", {
      id: data.value.user.id,
      amount: amount.value,
    })
    .then((response) => {
      operationSuccess.value = response.data.statusMessage;
      startingAmount.value = response.data.newBalance;
      amount.value = "";
    })
    .catch((error) => {
      operationError.value = error.response.data.statusMessage;
    });
}
</script>

<template>
  <TopBar>
    <div class="profile">
      <div class="profile-nav-buttons">
        <NuxtLink to="/account/user-data" class="profile-nav-button"
          >User data
        </NuxtLink>
        <NuxtLink
          to="/account/balance"
          class="profile-nav-button"
          style="background-color: var(--primary)"
          >Balance
        </NuxtLink>
        <NuxtLink to="/account/cars" class="profile-nav-button">Cars </NuxtLink>
      </div>
      <div class="profile-form-container">
        <form
          class="profile-form"
          v-on:submit.prevent="onsubmit"
          method="POST"
          @submit="addFunds()"
        >
          <label class="profile-label">Current balance</label>
          <span
            type="text"
            name="name"
            placeholder="Name"
            class="profile-input"
            style="display: flex; align-items: center; justify-content: start"
          >
            {{ startingAmount }}
          </span>
          <label class="profile-label">Amount to deposit</label>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            class="profile-input"
            v-model="amount"
          />
          <span class="info-span" style="color: red" v-if="isAmountError">
            Enter valid amount
          </span>
          <span
            class="info-span"
            style="color: red"
            v-if="operationError.length > 0"
          >
            {{ operationError }}
          </span>
          <span
            class="info-span"
            style="color: green; align-self: center"
            v-if="operationSuccess.length > 0"
          >
            {{ operationSuccess }}
          </span>
          <button type="submit" class="profile-form-button">Deposit</button>
        </form>
      </div>
    </div>
  </TopBar>
</template>

<style scoped>
.profile-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 40px;
  padding: 40px;
}
.profile-nav-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0px;
  gap: 16px;
  width: 100%;
}

.profile-nav-button {
  border-radius: 20px;
  text-decoration: none;
  text-align: center;
  width: 150px;
  padding: 10px 0px;
  color: white;
  background-color: var(--bg-darker);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
}

.info-span {
  display: block;
  font-size: 13px;
  margin-top: 3px;
}
.profile {
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}

.profile-form {
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

@media screen and (min-width: 700px) {
  .profile-nav-buttons {
    flex-direction: row;
    padding: 50px 0px;
    gap: 20px;
  }

  .profile-form {
    width: 360px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
}

.alert-error {
  color: #ff0000;
  display: block;
  text-align: center;
  font-weight: 500;
  margin-top: 20px;
  font-size: 14px;
  width: 100%;
  height: 100%;
}

.profile-form-button {
  width: 220px;
  height: 50px;
  background-color: var(--primary-lighter);
  color: #fff;
  border: 0;
  border-radius: 25px;
  margin-top: 20px;
  font-weight: 600;
  font-size: 24px;
  cursor: pointer;
  align-self: center;
}

.profile-link {
  color: var(--primary-lighter);
  align-self: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-decoration-line: underline;
}

.profile-input {
  display: block;
  width: calc(100% - 12px);
  height: 36px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
  background-color: transparent;
}

.profile-input:focus {
  outline: none !important;
  border: 2px solid var(--primary-lighter);
}

.profile-label {
  margin-top: 20px;
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
