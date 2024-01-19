<script setup>
import TopBar from "/components/TopBar.vue";
</script>

<template>
  <div style="background-color: var(--bg-light);">
    <TopBar>
      <div class="bckg">
        <h1>Maker</h1>
        <div class="background"></div>
      </div>
    </TopBar>
  </div>
</template>

<style scoped>
.bckg {
  text-align: center;
}

.background {
  background-color: white;
  width: 30%;
  margin: 5% auto 0 auto;
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
</style>
