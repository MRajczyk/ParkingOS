<script setup>
import TopBar from "/components/TopBar.vue";
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const { data } = useAuth();
const userId = ref(data.value.user.id);

const searchClicked = ref(false);
const city = ref('');
const hours = ref(null);

const selectedCity = ref(null);
const cities = ref([]);

const selectedCar = ref(null);
const cars = ref([]);

function search() {
    if (selectedCity.value !== null && hours.value !== null && selectedCar.value !== null) {
        router.push({
            path: '/finder/results',
            query: {
                city: selectedCity.value,
                hours: hours.value,
                car: selectedCar.value
            }
        })
    } else {
        searchClicked.value = true;
    }
}

onMounted(async () => {
    try {
        const response = await fetch('/api/search/cities');
        const data = await response.json();
        cities.value = data;
    } catch (error) {
        console.error('Error fetching cities:', error);
    }

    try {
        let params = new URLSearchParams([
            ["userId", userId.value],
        ]);

        const response = await fetch('/api/search/cars?userId=' + userId.value);
        const data = await response.json();
        cars.value = data;
    } catch (error) {
        console.error('Error fetching cars:', error);
    }
});

</script>

<template>
  <TopBar>
    <div class="background">
      <h1>Parking finder</h1>

        <div class="search-wraper">
            <label class="label">City</label>
            <br>
            <select v-model="selectedCity" :class="{ 'error': selectedCity === null && searchClicked }">
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
        </div>

      <div class="search-wraper">
        <label class="label">Estimated hours amount</label>
        <br />
        <input
          type="number"
          name="hours"
          min="1"
          step="1"
          v-model="hours"
          :class="{ error: hours === null && searchClicked }"
        />
      </div>

        <div class="search-wraper">
            <label class="label">Vehicle</label>
            <select v-model="selectedCar" :class="{ 'error': selectedCar === null && searchClicked }">
                <option v-for="car in cars" :key="car.id" :value="car.id">{{ car.name }} -
                    {{ car.registrationNumber }}</option>
            </select>
        </div>

      <button type="submit" @click="search">Search</button>

      <div class="info" v-if="searchClicked">Please fill in all fields!</div>
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

.search-wraper {
  margin: 10% auto 0 auto;
  width: 60%;
  text-align: left;
}

label {
  color: var(--shadow);
  padding-left: 5%;
}

input {
  padding: 3% 5%;
  border-radius: 16px;
  width: 89%;
  border: 1px solid var(--shadow);
  font-size: large;
}

select {
  padding: 3% 5%;
  border-radius: 16px;
  width: 100%;
  border: 1px solid var(--shadow);
  font-size: large;
}

button {
  margin-top: 10%;
  padding: 2%;
  border-radius: 16px;
  width: 40%;
  background-color: var(--primary-lighter);
  color: var(--bg-light);
  font-size: larger;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  border: 0;
}

button:hover {
  cursor: pointer;
}

.error {
  border: 2px solid red;
}

.info {
  margin-top: 2%;
  color: red;
}
</style>
