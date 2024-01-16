<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });

const route = useRoute();
const carId = route.params.carId;
const { data } = useAuth();

const name = ref("");
const isNameError = ref(false);
const licensePlateNumber = ref("");
const isLicensePlateNumberError = ref(false);

axios
  .get("http://localhost:3000/api/cars/edit/" + carId)
  .then((response) => {
    name.value = response.data.data.name;
    licensePlateNumber.value = response.data.data.registrationNumber;
  })
  .catch((error) => {
    alert(error);
  });

const putSuccess = ref("");
const putError = ref("");

function update() {
  putSuccess.value = "";
  putError.value = "";
  isNameError.value = false;
  isLicensePlateNumberError.value = false;

  if (name.value.length === 0) {
    isNameError.value = true;
  }
  if (licensePlateNumber.value.length < 3) {
    isLicensePlateNumberError.value = true;
    return;
  }
  axios
    .put(`http://localhost:3000/api/cars/edit`, {
      userId: data.value.user.id,
      name: name.value,
      carId: carId,
      licensePlateNumber: licensePlateNumber.value,
    })
    .then((response) => {
      putSuccess.value = response.data.statusMessage;
    })
    .catch((error) => {
      putError.value = error.response.data.statusMessage;
    });
}
</script>

<template>
  <TopBar>
    <div class="add-car-content">
      <form
        v-on:submit.prevent="onsubmit"
        class="add-car-form"
        method="PUT"
        @submit="update()"
      >
        <h3 class="add-car-heading">Edit car info</h3>
        <div class="setting-wrapper">
          <label class="label">Car name</label>
          <input
            form="none"
            type="text"
            name="name"
            v-model="name"
            class="add-car-input"
          />
          <span class="info-span" style="color: red" v-if="isNameError">
            Incorrect car name
          </span>
        </div>
        <div class="setting-wrapper">
          <label class="label">License plate number</label>
          <input
            form="none"
            type="text"
            name="licensePlateNumber"
            v-model="licensePlateNumber"
            class="add-car-input"
          />
          <span
            class="info-span"
            style="color: red"
            v-if="isLicensePlateNumberError"
          >
            Incorrect license plate number
          </span>
        </div>
        <span class="info-span" style="color: red" v-if="putError.length > 0">
          {{ putError }}
        </span>
        <span
          class="info-span"
          style="color: green"
          v-if="putSuccess.length > 0"
        >
          {{ putSuccess }}
        </span>
        <div class="add-car-navigation-buttons-container">
          <button type="submit" class="add-car-form-button">Save</button>
          <NuxtLink type="submit" to="/account/cars" class="add-car-form-button"
            >Back</NuxtLink
          >
        </div>
      </form>
    </div>
  </TopBar>
</template>

<style scoped>
.add-car-navigation-buttons-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.add-car-heading {
  color: var(--primary-lighter);
  font-size: 40px;
}

.info-span {
  display: block;
  font-size: 13px;
  margin-top: 3px;
}

.add-car-input {
  display: block;
  width: calc(100% - 12px);
  height: 36px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
  background-color: transparent;
}

.add-car-content {
  display: flex;
  width: 100%;
  height: 100%;
  color: #163020;
  text-align: center;
  justify-content: center;
  padding-top: 40px;
  background-color: var(--bg-light);
}

.add-car-form {
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
  .add-car-form {
    padding: 40px;
    width: 360px;
  }

  .add-car-navigation-buttons-container {
    flex-direction: row;
  }
}

.add-car-form-button {
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
