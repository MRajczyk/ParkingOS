<script setup>
import TopBar from "/components/TopBar.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const parkingId = route.query.id;
const parking = ref([]);

const createClicked = ref(false);
const allFilled = ref(false);
const success = ref(false);

const name = ref(null);
const city = ref(null);
const address = ref(null);

const floors = ref(null);
const spaces = ref(null);
const start = ref(null);
const end = ref(null);
const day1 = ref(null);
const day2 = ref(null);
const day3 = ref(null);
const day4 = ref(null);
const night1 = ref(null);
const night2 = ref(null);
const night3 = ref(null);
const night4 = ref(null);

// let floorsBeforeSave;
// let spacesBeforeSave;

onMounted(async () => {
    axios
        .get("/api/admin/parking/edit/" + parkingId)
        .then((response) => {
            parking.value = response.data;

            name.value = response.data.name;
            city.value = response.data.city;
            address.value = response.data.address;
            floors.value = response.data.floors;
            // floorsBeforeSave = response.data.floors;
            spaces.value = response.data.parkingPlacesPerFloor;
            // spacesBeforeSave = response.data.parkingPlacesPerFloor;
            start.value = response.data.chargePlan.nightStart;
            end.value = response.data.chargePlan.nightEnd;
            day1.value = response.data.chargePlan.dayHour1Tariff;
            day2.value = response.data.chargePlan.dayHour2Tariff;
            day3.value = response.data.chargePlan.dayHour3Tariff;
            day4.value = response.data.chargePlan.dayHour4Tariff;
            night1.value = response.data.chargePlan.nightHour1Tariff;
            night2.value = response.data.chargePlan.nightHour2Tariff;
            night3.value = response.data.chargePlan.nightHour3Tariff;
            night4.value = response.data.chargePlan.nightHour4Tariff;
        })
        .catch((error) => {
            console.error('Error fetching parking info:', error);
        });
});

