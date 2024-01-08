<script setup>
import TopBar from "/components/TopBar.vue";
import { useRouter } from 'vue-router';
// definePageMeta({ middleware: "auth" });

const { status, data } = useAuth();
const router = useRouter();

const searchClicked = ref(false);
const city = ref('');
const hours = ref(null);
const selectedVehicle = ref(null);
//todo
const vehicles = [
    { id: 1, name: 'Fiat Punto', plate: 'EL 11111' },
    { id: 2, name: 'VW Polo', plate: 'SCZ 2222' },
    { id: 3, name: 'Peugot 206', plate: 'CW 33333' }
]

function search() {
    if (city.value.trim() !== '' && hours.value !== null && selectedVehicle.value !== null) {
        router.push({
            path: '/finder/results',
            query: {
                city: city.value,
                hours: hours.value,
                car: selectedVehicle.value
            }
        })
    } else {
        searchClicked.value = true;
    }
}

</script>

<template>
    <TopBar />
    <div class="background">
        <h1>Parking finder</h1>

        <div class="search-wraper">
            <label class="label">City</label>
            <br>
            <input type="text" name="city" v-model="city" :class="{ 'error': city.trim() === '' && searchClicked }" />
        </div>

        <div class="search-wraper">
            <label class="label">Estimated hours amount</label>
            <br>
            <input type="number" name="hours" min="1" step="1" v-model="hours"
                :class="{ 'error': hours === null && searchClicked }" />
        </div>

        <div class="search-wraper">
            <label class="label">Vehicle</label>
            <select v-model="selectedVehicle" :class="{ 'error': selectedVehicle === null && searchClicked }">
                <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">{{ vehicle.name }} - {{
                    vehicle.plate }}</option>
            </select>
        </div>

        <button type="submit" @click="search">Search</button>

        <div class="info" v-if="searchClicked">
            Please fill in all fields!
        </div>
    </div>
</template>

<style>
:root {
    --primary-lighter: #304D30;
    --bg-light: #EEF0E5;
    --shadow: #5C5C5C;
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