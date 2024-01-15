<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });
</script>

<template>
  <TopBar>
    <div class="profile">
      <div class="profile-nav-buttons">
        <NuxtLink to="/account/user-data" class="profile-nav-button"
          >User data
        </NuxtLink>
        <NuxtLink to="/account/balance" class="profile-nav-button"
          >Balance
        </NuxtLink>
        <NuxtLink
          to="/account/cars"
          class="profile-nav-button"
          style="background-color: var(--primary)"
          >Cars
        </NuxtLink>
      </div>
      <div class="profile-form-container">Cars</div>
    </div>
  </TopBar>
</template>

<style scoped>
.profile-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 40px;
  padding: 40px;
}
.profile-nav-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0px;
  gap: 16px;
  width: 100%;
}

.profile-nav-button {
  border-radius: 20px;
  text-decoration: none;
  text-align: center;
  width: 150px;
  padding: 10px 0px;
  color: white;
  background-color: var(--bg-darker);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
}

.profile {
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 700px) {
  .profile-nav-buttons {
    flex-direction: row;
    padding: 50px 0px;
    gap: 20px;
  }
}

.alert-error {
  color: #ff0000;
  display: block;
  text-align: center;
  font-weight: 500;
  margin-top: 20px;
  font-size: 14px;
  width: 100%;
  height: 100%;
}
</style>
