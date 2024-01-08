<script setup>
import TopBar from "/components/TopBar.vue";
import { useRoute } from 'vue-router';
// definePageMeta({ middleware: "auth" });

const route = useRoute();
const { status, data } = useAuth();

const parkingId = route.query.parkingId;
// todo
const parking = ref("Parking 1");
const spot = 1;
const car = route.query.car;
const isBanned = ref(false);
const ticketId = ref('P' + parkingId + 'C' + car + 'S' + spot + getFormattedDate());

function getFormattedDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear() - 2000;
    const month = padZero(currentDate.getMonth() + 1);
    const day = padZero(currentDate.getDate());
    const hours = padZero(currentDate.getHours());
    const minutes = padZero(currentDate.getMinutes());

    return year + month + day + hours + minutes;
}

function padZero(value) {
    return value < 10 ? '0' + value : value;
}

function copy() {
    navigator.clipboard.writeText(ticketId.value);
    alert("ID coppied");
}

function download() {
    const link = document.createElement('a');
    link.href = '/images/qr.png';
    link.download = ticketId.value + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

</script>

<template>
    <TopBar />
    <div v-if="!isBanned" class="background">
        <h1>Entrance ticket</h1>

        <!-- todo -->
        <img src="/images/qr.png" class="qr">

        <div class="ticket-id">
            <p>ID: {{ ticketId }}</p>
            <img src="/images/copy.png" class="copy" @click="copy">
        </div>

        <p>Parking: {{ parking }}</p>
        <p>Parking spot: {{ spot }}</p>

        <div class="buttons-div">
            <NuxtLink to="/">
                <button class="home">Home</button>
            </NuxtLink>
            <button @click="download">Download QR</button>
        </div>
    </div>
    <div v-else class="background">
        <h1>BANNED</h1>
        <img src="/images/failure.png" class="failure">
        <h2>Contact admin or regulate pending costs</h2>
        <NuxtLink to="/">
            <button>Home</button>
        </NuxtLink>
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

h2 {
    margin: 10% 10% 20% 10%;
    color: var(--shadow);
}

.ticket-id {
    display: flex;
    justify-content: center;
}

.copy {
    width: 5%;
    height: 5%;
}

.failure {
    margin: 10%;
    width: 20%;
}

p {
    color: var(--shadow);
    margin: 1%;
}

.qr {
    margin: 0 auto;
    width: 50%;
}

button {
    margin: 6% 4% 0% 4%;
    padding: 2%;
    border-radius: 16px;
    width: 36%;
    background-color: var(--primary-lighter);
    color: var(--bg-light);
    font-size: larger;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
    border: 0;
}

button:hover,
.copy:hover {
    cursor: pointer;
}

.home {
    color: var(--primary-lighter);
    background-color: var(--bg-light);
}
</style>