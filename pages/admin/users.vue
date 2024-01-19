<script setup>
import TopBar from "/components/TopBar.vue";
import { ref } from 'vue'
import { VueToggles } from "vue-toggles";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const users = ref([]);
const filteredUsers = ref([]);
const searchQuery = ref('');
const isModalVisible = ref(false);
const cars = ref([]);

onMounted(async () => {
  axios
    .get("/api/users/users")
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
});

function updateUser(id, isBanned) {
  axios
    .put("/api/users/ban", {
      id: id,
      isBanned: isBanned,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error blocking user:', error);
      let updatedUserIndex = users.value.findIndex(user => user.id === id);
      if (updatedUserIndex !== -1) {
        users.value[updatedUserIndex].isBanned = !isBanned;
      }
      updatedUserIndex = filterUsers.value.findIndex(user => user.id === id);
      if (updatedUserIndex !== -1) {
        filterUsers.value[updatedUserIndex].isBanned = !isBanned;
      }
      alert('(Un)block failed.');
    });
}

const filterUsers = () => {
  filteredUsers.value = users.value.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  console.log(filterUsers.value)
};

function showCars(id) {
  axios
    .get("/api/users/cars", {
      params: {
        userId: id,
      }
    })
    .then((response) => {
      cars.value = response.data;
      isModalVisible.value = true;
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
}


function statistics(id) {
  router.push({
    path: "/admin/statistics",
    query: {
      car: id,
    },
  });
}
</script>

<template>
  <div style="background-color: var(--bg-light);height: 100%;">
    <TopBar>
      <div class="bckg">
        <h1>Users</h1>
        <input type="text" id="search" v-model="searchQuery" @input="filterUsers" placeholder="Search" />
        <div class="header">
          <div style="width: 12%;padding-left: 1.5%;">Id</div>
          <div style="width: 48%;padding-left: 1.5%;">E-mail</div>
          <div style="width: 14%;text-align: right;">Funds</div>
          <div style="width: 9.5%;text-align: right;padding-right: 2.5%;">Cars</div>
          <div style="width: 14%;text-align: center;">Block</div>
        </div>
        <div v-for="user in filteredUsers" class="background">
          <div style="width: 12%;padding: 1.5%;">{{ user.id }}</div>
          <div style="width: 48%;padding: 1.5%;">{{ user.email }}</div>
          <div style="width: 14%;text-align: right;padding: 1.5% 2%;">{{ user.balance.toFixed(2) }} PLN</div>
          <div style="width: 12%;text-align: center;">
            <img src="/images/car.png" class="car" @click="showCars(user.id)">
          </div>
          <div style="width: 14%;">
            <VueToggles v-model="user.isBanned" :width="50" checkedBg="var(--primary-lighter)"
              @click="updateUser(user.id, user.isBanned)" class="switch" />
          </div>
        </div>
      </div>
      <div v-if="isModalVisible" class="modal">
        <div class="cars">
          <div style="align-items: right; justify-content: right; display: flex;">
            <button @click="isModalVisible = false" style="padding: 0 1%; background-color: white;">X</button>
          </div>
          <h2>Cars</h2>
          <div class="list">
            <div v-for="car in cars" class="element">
              <div style="margin: auto auto auto 0;">{{ car.registrationNumber }}</div>
              <img src="/images/bar-chart.png" @click="statistics(car.id)" class="statistics">
            </div>
          </div>
        </div>
      </div>
    </TopBar>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.cars {
  background-color: white;
  width: 30%;
  margin-bottom: 10%;
  border-radius: 30px;
  padding: 1% 2%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
}

.list {
  margin-top: 5%;
  margin-bottom: 10%;
  overflow-y: auto;
  justify-content: center;
}

.element {
  background-color: var(--bg-darker);
  width: 70%;
  margin: 5% auto;
  border-radius: 30px;
  padding: 2% 5%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  text-align: left;
  font-size: large;
  display: flex;
}

.statistics {
  width: 8%;
}

.bckg {
  text-align: center;
}

.background {
  background-color: white;
  width: 50%;
  margin: 1% auto 0 auto;
  border-radius: 30px;
  padding: 1% 2%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  text-align: left;
  display: flex;
  justify-content: center;
}

#search {
  width: 15%;
  margin-top: 2%;
  padding: 0.5%;
  border-radius: 14px;
}

.header {
  width: 50%;
  margin: 2% auto 0 auto;
  text-align: left;
  display: flex;
  justify-content: center;
  color: var(--shadow);
  font-weight: 700;
}

h1 {
  color: var(--shadow);
  font-weight: 1500;
  font-size: 60px;
  margin-top: 5%;
}

h2 {
  color: var(--shadow);
  font-weight: 1500;
  font-size: 40px;
}

.car {
  width: 50%;
}

button,
.statistics,
.car:hover {
  cursor: pointer;
}

.switch {
  margin: 9% auto;
}
</style>
