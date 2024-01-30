<script setup>
import TopBar from "/components/TopBar.vue";
 import { ref, onMounted } from 'vue';

 definePageMeta({ middleware: "auth" });

const route = useRoute();
const spaceId = Number(route.query.spaceId);  
 
 
const isModalVisible = ref(false);
const modalContent = ref('');

const floor = ref('');
const spaceNumber = ref('');

 
 const sumForSpace = ref(0);
const customButtonsSpaceList = ref([]);

const openModal = (content) => {
  isModalVisible.value = true;
  modalContent.value = content;
};

const handleSpaceButtonClick = (item) => {
  const content = `
    <p>Car name: ${item.carName}</p>
    <p>Car registration number: ${item.registrationNumber}</p>
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

 
 
const fetchSpaceDetails = async () => {
  try {

    customButtonsSpaceList.value.splice(0, customButtonsSpaceList.value.length);

     const response = await fetch(`/api/statistics/space/${spaceId}`);
    const data = await response.json();

   
     data.filteredResultData.forEach((space) => {
    
        const date = new Date(space.entranceDate);

const formattedDate =`${date.toISOString().split("T")[0]} ${date.toTimeString().split(" ")[0]}`;
const date2 = new Date(space.leaveDate);

const formattedDate2 =`${date2.toISOString().split("T")[0]} ${date2.toTimeString().split(" ")[0]}`;
        customButtonsSpaceList.value.push({
        id: space.id,
        date: formattedDate,
        leaveDate: formattedDate2,
        registrationNumber: space.registrationNumber,
        name: space.name,
        amount: space.totalCost,
        carName: space.carName,

      });

    
      });
      const totalAmount = customButtonsSpaceList.value.reduce((sum, item) => sum + item.amount, 0);
sumForSpace.value = `${totalAmount.toFixed(2)}`;
floor.value=String(data.floor);
spaceNumber.value=String(data.placeNumber);

   } catch (error) {
    console.error('Error fetching parking space details:', error);
  }
};
 
 
onMounted(async () => {
  closeModal();
   fetchSpaceDetails();
});
</script>



<template>
  <TopBar>
    <div class="container">
    
         <div class="selected-title">Space {{ spaceNumber }}  Floor {{ floor}}</div>

            <div class="revenue-container">
              <p>Revenue sum: <strong>{{ sumForSpace }} PLN</strong></p>
            </div>
            <div class="custom-buttons-container" ref="rightButtonsList">
  
  
                <button
    v-for="item in customButtonsSpaceList"
    :key="item.id"
    class="custom-button"
    @click="handleSpaceButtonClick(item)"
  >
    <div>  
      <span class="custom-button-date">Date: {{ new Date( item.date).toLocaleDateString('en-CA')}},</span>
      <span class="custom-button-label">Registration: {{ item.registrationNumber }}</span>
    </div>
    <span class="custom-button-amount">Amount: {{ item.amount }} PLN</span>
  </button>
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
  overflow: auto;
  display: flex;
  flex-direction: column;  
  align-items: center;    
  background-color: #eef0e5;
  width: 100%;
  height: 100%;
  color: #333;
 }
 


.selected-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px; 
  margin-top: 25px; 
  margin-left: 33%;
  margin-right: 33%;
  font-size: 45px;
   font-weight: bold;
  color: #5C5C5C;
}
 

.revenue-container {
  text-align: center;
  align-items: center;
   color: #000000;
   margin-left: 33%;
  margin-right: 33%;
  margin-bottom: 25px;
  width: 34%;
 }

.custom-buttons-container {
  max-height: 80%;
  overflow-y: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  width: 40%;
  margin-left: 30%;
  margin-right: 30%;
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
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  background-color: #ffffff;
  color: #000000;
   box-sizing: border-box;
   margin-left: 2%;

  margin-right: 2%;
   transition: background-color 0.3s, box-shadow 0.3s;
   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  width: 96%;
 }

.custom-button.active {
  background-color: #DDE7DD;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
}

.custom-button:hover {
  background-color: #c7e5c2;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
}

.custom-button-date {
  margin-left:10px;
 }

.custom-button-label {
  margin-left:10px;

 }

.custom-button-amount {
  margin-right:20px;

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
    overflow: hidden;
  }

  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 30px;
    border: none; 
    border-radius: 10px;  
    width: 100%;
    max-width: 1000px;
    color: #000;
    position: relative;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); 
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

  </style>
  