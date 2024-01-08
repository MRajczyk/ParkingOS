<script setup>
import TopBar from "/components/TopBar.vue";
import { useRoute } from 'vue-router';
// definePageMeta({ middleware: "auth" });

const route = useRoute();
const { status, data } = useAuth();

const city = route.query.city;
const hours = route.query.hours;
const car = route.query.car;

const parkings = [
  { id: 1, name: 'Parking 1', address: 'Łódź, Główna 1', price: 10 },
  { id: 2, name: 'Parking 2', address: 'Łódź, Główna 2', price: 40 },
  { id: 3, name: 'Parking 3', address: 'Łódź, Główna 3', price: 10 },
  { id: 4, name: 'Parking 4', address: 'Łódź, Główna 4', price: 40 },
  { id: 5, name: 'Parking 5', address: 'Łódź, Główna 5', price: 50 }
]

</script>

<template>
  <TopBar />
  <div class="background">
    <h1>Car parks found</h1>

    <div class="car-parks-wraper">
      <div class="car-parks" v-for="parking in parkings" :key="parking.id" :value="parking.id">
        <div class="parking">
          Name: {{ parking.name }} <br>
          Address: {{ parking.address }} <br>
          Price: {{ parking.price }} PLN
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
</template>

<style>
:root {
  --primary-lighter: #304D30;
  --light-green: #A6BE8D;
  --bg-light: #EEF0E5;
  --shadow: #5C5C5C;
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