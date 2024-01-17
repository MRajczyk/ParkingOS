<script setup>
import TopBar from "/components/TopBar.vue";
import { ref, onMounted } from 'vue';

const isModalVisible = ref(false);
const modalContent = ref('');

const parkings = ref([]);
const filteredParkings = ref([]);
const selectedParking = ref(null);
const selectedParkingName = ref('');
const searchQuery = ref('');
const rightSelected = ref('Parking');
const isLoading = ref(true);

const fetchParkings = async () => {
  try {
    const response = await fetch('/api/parkings/all');
    const data = await response.json();
    parkings.value = data.data;
    filterParkings();

    if (parkings.value.length > 0) {
      selectedParking.value = parkings.value[0].id;
      selectedParkingName.value = parkings.value[0].name;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const filterParkings = () => {
  filteredParkings.value = parkings.value.filter((parking) =>
    parking.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
};

const selectParking = (id, name) => {
  selectedParking.value = id;
  selectedParkingName.value = name;
};

const handleRightButtonClick = (type) => {
  rightSelected.value = type;
  console.log(`Right Button clicked: ${type}`);
};

const parkingInfo = ref({
  creationDate: '2022-01-15',
  maxCapacity: 100,
  revenueGenerated: '$100,000',
  carsParkedToDate: 50,
  sumOfMonthlyCosts: '$10,000',
});

const spaceOptions = ref([
  { id: 1, name: 'Option 1', revenue: '$50,000' },
  { id: 2, name: 'Option 2', revenue: '$60,000' },
  { id: 3, name: 'Option 3', revenue: '$70,000' },
]);

const selectedSpaceOption = ref(spaceOptions.value[0]); 
const number = ref('$50,000');

const customButtonsList = ref([
  { id: 1, label: 'Custom Button 1' },
  { id: 2, label: 'Custom Button 2' },
  { id: 3, label: 'Custom Button 3' },
  { id: 4, label: 'Custom Button 4' },
  { id: 5, label: 'Custom Button 5' },
  { id: 6, label: 'Custom Button 6' },
  { id: 7, label: 'Custom Button 7' },
]);

const openModal = (content) => {
  isModalVisible.value = true;
  modalContent.value = content;
};

const handleCustomButtonClick = () => {
  const content = `Custom Button clicked!`; // Treść modala
  console.log(content);
  openModal(content);
};

const closeModal = () => {
  isModalVisible.value = false;
  modalContent.value = '';
};

onMounted(fetchParkings);
</script>



<template>
  <TopBar>
    <div class="container">
      <div class="left-side">
        <div class="search-input-container">
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            @input="filterParkings"
            placeholder="Search"
          />
        </div>
        <div class="buttons-container" ref="buttonsList">
        <button
          v-if="!isLoading"
          v-for="parking in filteredParkings"
          :key="parking.id"
          class="left-button"
          :class="{ active: selectedParking === parking.id }"
          @click="selectParking(parking.id, parking.name)"
        >
          {{ parking.name }}
        </button>
        <p v-if="isLoading">Loading...</p>
      </div>
      </div>
      <div class="right-side">
        <div class="selected-title">{{ selectedParkingName }}</div>
        <div class="right-buttons">
          <button
            @click="handleRightButtonClick('Parking')"
            class="right-button"
            :class="{ active: rightSelected === 'Parking' }"
          >
            Parking
          </button>
          <button
            @click="handleRightButtonClick('Space')"
            class="right-button"
            :class="{ active: rightSelected === 'Space' }"
          >
            Space
          </button>
          <button
            @click="handleRightButtonClick('Car')"
            class="right-button"
            :class="{ active: rightSelected === 'Car' }"
          >
            Car
          </button>
        </div>
        <div class="content-container">
          <div v-if="rightSelected === 'Parking'" class="parking-info">
             <p>Max. capacity: {{ parkingInfo.maxCapacity }}</p>
            <p>Revenue generated: {{ parkingInfo.revenueGenerated }}</p>
            <p>Cars parked to date: {{ parkingInfo.carsParkedToDate }}</p>
            <p>Sum of monthly costs: {{ parkingInfo.sumOfMonthlyCosts }}</p>
          </div>
          <div v-if="rightSelected === 'Space'" class="space-content">
            <div class="space-options-container">
              <select v-model="selectedSpaceOption">
                <option v-for="option in spaceOptions" :key="option.id" :value="option">
                  {{ option.name }}
                </option>
              </select>
            </div>
            <div class="revenue-container">
              <p>Revenue sum: <strong>{{ number }}</strong></p>
            </div>
            <div class="custom-buttons-container" ref="rightButtonsList">
  <button
    v-for="item in customButtonsList"
    :key="item.id"
    class="custom-button"
     @click="handleCustomButtonClick()"
  >
    {{ item.label }}
  </button>
</div>
          </div>
        </div>
      </div>
    </div>
     <div v-if="isModalVisible" class="modal">
  <div class="modal-content">
    <span class="close" @click="closeModal">&times;</span>
    <p>{{ modalContent }}</p>
  </div>
</div>
  </TopBar>
</template>
<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  width: 100%;
  height: 100%;
  position: relative;
}

.container {
  display: flex;
  justify-content: space-between;
  background-color: #eef0e5;
  width: 100%;
  height: 100%;
  color: #333;
  max-height: 100%;
}

.left-side {
  width: 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1%;
  max-height: 100%;
  border-right: 1px solid #ccc;
}

.right-side {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.selected-title {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px; 
  font-size: 64px;
  max-height: 100%;
  font-weight: bold;
  color: #5C5C5C;
}

.search-input-container {
  position: relative;
  width: 100%;
  margin-bottom: 25px;
 }

input {
  margin-top: 80px;
  padding: 10px;
  border-radius: 20px;
  width: 90%;
  margin-right: 10%;
  max-height: 200px;
  height: 50px;
  font-size: 30px;
  color: #333;
  background-color: #eef0e5;
}

.buttons-container {
  max-height: 45%;
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.left-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  background-color: #ffffff;
  color: #000000;
  flex-shrink: 0;
  box-sizing: border-box;
  margin-right: 5%;
  height: 50px;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 95%;
  font-size: 30px;
}

.buttons-container::-webkit-scrollbar {
  width: 10px;
  margin-left: 10px;
}

.buttons-container::-webkit-scrollbar-thumb {
  background-color: #c7e5c2;
  border-radius: 20px;
  border: 6px solid transparent;
}

.buttons-container::-webkit-scrollbar-track {
  background-color: #eef0e5;
}

.left-button.active {
  background-color: #DDE7DD;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
}

.left-button:hover {
  background-color: #c7e5c2;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.right-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  background-color: #DDE7DD;
  color: #ffffff;
  width: 100%;
  height: 50px;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 30px;
}

.right-button.active {
  background-color: #163020;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
}

.right-button:hover {
  background-color: #68a691;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.right-buttons {
  display: flex;
  justify-content: space-between;
  margin-left: 13%;
  margin-right: 14%;
  width: 73%;
}

.content-container {
  width: 100%;
  max-height: 100%;
}

.parking-info {
  font-size: 30px;
  line-height: 2;
  width: 95%;
  align-items: left;
  margin-top: 40px;
  margin-left: 5%;
  max-height: 100%;
}

.space-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.space-options-container {
  text-align: center;
  max-height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

select {
  padding: 10px;
  border-radius: 20px;
  max-width: 30%;
  width: 30%;
  margin-top: 30px;
  max-height: 200px;
  height: 50px;
  font-size: 25px;
  margin-bottom: 30px;
  color: #333;
  background-color: #eef0e5;
}

.revenue-container {
  text-align: center;
  align-items: center;
  font-size: 30px;
  color: #000000;
  max-width: 34%;
  margin-left: 33%;
  margin-right: 33%;
  margin-bottom: 20px;
  width: 34%;
  max-height: 100%;
}

.custom-buttons-container {
  max-height: 50%;
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.custom-buttons-container::-webkit-scrollbar {
  width: 10px;
  margin-left: 10px;
}

.custom-buttons-container::-webkit-scrollbar-thumb {
  background-color: #c7e5c2;
  border-radius: 20px;
  border: 6px solid transparent;
}

.custom-buttons-container::-webkit-scrollbar-track {
  background-color: #eef0e5;
}

.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  background-color: #ffffff;
  color: #000000;
  flex-shrink: 0;
  box-sizing: border-box;
  margin-right: 5%;
  height: 80px;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 95%;
  font-size: 30px;
}

.custom-button.active {
  background-color: #DDE7DD;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
}

.custom-button:hover {
  background-color: #c7e5c2;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}  
/* W przykładowych stylach zwiększam font-size, ustawiam tło i obramowanie */
.modal {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: white;
  border: 1px solid black;
  padding: 20px;
  font-size: 16px;
  cursor: move;

}


.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
  </style>
  