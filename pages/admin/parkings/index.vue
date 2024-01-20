<script setup>
import TopBar from "/components/TopBar.vue";
import { ref } from "vue";


</script>

<template>
  <div style="background-color: var(--bg-light);height: 100%;">
    <TopBar>
      <div class="background">
        <h1>Car parks</h1>

        

        <div class="buttons">
          <NuxtLink to="/">
            <button class="back">Back</button>
          </NuxtLink>
          <button @click="create">Create</button>
        </div>
      </div>
    </TopBar>
  </div>
</template>

<style scoped>

.background {
  background-color: white;
  width: 40%;
  margin: 3% auto 0 auto;
  border-radius: 30px;
  padding: 2%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  color: var(--shadow);
  font-weight: 1500;
  font-size: 60px;
  margin-top: 5%;
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
</style>
