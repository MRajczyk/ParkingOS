<script setup>
import TopBar from "/components/TopBar.vue";
 import { ref, onMounted } from 'vue';

 definePageMeta({ middleware: "auth" });

const route = useRoute();
const parkingId = Number(route.query.parkingId);  
 
const isModalVisible = ref(false);
const modalContent = ref('');

const parkings = ref([]);
const filteredParkings = ref([]);
const selectedParking = ref(null);
const selectedParkingName = ref('');
const param= ref(true);

const searchQuery = ref('');
const rightSelected = ref('Parking');
const isLoading = ref(true);
const isLoadingCar = ref(true);

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
 const customButtonsCarList = ref([]);

 const cars = ref([]);



 const filteredCars = ref([]);
const searchCarQuery = ref('');

const filterCars = () => {
  filteredCars.value = cars.value.filter(car =>
    car.registrationNumber.toLowerCase().startsWith(searchCarQuery.value.toLowerCase())
  );
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
    cars.value=[];
    filteredCars.value=[];

    const response = await fetch(`/api/statistics/cars/${selectedParking.value}`);
    const data = await response.json();
    cars.value = data.filteredResultData;
 filteredCars.value=cars.value;
    filterCars();
   } catch (error) {
    console.error('Error fetching Car list:', error);
  }
  finally{
  isLoadingCar.value = false;
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

 
 

const handleCustomButtonClick = (item) => {
  const sessionsContent = item.sessions.map((session) => {
    return `
      <p>Date: ${session.entranceDate}</p>
      <p>Leave Date: ${session.leaveDate}</p>
      <p>Amount: ${session.totalCost} PLN</p>
      <p>PlaceNumber: ${session.placeNumber}</p>
      <p>Floor: ${session.floor}</p>
      <p>Parking Name: ${session.parkingName}</p>
      <p>Parking Address: ${session.parkingAddress}</p>
      <p>City: ${session.city}</p>

      <hr />
    `;
  }).join('');

  const content = `
    <div class="sessions-list">${sessionsContent}</div>
  `;

  openModal(content);
};

const openModal = (content) => {
  isModalVisible.value = true;
  modalContent.value = content;
};

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
filterCars();
    if (parkings.value.length > 0) {
       selectParking(parkings.value[0].id, parkings.value[0].name);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};



const selectParking = async (id) => {
  let selectedParkingData;

if (parkingId !== undefined   && parkings.value.some(parking => parking.id === parkingId) && param.value) {
  selectedParking.value = parkingId;
  selectedParkingData = parkings.value.find(parking => parking.id === parkingId);
  param.value = false;
 }

  else
  {
 
  selectedParking.value = id;
    selectedParkingData = parkings.value.find(parking => parking.id === id);
 
 

  }
 
  selectedParkingName.value = selectedParkingData.name;
  customButtonsCarList.value.splice(0, customButtonsCarList.value.length);
  customButtonsList.value.splice(0, customButtonsList.value.length);
  sumForSpace.value=null;

   try {
    const response = await fetch(`/api/statistics/${selectedParking.value}`);
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
 
      });
};
onMounted(async () => {
  closeModal();
  await watchselectedParking();
  await watchSelectedSpaceOption();  
  await watchSelectedCarOption();
  await fetchParkings();

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
    @click="selectParking(parking.id)"
  >
    <div>
      <div style="font-size:medium;">
        {{ parking.name }}
      </div>
      <div style="font-size:small;">
        {{ parking.city }}, {{ parking.address }}
      </div>
    </div>
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
    <p><span class="label">Max. capacity</span> <span class="variable">{{ parkingInfo.maxCapacity }}</span></p>
    <p><span class="label">Revenue generated</span> <span class="variable">{{ parkingInfo.revenueGenerated }} PLN</span></p>
    <p><span class="label">Cars parked to date</span> <span class="variable">{{ parkingInfo.carsParkedToDate }}</span></p>
    <p><span class="label">Sum of monthly costs</span> <span class="variable">{{ parkingInfo.sumOfMonthlyCosts }} PLN</span></p>
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
  <div class="search-list">
    <input
      type="text"
      id="searchCar"
      v-model="searchCarQuery"
      @input="filterCars"
      placeholder="Search Car"
    />
    
  </div>

  <div class="custom-buttons-container" ref="buttonsCarList">
  <button
  v-if="!isLoadingCar"
     v-for="car in filteredCars"
    :key="car.carId"
    class="custom-button"
    @click="handleCustomButtonClick(car)"
  >
  <div>  
      <span class="custom-button-date">{{ car.carName }}</span>
      <span class="custom-button-label">{{ car.registrationNumber }}</span>
    </div>
    <span class="custom-button-amount">{{ car.sumForCar }} PLN</span>
  </button>
</div>

</div>

        </div>
      </div>
    </div>
    <div v-if="isModalVisible" class="modal-overlay" @click="closeModal"></div>
    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div v-html="modalContent"></div>
      </div>
    </div>
  </TopBar>
</template>
<style scoped>
 

 .container {
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: #eef0e5;
  width: 100%;
  height: 100%;
  color: #333;
  overflow-y: auto;  
 }

.left-side {
 
  width: 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1%;
  height: 100%;
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
  position: relative;

  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px; 
  font-size: 64px;
   font-weight: bold;
  color: #5C5C5C;
}

.search-input-container {
  margin-top: 30px;
  align-items: center;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 35px;
 
 }

 .search-input-container input {
  margin-top: 60px;
   border-radius: 14px;
   padding: 1% 4%;
 

    color: #333;
  background-color: white;
}


.search-list {
  margin-top: 30px;
  align-items: center;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
 
 }
 .search-list input {
  margin-top: 30px;
   border-radius: 14px;
  width: 15%;
   padding-left: 10px;
   padding-bottom: 10px;
   padding-top: 10px;
   padding-right: 20px;

margin-left:42.5%;
margin-right:42.5%;

    color: #333;
  background-color: white;
}
 


.buttons-container {
   overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  width: 100%;
}

 
.left-button {
  align-items: left;
  display: flex;
  text-align: left;
  justify-content: left;
  margin: 5% auto;
  padding: 1% 4%;
  cursor: pointer;
  border: none;
  border-radius: 14px;
  background-color: #ffffff;
  color: #000000;
   box-sizing: border-box;
 
   transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  width: 90%;
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
  border-radius: 14px;
  background-color: #DDE7DD;
  color: #ffffff;
  width: 100%;
   transition: background-color 0.3s, box-shadow 0.3s;
   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  font-weight: bold;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-y: auto;  
  height: 100%;

 }
.parking-info {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
   padding: 50px 40px;
   line-height: 1.5;
    background-color: white;

  margin-top: 5%; 
 
 width:30%;
  border-radius: 25px;  
   display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.parking-info p {
  margin-bottom: 20px;  
  display: flex;
  justify-content: space-between; 
  align-items: baseline;
}

.parking-info .label {
  text-align: left;
}

.parking-info .variable {
  text-align: right;
}

.space-content {
  width: 100%;
   display: flex;
  flex-direction: column;
  position: relative;
height: 100%;
  
 }

.space-options-container {
  text-align: center;
   display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

 
}

select {
  padding: 10px;
  border-radius: 14px;
   width: 30%;
  margin-top: 30px;
    margin-bottom: 30px;
  color: #333;
  background-color: #eef0e5;
}

.revenue-container {
  text-align: center;
  align-items: center;
   color: #000000;
   margin-left: 33%;
  margin-right: 33%;
  margin-bottom: 20px;
  position: relative;

  width: 34%;
 }

.custom-buttons-container {
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  border-radius: 14px;
  background-color: #ffffff;
  color: #000000;
   box-sizing: border-box;
 

   transition: background-color 0.3s, box-shadow 0.3s;
   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  width:35%;
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
  margin-left:10px;
 }

.custom-button-label {
  margin-left:10px;

 }

.custom-button-amount {
  margin-right:15px;

 }
 .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.modal {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 10px;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 30px;
  border: none;
  border-radius: 10px;
  width: 100%;
  max-height: 500px; 
  overflow-y: auto;
    color: #000;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  scrollbar-width: thin;

}

.modal-content p {
  margin: 10px 0;
  font-size: 18px;
}

.modal-content p strong {
  font-weight: bold;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin-top: -21px;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.modal-content::-webkit-scrollbar {
  width: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: #68a691;  
  border-radius: 20px;
}

.modal-content::-webkit-scrollbar-track {
  background-color: #eef0e5;
}
  </style>
  