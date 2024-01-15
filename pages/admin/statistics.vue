<template>
    <TopBar>
      <div class="container">
        <!-- Lewa strona (20%) -->
        <div class="left-side">
          <div class="search-container">
            <label for="search" :class="{ 'active-label': searchQuery !== '' }"></label>
            <div class="search-input-container">
              <input
                type="text"
                id="search"
                v-model="searchQuery"
                @input="filterParkings"
                placeholder="Search"
              />
            </div>
          </div>
          <div class="buttons-container">
            <div class="buttons-list" ref="buttonsList">
              <button
                v-for="parking in filteredParkings"
                :key="parking.id"
                :class="{ active: selectedParking === parking.id }"
                @click="selectParking(parking.id, parking.name)"
              >
                {{ parking.name }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Prawa strona (80%) -->
        <div class="right-side">
          <div class="right-header">
            <div class="selected-parking-title">{{ selectedParkingName }}</div>
          </div>
          <div class="right-buttons">
            <button
              @click="handleRightButtonClick('Parking')"
              :class="{ active: rightSelected === 'Parking' }"
            >
              Parking
            </button>
            <button
              @click="handleRightButtonClick('Space')"
              :class="{ active: rightSelected === 'Space' }"
            >
              Space
            </button>
            <button
              @click="handleRightButtonClick('Car')"
              :class="{ active: rightSelected === 'Car' }"
            >
              Car
            </button>
          </div>
          <div class="content-container">
            <!-- Tutaj dodaj dynamiczny content w zależności od wybranego przycisku -->
            <div class="dynamic-content">
              <!-- Treść w zależności od wybranego przycisku -->
            </div>
          </div>
        </div>
      </div>
    </TopBar>
  </template>
  
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
  </script>
  
  <style scoped>
  /* Globalne style */
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
  }
  
  /* Styl kontenera głównego */
  .container {
    display: flex;
    justify-content: space-between;
    background-color: #eef0e5;
    min-height: 100vh; /* Minimalna wysokość ekranu */
    color: #333; /* Kolor tekstu */
  }
  
  /* Styl lewej strony */
  .left-side {
    padding-top: 60px;
    width: 18%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 1%;
    border-right: 1px solid #ccc;
  }
  
  /* Styl prawej strony */
  .right-side {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* Styl nagłówka prawej strony */
  .right-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  /* Styl nagłówka h1 */
  h1 {
    margin-bottom: 20px;
    color: #333; /* Kolor tekstu */
  }
  
  /* Styl pola wyszukiwania */
  .search-container {
    width: 100%;
    margin-bottom: 25px;
    position: relative;
  }
  
  label.active-label {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    color: #ccc;
    pointer-events: none;
    transition: transform 0.3s, font-size 0.3s;
  }
  
  .search-input-container {
    position: relative;
    width: 100%;
  }
  
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    width: calc(100% - 30px);
    max-height: 200px;
    color: #333; /* Kolor tekstu */
  }
  
  /* Styl kontenera przycisków */
  .buttons-container {
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: thin; /* Dla przeglądarek nie opartych na Chromium */
    margin-right: 10px; /* Dodany margines po prawej stronie suwaka */
  }
  
  .buttons-container::-webkit-scrollbar {
    width: 10px;
    margin-left: 10px; /* Dodany margines po lewej stronie suwaka */
  }
  
  .buttons-container::-webkit-scrollbar-thumb {
    background-color: #4caf50; /* Kolor kciuka suwaka */
    border-radius: 20px;
    border: 6px solid transparent;
  }
  
  .buttons-container::-webkit-scrollbar-track {
    background-color: #eef0e5; /* Kolor toru suwaka */
  }
  
  .buttons-list {
    width: 100%;
    overflow: hidden;
  }
  
  /* Styl przycisków */
  button {
    margin: 5px;
    padding: 10px;
    cursor: pointer;
    border: none;
    border-radius: 20px;
    background-color: #4caf50;
    color: #ffffff;
    width: 100%;
    height: 40px;
    transition: background-color 0.3s;
  }
  
  button.active {
    background-color: #9d1856;
  }
  
  /* Dodatkowy efekt dla przycisków po najechaniu myszką */
  button:hover {
    background-color: #4d388e;
  }
  
  /* Styl prawej granicy */
  .right-border {
    width: 1px;
    height: 100%;
    background-color: #ccc;
    margin-left: 10px;
  }
  
  /* Styl tytułu wybranego parkingu */
  .selected-parking-title {
    font-size: 30px;
    margin-bottom: 10px;
    margin-top: 30px;
    font-weight: bold;
    color: #333; /* Kolor tekstu */
  }
  
  /* Styl przycisków po prawej stronie */
  .right-buttons {
    display: flex;
    justify-content: space-between;
    margin-left: 13%;
    margin-right: 14%;
    width: 73%;
  }
  
  /* Styl kontenera na dynamiczny content */
  .content-container {
    flex-grow: 1;
  }
  
  /* Styl dynamicznego contentu */
  .dynamic-content {
    margin-top: 5%;
    height: 95%;
 
  }
  </style>
  