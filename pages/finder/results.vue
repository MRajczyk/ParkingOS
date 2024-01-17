<script setup>
import TopBar from "/components/TopBar.vue";
import { useRoute } from "vue-router";
// definePageMeta({ middleware: "auth" });

const route = useRoute();

const city = route.query.city;
const hours = route.query.hours;
const car = route.query.car;

const parkings = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('/api/search/getParkings?city=' + city);
        const data = await response.json();
        parkings.value = data;
    } catch (error) {
        console.error('Error fetching parkings:', error);
    }
});

function getPrice(id) {
  return 0;
}

</script>

<template>
  <TopBar>
    <div class="background">
      <h1>Car parks found</h1>

    <div class="car-parks-wraper">
      <div class="car-parks" v-for="parking in parkings" :key="parking.id" :value="parking.id">
        <div class="parking">
          Name: {{ parking.name }} <br>
          Address: {{ parking.city }}, {{ parking.address }} <br>
          Price: {{ getPrice(parking.id) }} PLN
        </div>
        <NuxtLink :to="{ path: '/ticket', query: { parkingId: parking.id, car: car }}" class="link">
          <button class="enter">Enter</button>
        </NuxtLink>
      </div>
    </div>

      <NuxtLink to="/finder/search">
        <button>Back</button>
      </NuxtLink>
    </div>
  </TopBar>
</template>

<style>
:root {
  --primary-lighter: #304d30;
  --light-green: #a6be8d;
  --bg-light: #eef0e5;
  --shadow: #5c5c5c;
}
</style>

<style scoped>
* {
  scrollbar-width: auto;
  scrollbar-color: var(--primary-lighter) white;
}

.background {
  background-color: white;
  width: 40%;
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

.car-parks-wraper {
  overflow: auto;
  /* todo */
  max-height: 450px;
  width: 80%;
  margin: 0 auto;
}

.car-parks {
  margin: 5% auto;
  padding: 2% 3%;
  border-radius: 20px;
  border: 1px solid var(--shadow);
  text-align: left;
  font-size: large;
  display: flex;
}

.parking {
  width: 70%;
}

button {
  margin-top: 5%;
  padding: 2%;
  border-radius: 16px;
  width: 30%;
  background-color: var(--primary-lighter);
  color: var(--bg-light);
  font-size: larger;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  border: 0;
}

button:hover {
  cursor: pointer;
}

.link {
  width: 30%;
}

.enter {
  margin: 8% 20%;
  padding: 5%;
  width: 60%;
  background-color: var(--light-green);
}

*::-webkit-scrollbar {
  width: 16px;
}

*::-webkit-scrollbar-track {
  background: white;
}

*::-webkit-scrollbar-thumb {
  background-color: var(--primary-lighter);
  border-radius: 10px;
  border: 3px solid white;
}
</style>
