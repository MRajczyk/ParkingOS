<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });

const route = useRoute();
const parkingId = route.params.parkingId;

const costName = ref("");
const isCostNameError = ref(false);
const costAmount = ref("");
const isCostAmountError = ref(false);

const postSuccess = ref("");
const postError = ref("");


function addNewCost() {
  postSuccess.value = "";
  postError.value = "";
  isCostNameError.value = false;
  isCostAmountError.value = false;

  if (costName.value.length === 0) {
    isCostNameError.value = true;
  }
  if (costAmount < 0) {
    isCostAmountError.value = true;
    return;
  }
  axios
    .post(`http://localhost:3000/api/admin/costs`, {
      parkingId: parkingId,
      costName: costName.value,
      costValue: costAmount.value,
    })
    .then((response) => {
      costName.value = "";
      costAmount.value = "";
      postSuccess.value = response.data.statusMessage;
    })
    .catch((error) => {
      postError.value = error.response.data.statusMessage;
    });
}
</script>

<template>
  <TopBar>
    <div class="add-cost-content">
      <form v-on:submit.prevent="onsubmit" class="add-cost-form" method="POST" @submit="addNewCost()">
        <h3 class="add-cost-heading">Add cost</h3>
        <div class="setting-wrapper">
          <label class="label">Cost name</label>
          <input form="none" type="text" name="cost-name" v-model="costName" class="add-cost-input" />
          <span class="info-span" style="color: red" v-if="isCostNameError">
            Incorrect cost name
          </span>
        </div>
        <div class="setting-wrapper">
          <label class="label">Cost amount in PLN</label>
          <input form="none" type="number" step="0.5" name="cost-amount" v-model="costAmount" class="add-cost-input" />
          <span class="info-span" style="color: red" v-if="isCostAmountError">
            Incorrect cost amount
          </span>
        </div>
        <span class="info-span" style="color: red" v-if="postError.length > 0">
          {{ postError }}
        </span>
        <span class="info-span" style="color: green" v-if="postSuccess.length > 0">
          {{ postSuccess }}
        </span>

        <div class="add-cost-navigation-buttons-container">
          <NuxtLink type="submit" :to="`/admin/costs/${parkingId}`" class="add-cost-form-button">Back</NuxtLink>
          <button type="submit" class="add-cost-form-button">Add</button>
        </div>
      </form>
    </div>
  </TopBar>
</template>

<style scoped>
.add-cost-navigation-buttons-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.add-cost-heading {
  color: var(--primary-lighter);
  font-size: 40px;
}

.info-span {
  display: block;
  font-size: 13px;
  margin-top: 3px;
}

.add-cost-input {
  display: block;
  width: calc(100% - 12px);
  height: 36px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
  background-color: transparent;
}

.add-cost-content {
  display: flex;
  width: 100%;
  height: 100%;
  color: #163020;
  text-align: center;
  justify-content: center;
  padding-top: 40px;
  background-color: var(--bg-light);
}

.add-cost-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 30px;
  padding: 20px;
  width: 200px;
  height: fit-content;
  gap: 20px;
}

@media screen and (min-width: 700px) {
  .add-cost-form {
    padding: 40px;
    width: 360px;
  }

  .add-cost-navigation-buttons-container {
    flex-direction: row;
  }
}

.add-cost-form-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: 150px;
  height: 40px;
  background-color: #163020;
  color: #fff;
  border-radius: 20px;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
}

.setting-wrapper {
  width: 100%;
}

.label {
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
