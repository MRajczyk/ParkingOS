<script setup>
import TopBar from "/components/TopBar.vue";
</script>

<template>
  <TopBar>
    <div class="home-container">Home page</div>
  </TopBar>
</template>

<style scoped>
@media only screen and (max-width: 1000px) {
}
.home-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
