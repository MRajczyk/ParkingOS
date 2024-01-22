<script setup>
import TopBar from "/components/TopBar.vue";
import CarContainer from "/components/account/cars/CarContainer.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });
import { watch } from "vue";
import debounce from "lodash.debounce";

const { status, data } = useAuth();

const filterInput = ref("");

let carsInitial;
const carsFiltered = ref([]);

onMounted(() => {
  axios
    .get(`http://localhost:3000/api/cars/${data.value.user.id}`)
    .then((response) => {
      carsInitial = response.data.data;
      carsFiltered.value = carsInitial;
    })
    .catch((error) => {
      alert(error);
    });
});

function removeCar(carId) {
  axios
    .delete(`http://localhost:3000/api/cars/delete/${carId}`)
    .then((_response) => {
      carsFiltered.value = carsFiltered.value.filter((car) => car.id !== carId);
    })
    .catch((error) => {
      console.log(error);
      alert(error.response.statusText);
    });
}

function filterCars(inputValue) {
  if (inputValue === "") {
    carsFiltered.value = carsInitial;
  } else {
    carsFiltered.value = carsInitial.filter(
      (car) =>
        car.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        car.registrationNumber.toLowerCase().includes(inputValue.toLowerCase())
    );
  }
}

watch(
  filterInput,
  debounce(() => {
    filterCars(filterInput.value);
  }, 500)
);
</script>

<template>
  <TopBar>
    <div class="profile">
      <div class="profile-nav-buttons">
        <NuxtLink to="/account/user-data" class="profile-nav-button"
          >User data
        </NuxtLink>
        <NuxtLink to="/account/balance" class="profile-nav-button"
          >Balance
        </NuxtLink>
        <NuxtLink
          to="/account/cars"
          class="profile-nav-button"
          style="background-color: var(--primary)"
          >Cars
        </NuxtLink>
      </div>
      <div class="cars-container">
        <NuxtLink to="/account/car-add" class="add-car-button"
          >Add car</NuxtLink
        >
        <input
          name="filterInput"
          v-model="filterInput"
          class="car-search-input"
          placeholder="Search"
          type="text"
        />
        <CarContainer
          v-for="car in carsFiltered"
          :id="car.id"
          :name="car.name"
          :licensePlateNumber="car.registrationNumber"
          :discardCallback="removeCar"
        />
      </div>
    </div>
  </TopBar>
</template>

<style scoped>
.cars-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  margin-bottom: 100px;
  gap: 20px;
}

.cars-container::-webkit-scrollbar {
  width: 10px;
  margin-left: 10px;
}

.cars-container::-webkit-scrollbar-thumb {
  background-color: var(--primary-lighter);
  border-radius: 20px;
  border: 6px solid transparent;
}

.cars-container::-webkit-scrollbar-track {
  background-color: #eef0e5;
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

.profile {
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: calc(100% - 60px);
}

.car-search-input {
  display: block;
  width: 170px;
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
  .profile-nav-buttons {
    flex-direction: row;
    padding: 50px 0px;
    gap: 20px;
  }

  .car-search-input {
    width: 410px;
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

.add-car-button {
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
