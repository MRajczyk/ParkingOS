<script setup>
import TopBar from "/components/TopBar.vue";
 import { ref, onMounted } from 'vue';

definePageMeta({ middleware: "auth" });

const isModalVisible = ref(false);
const modalContent = ref('');

const parkings = ref([]);
const filteredParkings = ref([]);
const selectedParking = ref(null);
const selectedParkingName = ref('');

const searchQuery = ref('');
const rightSelected = ref('Parking');
const isLoading = ref(true);
 const parkingInfo = ref({
  maxCapacity: 0,
  revenueGenerated: '$0',
  carsParkedToDate: 0,
  sumOfMonthlyCosts: '$0',
});
const spaceOptions = ref([]);  
const selectedSpaceOption = ref(null); 
const sumForSpace = ref('');
const customButtonsList = ref([]);

const carOptions = ref([]);  
const selectedCarOption = ref(null); 
const sumForCar = ref('');
const customButtonsCarList = ref([]);

const openModal = (content) => {
  isModalVisible.value = true;
  modalContent.value = content;
};
const handleRightButtonClick = (selected) => {
  rightSelected.value = selected;
  closeModal();
};

const filterParkings = () => {
   filteredParkings.value = parkings.value.filter((parking) =>
    parking.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
};

 const updateParkingInfo = (data) => {
  parkingInfo.value = {
    maxCapacity: data.maxCapacity,
    revenueGenerated: data.revenueGenerated,
    carsParkedToDate: data.carsParkedToDate,
    sumOfMonthlyCosts: data.sumOfMonthlyCosts,
  };
};


const fetchParkingSpaceDetails = async ( ) => {
  try {
    spaceOptions.value.splice(0, spaceOptions.value.length);
     const response = await fetch(`/api/statistics/spaces/${selectedParking.value}`);
    const data = await response.json();

   
     data.data.parkingSpaceIds.forEach((spaceId) => {
        spaceOptions.value.push({
          id: spaceId,
        });
      });
      if (spaceOptions.value.length > 0) {
     selectedSpaceOption.value = spaceOptions.value[0];
     }
    console.log('Updated Space Options:', spaceOptions.value);
  } catch (error) {
    console.error('Error fetching parking space details:', error);
  }
};


const fetchCarList = async ( ) => {
  try {
    carOptions.value.splice(0, carOptions.value.length);
     const response = await fetch(`/api/statistics/carlist/${selectedParking.value}`);
    const data = await response.json();

   
     data.resultData.forEach((car) => {
        carOptions.value.push({
          id: car.id,
          registrationNumber: car.registrationNumber,
        });
      });
      //pozniej sprawdzaj czy lista dluzsza niz 0 i uwzgledniac parametr

      if (carOptions.value.length > 0) {
      selectedCarOption.value = carOptions.value[0];
      }
   } catch (error) {
    console.error('Error fetching Car list:', error);
  }
};


const fetchParkingCarDetails = async () => {
  try {

    customButtonsCarList.value.splice(0, customButtonsCarList.value.length);
    if (!selectedParking.value || !selectedCarOption.value) {
      return;}
     const response = await fetch(`/api/statistics/cars/${selectedParking.value}/${selectedCarOption.value.id}`);
    const data = await response.json();

   
     data.filteredResultData.forEach((car) => {
    
        const date = new Date(car.entranceDate);

const formattedDate =`${date.toISOString().split("T")[0]} ${date.toTimeString().split(" ")[0]}`;
const date2 = new Date(car.leaveDate);

const formattedDate2 =`${date2.toISOString().split("T")[0]} ${date2.toTimeString().split(" ")[0]}`;
        customButtonsCarList.value.push({
        spot: car.spot,
        id: car.id,
        date: formattedDate,
        leaveDate: formattedDate2,
        registrationNumber: car.registrationNumber,
        name: car.name,
        amount: car.totalCost,
      });


      });
      const totalAmount = customButtonsCarList.value.reduce((sum, item) => sum + item.amount, 0);
sumForCar.value = `${totalAmount.toFixed(2)}`;

   } catch (error) {
    console.error('Error fetching parking car details:', error);
  }
};

const fetchParkingSessions = async () => {
  try {
    
    customButtonsList.value.splice(0, customButtonsList.value.length);
    if (!selectedParking.value || !selectedSpaceOption.value) {
      return;}
    const response = await fetch(`/api/statistics/spacestats/${selectedSpaceOption.value.id}`);
    const data = await response.json();
    const parkingSessions = data.sortData;
      customButtonsList.value = parkingSessions.map((session) => {
      
        const date = new Date(session.entranceDate);

const formattedDate =`${date.toISOString().split("T")[0]} ${date.toTimeString().split(" ")[0]}`;
const date2 = new Date(session.leaveDate);

const formattedDate2 =`${date2.toISOString().split("T")[0]} ${date2.toTimeString().split(" ")[0]}`;
      return {
        spot: selectedSpaceOption.value.id,
        id: session.id,
        date: formattedDate,
        leaveDate: formattedDate2,
        registrationNumber: session.registrationNumber,
        name: session.name,
        amount: session.totalCost,
      };
    });
    const totalAmount = customButtonsList.value.reduce((sum, item) => sum + item.amount, 0);

    sumForSpace.value = `${totalAmount.toFixed(2)}`;
    console.log('Updated customButtonsList:', customButtonsList.value);
  } catch (error) {
    console.error('Error fetching parking sessions:', error);
  }
};

 
const handleCarButtonClick = (item) => {
  const content = `
    <p>Space: ${item.spot}</p>
    <p>Date: ${item.date}</p>
    <p>LeaveDate: ${item.leaveDate} </p>
    <p>RegistrationNumber: ${item.registrationNumber}</p>
    <p>Name: ${item.name}</p>
    <p>Amount: ${item.amount} PLN</p>
  `;
  openModal(content);
};

const handleCustomButtonClick = (item) => {
  const content = `
  <p>Space: ${item.spot}</p>
    <p>Date: ${item.date}</p>
    <p>LeaveDate: ${item.leaveDate} </p>
    <p>RegistrationNumber: ${item.registrationNumber}</p>
    <p>Name: ${item.name}</p>
     <p>Amount: ${item.amount} PLN</p>
  `;
     

  
  openModal(content);
};
handleCarButtonClick
const closeModal = () => {
  isModalVisible.value = false;
  modalContent.value = '';
};

const fetchParkings = async () => {
  try {
    const response = await fetch('/api/statistics/all');
    const data = await response.json();
    parkings.value = data.data;
    filterParkings();

    if (parkings.value.length > 0) {
       selectParking(parkings.value[0].id, parkings.value[0].name);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};



const selectParking = async (id, name) => {
  selectedParking.value = id;
  selectedParkingName.value = name;
  customButtonsCarList.value.splice(0, customButtonsCarList.value.length);
  customButtonsList.value.splice(0, customButtonsList.value.length);
  sumForSpace.value=null;

  sumForCar.value=null;
  try {
    const response = await fetch(`/api/statistics/${id}`);
    const data = await response.json();
    updateParkingInfo(data.data);
    await fetchParkingSpaceDetails();
     await fetchCarList();
 

  } catch (error) {
    console.error(error);
  }
};
 
const watchSelectedSpaceOption = () => {
  watch(selectedSpaceOption, (newOption, oldOption) => {
    closeModal();

     console.log('Selected Space Option changed:', newOption);
    
     fetchParkingSessions();
  });
};
const watchSelectedCarOption = () => {
  watch(selectedCarOption, (newOption, oldOption) => {
    closeModal();

     console.log('Selected Car Option changed:', newOption);
    
     fetchParkingCarDetails();
  });
};
const watchselectedParking = () => {
  watch(selectedParking, (newOption, oldOption) => {
     console.log('Selected Parking Option changed:', newOption);
     closeModal();

    //  fetchParkingSpaceDetails();
    //   fetchParkingSessions();
    //   fetchCarList();
    //   fetchParkingCarDetails();
      });
};
onMounted(async () => {
  closeModal();
  await fetchParkings();
  await watchselectedParking();
  await watchSelectedSpaceOption();  
  await watchSelectedCarOption();
});
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
                  Space {{ option.id }}
                </option>
              </select>
            </div>
            <div class="revenue-container">
              <p>Revenue sum: <strong>{{ sumForSpace }} PLN</strong></p>
            </div>
            <div class="custom-buttons-container" ref="rightButtonsList">
  <button
    v-for="item in customButtonsList"
    :key="item.id"
    class="custom-button"
    @click="handleCustomButtonClick(item)"
  >
    <div>  
      <span class="custom-button-date">{{ new Date( item.date).toLocaleDateString('en-CA')}}</span>
      <span class="custom-button-label">{{ item.name }}</span>
    </div>
    <span class="custom-button-amount">{{ item.amount }} PLN</span>
  </button>
</div>

 
          </div>
          <div v-if="rightSelected === 'Car'" class="space-content">
            <div class="space-options-container">
              <select v-model="selectedCarOption">
                <option v-for="option in carOptions" :key="option.id" :value="option">
                 {{ option.registrationNumber }}
                </option>
              </select>
            </div>
            <div class="revenue-container">
              <p>Revenue sum: <strong>{{ sumForCar }} PLN</strong></p>
            </div>
            <div class="custom-buttons-container" ref="rightButtonsList">
  <button
    v-for="item in customButtonsCarList"
    :key="item.id"
    class="custom-button"
    @click="handleCarButtonClick(item)"
  >
    <div>  
      <span class="custom-button-date">{{ new Date( item.date).toLocaleDateString('en-CA')}}</span>
      <span class="custom-button-label">Space {{ item.spot }}</span>
    </div>
    <span class="custom-button-amount">{{ item.amount }} PLN</span>
  </button>
</div>

 
          </div>
        </div>
      </div>
    </div>
    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div v-html="modalContent"></div>
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
  max-height: 80%;
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
  justify-content: space-between;
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

.custom-button-date {
  margin-left:40px;
 }

.custom-button-label {
  margin-left:40px;

 }

.custom-button-amount {
  margin-right:70px;

 }
 
 .modal {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 30px;
  border: 1px solid #888;
  width: 100%;
  max-width: 1000px;
  color: #000;
  position: relative;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin-top: -20px;
}

/* Nowe style dla danych w modalu */
.modal-content p {
  margin: 10px 0;
  font-size: 18px;
}

.modal-content p strong {
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

  </style>
  