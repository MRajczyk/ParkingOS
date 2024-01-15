<script setup>
import TopBar from "/components/TopBar.vue";
import PasswordForm from "/components/account/user-data/PasswordForm.vue";
import PersonalDetailsForm from "/components/account/user-data/PersonalDetailsForm.vue";
definePageMeta({ middleware: "auth" });

const passwordTabOn = ref(false);

function changeFormToPassword() {
  if (passwordTabOn.value !== true) {
    passwordTabOn.value = true;
  }
}

function changeFormToPersonalData() {
  if (passwordTabOn.value !== false) {
    passwordTabOn.value = false;
  }
}
</script>

<template>
  <TopBar>
    <div class="profile">
      <div class="profile-nav-buttons">
        <NuxtLink
          to="/account/user-data"
          class="profile-nav-button"
          style="background-color: var(--primary)"
          >User data
        </NuxtLink>
        <NuxtLink to="/account/balance" class="profile-nav-button"
          >Balance
        </NuxtLink>
        <NuxtLink to="/account/cars" class="profile-nav-button">Cars </NuxtLink>
      </div>
      <div class="profile-form-container">
        <div class="user-data-toggle-buttons-container">
          <button
            @click="changeFormToPersonalData()"
            class="user-data-toggle-button"
            :style="
              passwordTabOn
                ? { backgroundColor: 'var(--bg-darker)' }
                : { backgroundColor: 'var(--primary)' }
            "
          >
            Personal Data
          </button>
          <button
            @click="changeFormToPassword()"
            class="user-data-toggle-button"
            :style="
              passwordTabOn
                ? { backgroundColor: 'var(--primary)' }
                : { backgroundColor: 'var(--bg-darker)' }
            "
          >
            Password
          </button>
        </div>
        <PersonalDetailsForm v-if="!passwordTabOn" />
        <PasswordForm v-if="passwordTabOn" />
      </div>
    </div>
  </TopBar>
</template>

<style scoped>
.profile-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

.user-data-toggle-buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.user-data-toggle-button {
  border-radius: 20px;
  text-decoration: none;
  text-align: center;
  width: 150px;
  padding: 10px 0px;
  color: white;
  border: 0;
}

.info-span {
  display: block;
  font-size: 13px;
  margin-top: 3px;
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

  .user-data-toggle-buttons-container {
    flex-direction: row;
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

.profile-label {
  margin-top: 10px;
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
