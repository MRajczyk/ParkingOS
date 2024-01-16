<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
import { checkPassword } from "/utils/utils";

const { status, data } = useAuth();

const currentPassword = ref("");
const currentPasswordError = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const newPasswordError = ref("");

const putSuccess = ref("");
const putError = ref("");

function putNewPassword() {
  currentPasswordError.value = "";
  newPasswordError.value = "";
  putSuccess.value = "";
  putError.value = "";

  if (currentPassword.value.length === 0) {
    currentPasswordError.value = "Current password can't be blank";
  }

  if (
    newPassword.value.length === 0 ||
    confirmNewPassword.value.length === 0 ||
    newPassword.value !== confirmNewPassword.value
  ) {
    newPasswordError.value = "Passwords dont match!";
  }

  if (!checkPassword(newPassword.value)) {
    newPasswordError.value =
      "Password must contain at least one lowercase, one uppercase, one digit and one special character while being 8 characters long.";
  }

  if (
    newPasswordError.value.length > 0 ||
    currentPasswordError.value.length > 0
  ) {
    return;
  }

  axios
    .put("http://localhost:3000/api/profiles/password", {
      id: data.value.user.id,
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })
    .then((response) => {
      putSuccess.value = response.data.statusMessage;
    })
    .catch((error) => {
      putError.value = error.response.data.statusMessage;
    });
}
</script>

<template>
  <form
    class="profile-form"
    v-on:submit.prevent="onsubmit"
    method="POST"
    @submit="putNewPassword()"
  >
    <label class="profile-label">New password</label>
    <input
      type="password"
      placeholder="New Password"
      name="newPassword"
      class="profile-input"
      v-model="newPassword"
    />
    <span
      class="info-span"
      style="color: red"
      v-if="newPasswordError.length > 0"
    >
      {{ newPasswordError }}
    </span>
    <label class="profile-label">Confirm new password</label>
    <input
      type="password"
      placeholder="Repeat Password"
      name="confirmNewPassword"
      v-model="confirmNewPassword"
      class="profile-input"
    />
    <span
      class="info-span"
      style="color: red"
      v-if="newPasswordError.length > 0"
    >
      {{ newPasswordError }}
    </span>
    <label class="profile-label">Current password</label>
    <input
      type="password"
      placeholder="Current Password"
      name="currentPassword"
      v-model="currentPassword"
      class="profile-input"
    />
    <span
      class="info-span"
      style="color: red"
      v-if="currentPasswordError.length > 0"
    >
      {{ currentPasswordError }}
    </span>
    <span class="info-span" style="color: red" v-if="putError.length > 0">
      {{ putError }}
    </span>
    <span
      class="info-span"
      style="color: green; align-self: center"
      v-if="putSuccess.length > 0"
    >
      {{ putSuccess }}
    </span>
    <button type="submit" class="profile-form-button">Update</button>
  </form>
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

.profile-form {
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

@media screen and (min-width: 700px) {
  .profile-nav-buttons {
    flex-direction: row;
    padding: 50px 0px;
    gap: 20px;
  }

  .profile-form {
    width: 360px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
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

.profile-form-button {
  margin-top: 20px;
  width: 220px;
  height: 50px;
  background-color: var(--primary-lighter);
  color: #fff;
  border: 0;
  border-radius: 25px;
  font-weight: 600;
  font-size: 24px;
  cursor: pointer;
  align-self: center;
}

.profile-link {
  color: var(--primary-lighter);
  align-self: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-decoration-line: underline;
}

.profile-input {
  display: block;
  width: calc(100% - 12px);
  height: 36px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
  background-color: transparent;
}

.profile-input:focus {
  outline: none !important;
  border: 2px solid var(--primary-lighter);
}

.profile-label {
  margin-top: 20px;
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
