<script setup>
import TopBar from "/components/TopBar.vue";
import CostContainer from "/components/admin/costs/CostContainer.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });
import { watch } from "vue";
import debounce from "lodash.debounce";

const route = useRoute();
const parkingId = route.params.parkingId;

const filterInput = ref("");

let costsInitial;
const costsFiltered = ref([]);

onMounted(() => {
  axios
    .get(`http://localhost:3000/api/admin/costs/${parkingId}`)
    .then((response) => {
      costsInitial = response.data.data;
      costsFiltered.value = costsInitial;
    })
    .catch((error) => {
      alert(error);
    });
});

function removeCost(costId) {
  axios
    .delete(`http://localhost:3000/api/admin/costs/delete/${costId}}`)
    .then((_response) => {
      costsFiltered.value = costsFiltered.value.filter(
        (cost) => cost.id !== costId
      );
    })
    .catch((error) => {
      console.log(error);
      alert(error.response.statusMessage);
    });
}

function filterCosts(inputValue) {
  if (inputValue === "") {
    costsFiltered.value = costsInitial;
  } else {
    costsFiltered.value = costsInitial.filter((cost) =>
      cost.costName.toLowerCase().includes(inputValue.toLowerCase())
    );
  }
}

watch(
  filterInput,
  debounce(() => {
    filterCosts(filterInput.value);
  }, 500)
);
</script>

<template>
  <TopBar>
    <div class="costs">
      <div class="costs-container">
        <div class="costs-buttons-container">
          <NuxtLink to="/admin/parkings" class="add-cost-button">Back</NuxtLink>
          <NuxtLink
            :to="`/admin/costs/${parkingId}/add`"
            class="add-cost-button"
            >Add cost</NuxtLink
          >
        </div>
        <input
          name="filterInput"
          v-model="filterInput"
          class="cost-search-input"
          placeholder="Search"
          type="text"
        />
        <CostContainer
          v-for="cost in costsFiltered"
          :costId="Number.parseInt(cost.id)"
          :parkingId="Number.parseInt(parkingId)"
          :costName="cost.costName"
          :costValue="cost.costValue"
          :discardCallback="removeCost"
        />
      </div>
    </div>
  </TopBar>
</template>

<style scoped>
.costs-buttons-container {
  display: flex;
  margin-top: 100px;
  flex-direction: column;
  gap: 6px;
}
.costs-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  margin-bottom: 100px;
  gap: 20px;
}

.costs-container::-webkit-scrollbar {
  width: 10px;
  margin-left: 10px;
}

.costs-container::-webkit-scrollbar-thumb {
  background-color: var(--primary-lighter);
  border-radius: 20px;
  border: 6px solid transparent;
}

.costs-container::-webkit-scrollbar-track {
  background-color: #eef0e5;
}

.costs {
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: calc(100% - 60px);
}

.cost-search-input {
  display: block;
  width: 206px;
  min-height: 36px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
  background-color: transparent;
  border: 2px solid var(--primary-lighter);
  color: var(black);
  font-weight: 500;
  background-color: white;
}
@media screen and (min-width: 700px) {
  .cost-search-input {
    width: 434px;
  }

  .costs-buttons-container {
    flex-direction: row;
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

.add-cost-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220px;
  min-height: 50px;
  background-color: var(--primary-lighter);
  color: #fff;
  border: 0;
  border-radius: 25px;
  font-weight: 600;
  font-size: 24px;
  cursor: pointer;
  align-self: center;
  text-decoration: none;
}
</style>
