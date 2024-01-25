<script setup>
import TopBar from "/components/TopBar.vue";
 import { ref, onMounted } from 'vue';

 definePageMeta({ middleware: "auth" });

const route = useRoute();
const carId = Number(route.query.carId);  
 
const isModalVisible = ref(false);
const modalContent = ref('');

 
const carRegistration = ref('');
const sumForCar = ref(0);
const customButtonsCarList = ref([]);

const openModal = (content) => {
  isModalVisible.value = true;
  modalContent.value = content;
};

const handleCarButtonClick = (item) => {
  const content = `
    <p>Space: ${item.spot}</p>
    <p>Date: ${item.date}</p>
    <p>LeaveDate: ${item.leaveDate} </p>
    <p>Parking Name: ${item.name}</p>
    <p>Amount: ${item.amount} PLN</p>
  `;
  openModal(content);
};

  
const closeModal = () => {
  isModalVisible.value = false;
  modalContent.value = '';
};

const fetchCarNumber = async () => {
  try {
    const response = await fetch(`/api/statistics/carTitles/${carId}`);
    const data = await response.json();
    carRegistration.value = data.data.registrationNumber;
 
  } catch (error) {
    console.error(error);
  } 
};
 
const fetchParkingCarDetails = async () => {
  try {

    customButtonsCarList.value.splice(0, customButtonsCarList.value.length);

     const response = await fetch(`/api/statistics/car/${carId}`);
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
 
 
onMounted(async () => {
  closeModal();
  fetchCarNumber();
  fetchParkingCarDetails();
});
</script>



<template>
  <TopBar>
    <div class="container">
    
         <div class="selected-title"> {{carRegistration }}</div>

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
  flex-direction: column;  /* Updated line to stack items vertically */
  align-items: center;     /* Center items horizontally */
  background-color: #eef0e5;
  width: 100%;
  height: 100%;
  color: #333;
 }
 

.selected-title {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 45px; 
  margin-top: 45px; 
  margin-left: 33%;
  margin-right: 33%;
  font-size: 64px;
  max-height: 100%;
  font-weight: bold;
  color: #5C5C5C;
}
 

.revenue-container {
  text-align: center;
  align-items: center;
  font-size: 30px;
  color: #000000;
  max-width: 34%;
  margin-left: 33%;
  margin-right: 33%;
  margin-bottom: 50px;
  width: 34%;
  max-height: 100%;
}

.custom-buttons-container {
  max-height: 80%;
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  width: 60%;
  margin-left: 20%;
  margin-right: 20%;
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
  