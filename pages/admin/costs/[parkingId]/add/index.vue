<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });

const calculateYears = () => {
  const currentYear = new Date().getFullYear();

  const tempYears = [];
  let yearToAddToAnArray = 2020;
  while (yearToAddToAnArray <= currentYear) {
    tempYears.push(yearToAddToAnArray);
    yearToAddToAnArray++;
  }
  return tempYears;
};

const years = calculateYears();
const yearsEnd = calculateYears();
yearsEnd.push(undefined);

const monthsStart = [
  { idx: 0, name: "January" },
  { idx: 1, name: "February" },
  { idx: 2, name: "March" },
  { idx: 3, name: "April" },
  { idx: 4, name: "May" },
  { idx: 5, name: "June" },
  { idx: 6, name: "July" },
  { idx: 7, name: "August" },
  { idx: 8, name: "September" },
  { idx: 9, name: "October" },
  { idx: 10, name: "November" },
  { idx: 11, name: "December" },
];

const monthsEnd = [
  { idx: 0, name: "January" },
  { idx: 1, name: "February" },
  { idx: 2, name: "March" },
  { idx: 3, name: "April" },
  { idx: 4, name: "May" },
  { idx: 5, name: "June" },
  { idx: 6, name: "July" },
  { idx: 7, name: "August" },
  { idx: 8, name: "September" },
  { idx: 9, name: "October" },
  { idx: 10, name: "November" },
  { idx: 11, name: "December" },
  { id: 12, name: "" },
];

const route = useRoute();
const parkingId = route.params.parkingId;

const costName = ref("");
const isCostNameError = ref(false);
const costAmount = ref("");
const isCostAmountError = ref(false);
const isCyclic = ref(false);
const startMonth = ref(monthsStart[new Date().getMonth()]);
const startYear = ref(new Date().getFullYear());
const isStartDateError = ref(false);
const endMonth = ref(undefined);
const endYear = ref(undefined);
const isEndDateError = ref(false);

const postSuccess = ref("");
const postError = ref("");

function addNewCost() {
  postSuccess.value = "";
  postError.value = "";
  isCostNameError.value = false;
  isCostAmountError.value = false;
  isStartDateError.value = false;
  isEndDateError.value = false;

  if (costName.value.length === 0) {
    isCostNameError.value = true;
    return;
  }

  if (!costAmount.value || costAmount.value < 0) {
    isCostAmountError.value = true;
    return;
  }

  //handle no start date
  if (!startMonth.value || !startYear.value) {
    isStartDateError.value = true;
    return;
  }

  //handle cyclic and missing either year or month (have to check for month with empty name)
  if (
    (isCyclic.value &&
      endYear.value &&
      (!endMonth.value.name || (endMonth.value && !endMonth.value.name))) ||
    (isCyclic.value && !endYear.value && endMonth.value && endMonth.value.name)
  ) {
    isEndDateError.value = true;
    return;
  }

  //handle start date >= end date
  if (
    isCyclic.value &&
    endMonth.value &&
    new Date(startYear.value, startMonth.value.idx, 1).getTime() >=
      new Date(endYear.value, endMonth.value.idx, 1).getTime()
  ) {
    isEndDateError.value = true;
    return;
  }

  axios
    .post(`http://localhost:3000/api/admin/costs`, {
      parkingId: parkingId,
      costName: costName.value,
      costValue: costAmount.value,
      isCyclic: isCyclic.value,
      startMonth: startMonth.value.idx,
      startYear: startYear.value,
      endMonth: endMonth.value ? endMonth.value.idx : undefined,
      endYear: endYear.value,
    })
    .then((response) => {
      costName.value = "";
      costAmount.value = undefined;
      isCyclic.value = false;
      startMonth.value = undefined;
      startYear.value = undefined;
      endMonth.value = undefined;
      endYear.value = undefined;
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
      <form
        v-on:submit.prevent="onsubmit"
        class="add-cost-form"
        method="POST"
        @submit="addNewCost()"
      >
        <h3 class="add-cost-heading">Add cost</h3>
        <div class="setting-wrapper">
          <label class="label">Cost name</label>
          <input
            form="none"
            type="text"
            name="cost-name"
            v-model="costName"
            class="add-cost-input"
          />
          <span class="info-span" style="color: red" v-if="isCostNameError">
            Incorrect cost name
          </span>
        </div>
        <div class="setting-wrapper">
          <label class="label">Cost amount in PLN</label>
          <input
            form="none"
            type="number"
            step="0.5"
            name="cost-amount"
            v-model="costAmount"
            class="add-cost-input"
          />
          <span class="info-span" style="color: red" v-if="isCostAmountError">
            Incorrect cost amount
          </span>
        </div>
        <div
          class="setting-wrapper"
          style="display: flex; align-items: start; flex-direction: column"
        >
          <label class="label">Cyclic cost</label>
          <input
            form="none"
            type="checkbox"
            style="margin: 10px; margin-bottom: 0px; height: 20px; width: 20px"
            v-model="isCyclic"
          />
        </div>
        <div class="setting-wrapper">
          <div style="display: flex; flex-direction: row; gap: 10px">
            <div>
              <label class="label">Month start</label>
              <select
                v-model="startMonth"
                class="add-cost-input"
                style="width: 120px"
              >
                <option
                  v-for="month in monthsStart"
                  :key="month.name + `start`"
                  :value="month"
                >
                  {{ month.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="label">Year start</label>
              <select
                v-model="startYear"
                class="add-cost-input"
                style="width: 80px"
              >
                <option
                  v-for="year in years"
                  :key="year + `start`"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
          <span class="info-span" style="color: red" v-if="isStartDateError">
            Select correct date
          </span>
        </div>
        <div class="setting-wrapper" v-if="isCyclic">
          <div style="display: flex; flex-direction: row; gap: 10px">
            <div>
              <label class="label">Month end</label>
              <select
                v-model="endMonth"
                class="add-cost-input"
                style="width: 120px"
              >
                <option
                  v-for="month in monthsEnd"
                  :key="month.name + `end`"
                  :value="month"
                >
                  {{ month.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="label">Year end</label>
              <select
                v-model="endYear"
                class="add-cost-input"
                style="width: 80px"
              >
                <option
                  v-for="year in yearsEnd"
                  :key="year + `end`"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
          <span class="info-span" style="color: red" v-if="isEndDateError">
            Select correct date
          </span>
        </div>
        <span class="info-span" style="color: red" v-if="postError.length > 0">
          {{ postError }}
        </span>
        <span
          class="info-span"
          style="color: green"
          v-if="postSuccess.length > 0"
        >
          {{ postSuccess }}
        </span>

        <div class="add-cost-navigation-buttons-container">
          <NuxtLink
            type="submit"
            :to="`/admin/costs/${parkingId}`"
            class="add-cost-form-button"
            >Back</NuxtLink
          >
          <button type="submit" class="add-cost-form-button">Add</button>
        </div>
      </form>
    </div>
  </TopBar>
</template>

<style scoped>
.add-cost-navigation-buttons-container {
  display: flex;
  flex-direction: column-reverse;
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
