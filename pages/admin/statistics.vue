<script setup>
import TopBar from "/components/TopBar.vue";
  import { ref } from 'vue';
  
  const parkings = ref([
    { id: 1, name: 'Parking 1' },
    { id: 2, name: 'Parking 2' },
    { id: 3, name: 'Parking 3' },
    { id: 4, name: 'Parking 4' },
    { id: 5, name: 'Parking 5' },
    { id: 6, name: 'Parking 6' },
  ]);
  
  const filteredParkings = ref(parkings.value);
  const selectedParking = ref(1);
  const selectedParkingName = ref('Parking 1');
  const searchQuery = ref('');
  const rightSelected = ref('Parking');
  
  const filterParkings = () => {
    filteredParkings.value = parkings.value.filter((parking) =>
      parking.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
              v-for="parking in filteredParkings"
              :key="parking.id"
              class="left-button"
              :class="{ active: selectedParking === parking.id }"
              @click="selectParking(parking.id, parking.name)"
            >
              {{ parking.name }}
            </button>
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
           <div v-if="rightSelected === 'Parking'">
            <div class="parking-info">
              <p>Parking creation date: {{ parkingInfo.creationDate }}</p>
              <p>Max. capacity: {{ parkingInfo.maxCapacity }}</p>
              <p>Revenue generated: {{ parkingInfo.revenueGenerated }}</p>
              <p>Cars parked to date: {{ parkingInfo.carsParkedToDate }}</p>
              <p>Sum of monthly costs: {{ parkingInfo.sumOfMonthlyCosts }}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </TopBar>
  </template>

  

  <style scoped>
   * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #eef0e5;

  }
  
   .container {
    display: flex;
    justify-content: space-between;
    background-color: #eef0e5;
    min-height: 100vh;  
    color: #333;  
  }
  
   .left-side {
    padding-top: 60px;
    width: 18%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 1%;
    border-right: 1px solid #ccc;
  }
  
   .right-side {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .selected-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;  
  font-size: 64px;
  margin-top: 30px;
  font-weight: bold;
  color: #5C5C5C;  
}





  
 
  .search-input-container {
    position: relative;
    width: 100%;
    margin-bottom: 25px;

  }
  
  input {
    padding: 10px;
     border-radius: 20px;
    width: 90%;  
  margin-right:10%;
    max-height: 200px;
    height:50px;
    font-size: 30px;
    color: #333;  
   background-color: #eef0e5;
 
  }
  
 
.buttons-container {
  max-height: 200px;
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
  margin-top: 5px;
  margin-bottom: 5px;
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
  margin-right: 5%;
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
    flex-grow: 1;
    width: 100%;
 
  }
  .parking-info {
  font-size: 30px;  
  line-height: 2;  
  width: 95%;
  align-items: left;
margin-top: 40px;
margin-left: 5%;
  
}
 
  </style>
  