function save() {
    if (name.value && city.value && address.value && floors.value && spaces.value && start.value && end.value && day1.value && day2.value && day3.value && day4.value && night1.value && night2.value && night3.value && night4.value) {
        allFilled.value = true;

        let spacesToAdd = 0;
        if (parking.value.floors * parking.value.parkingPlacesPerFloor < floors.value * spaces.value) {
            spacesToAdd = floors.value * spaces.value - parking.value.floors * parking.value.parkingPlacesPerFloor;
        }

        axios
            .put("/api/admin/parking/edit", {
                id: +parkingId,
                name: name.value,
                city: city.value,
                address: address.value,
                floors: floors.value,
                spaces: spaces.value,
                start: start.value,
                end: end.value,
                day1: day1.value,
                day2: day2.value,
                day3: day3.value,
                day4: day4.value,
                night1: night1.value,
                night2: night2.value,
                night3: night3.value,
                night4: night4.value,
                spacesToAdd: spacesToAdd,
            })
            .then((response) => {
                if (parking.value.floors * parking.value.parkingPlacesPerFloor > floors.value * spaces.value) {
                    const ctr = parking.value.floors * parking.value.parkingPlacesPerFloor - floors.value * spaces.value;
                    axios
                        .delete("/api/admin/parking/delete/space", {
                            data: {
                                parkingId: +parkingId,
                                ctr: +ctr,
                            },
                        })
                        .then((response) => {
                            parking.value.floors = floors.value;
                            parking.value.parkingPlacesPerFloor = spaces.value;
                            success.value = true;
                            createClicked.value = true;
                        })
                        .catch((error) => {
                            console.error(error);
                        });

                } else {
                    parking.value.floors = floors.value;
                    parking.value.parkingPlacesPerFloor = spaces.value;
                    success.value = true;
                    createClicked.value = true;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        createClicked.value = true;
    }
}

function validate(tariff) {
    switch (tariff) {
        case "night1":
            night1.value = night1.value < 1 ? 1 : Math.round(night1.value);
            break;
        case "night2":
            night2.value = night2.value < 1 ? 1 : Math.round(night2.value);
            break;
        case "night3":
            night3.value = night3.value < 1 ? 1 : Math.round(night3.value);
            break;
        case "night4":
            night4.value = night4.value < 1 ? 1 : Math.round(night4.value);
            break;
        case "day1":
            day1.value = day1.value < 1 ? 1 : Math.round(day1.value);
            break;
        case "day2":
            day2.value = day2.value < 1 ? 1 : Math.round(day2.value);
            break;
        case "day3":
            day3.value = day3.value < 1 ? 1 : Math.round(day3.value);
            break;
        case "day4":
            day4.value = day4.value < 1 ? 1 : Math.round(day4.value);
            break;
        case "floors":
            floors.value = floors.value < 1 ? 1 : Math.round(floors.value);
            break;
        case "spaces":
            spaces.value = spaces.value < 1 ? 1 : Math.round(spaces.value);
            break;
        case "start":
            start.value = start.value < 0 ? 0 : Math.round(start.value > 23 ? 23 : start.value);
            break;
        case "end":
            end.value = end.value < 0 ? 1 : Math.round(end.value > 23 ? 23 : end.value);
            break;
    }
}

</script>

<template>
    <div style="background-color: var(--bg-light);height: 100%;">
        <TopBar>
            <div class="bckg">
                <h1>Edit Parking</h1>
                <div class="background">
                    <div class="inputs">
                        <div class="left">
                            <label>name</label><br />
                            <input v-model="name"><br />
                            <label>city</label><br />
                            <input v-model="city"><br />
                            <label>address</label><br />
                            <input v-model="address"><br />
                            <label>floors</label><br />
                            <input type="number" name="floors" min="1" step="1" v-model="floors"
                                @change="validate('floors')"><br />
                            <label>spaces per floors</label><br />
                            <input type="number" name="spaces" min="1" step="1" v-model="spaces"
                                @change="validate('spaces')">
                        </div>
                        <div class="right">
                            <div style="width: 50%;">
                                <label>start night tariff</label><br />
                                <input type="number" name="start" min="1" step="1" v-model="start"
                                    @change="validate('start')"><br />
                                <label>day tariff 1st hour</label><br />
                                <input type="number" name="day1" min="1" step="1" v-model="day1"
                                    @change="validate('day1')"><br />
                                <label>day tariff 2nd hour</label><br />
                                <input type="number" name="day2" min="1" step="1" v-model="day2"
                                    @change="validate('day2')"><br />
                                <label>day tariff 3rd hour</label><br />
                                <input type="number" name="day3" min="1" step="1" v-model="day3"
                                    @change="validate('day3')"><br />
                                <label>day tariff next hour</label><br />
                                <input type="number" name="day4" min="1" step="1" v-model="day4"
                                    @change="validate('day4')"><br />
                            </div>
                            <div style="width: 50%;">
                                <label>end night tariff</label><br />
                                <input type="number" name="end" min="0" max="23" step="1" v-model="end"
                                    @change="validate('end')"><br />
                                <label>night tariff 1st hour</label><br />
                                <input type="number" name="night1" min="1" step="1" v-model="night1"
                                    @change="validate('night1')"><br />
                                <label>night tariff 2nd hour</label><br />
                                <input type="number" name="night2" min="1" step="1" v-model="night2"
                                    @change="validate('night2')"><br />
                                <label>night tariff 3rd hour</label><br />
                                <input type="number" name="night3" min="1" step="1" v-model="night3"
                                    @change="validate('night3')"><br />
                                <label>night tariff next hour</label><br />
                                <input type="number" name="night4" min="1" step="1" v-model="night4"
                                    @change="validate('night4')"><br />
                            </div>
                        </div>
                    </div>
                    <div class="buttons">
                        <NuxtLink to="/">
                            <button class="back">Back</button>
                        </NuxtLink>
                        <button @click="save">Save</button>
                    </div>
                    <div class="info" v-if="createClicked && !success">Error updating parking</div>
                    <div class="info" v-if="createClicked && !allFilled && success">Please fill in all fields!</div>
                    <div class="info" style="color: green" v-if="createClicked && success">Parking updated</div>
                </div>
            </div>
        </TopBar>
    </div>
</template>

<style scoped>
.bckg {
    text-align: center;
}

.background {
    background-color: white;
    width: 40%;
    margin: 3% auto 0 auto;
    border-radius: 30px;
    padding: 2%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
    text-align: center;
}

.inputs {
    display: flex;
}

h1 {
    color: var(--shadow);
    font-weight: 1500;
    font-size: 60px;
    margin-top: 5%;
}

.left {
    width: 35%;
    border-right: 1px solid black;
}

.right {
    width: 65%;
    display: flex;
}

label {
    color: var(--shadow);
    font-size: small;
}

input {
    padding: 3%;
    margin-bottom: 8%;
    border-radius: 16px;
    width: 80%;
    border: 1px solid var(--shadow);
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

button:hover {
    cursor: pointer;
}

.back {
    color: var(--primary-lighter);
    background-color: var(--bg-light);
}

.error {
    border: 2px solid red;
}

.info {
    margin-top: 2%;
    color: red;
}
</style>
