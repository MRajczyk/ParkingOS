<script setup>
import { checkPassword } from "/utils/utils";
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
import axios from "axios";

const route = useRoute();

const firstPassword = ref("");
const secondPassword = ref("");
const passwordError = ref("");
const tokenError = ref("");
const resetSuccess = ref("");
const resetError = ref("");

function resetPassword() {
  tokenError.value = "";
  passwordError.value = "";
  resetSuccess.value = "";
  resetError.value = "";

  if (
    firstPassword.value.length === 0 ||
    !secondPassword.value.length === 0 ||
    firstPassword.value !== secondPassword.value
  ) {
    passwordError.value = "Passwords don't match";
  }

  if (!checkPassword(firstPassword.value)) {
    passwordError.value =
      "Password must contain at least one lowercase, one uppercase, one digit and one special character while being 8 characters long.";
  }

  if (passwordError.value.length > 0) {
    return;
  }
  if (!route.params.token || !route.params.token.length) {
    tokenError.value = "Invalid password reset token";
    return;
  }

  axios
    .post("http://localhost:3000/api/reset-password", {
      token: route.params.token,
      password: firstPassword.value,
    })
    .then((response) => {
      console.log(response);
      resetSuccess.value = response.data.statusMessage;
    })
    .catch((error) => {
      console.log(error);
      resetError.value = error.response.data.statusMessage;
    });
}
</script>

<template>
  <div class="register">
    <form
      class="register-form"
      v-on:submit.prevent="onsubmit"
      method="POST"
      @submit="resetPassword()"
    >
      <label class="register-subtitle">Password reset</label>
      <label class="register-title">ParkingOS</label>
      <label class="register-label">Password</label>
      <input
        type="password"
        placeholder="Password"
        name="password"
        class="register-input"
        v-model="firstPassword"
      />
      <span
        class="info-span"
        style="color: red"
        v-if="passwordError.length > 0"
      >
        {{ passwordError }}
      </span>
      <span class="info-span" style="color: red" v-if="tokenError.length > 0">
        {{ tokenError }}
      </span>
      <label class="register-label">Repeat password</label>
      <input
        type="password"
        placeholder="Repeat Password"
        name="password"
        v-model="secondPassword"
        class="register-input"
      />
      <span
        class="info-span"
        style="color: red"
        v-if="passwordError.length > 0"
      >
        {{ passwordError }}
      </span>
      <span class="info-span" style="color: red" v-if="resetError.length > 0">
        {{ resetError }}
      </span>
      <span
        class="info-span"
        style="color: green; align-self: center"
        v-if="resetSuccess.length > 0"
      >
        {{ resetSuccess }}
      </span>
      <button type="submit" class="register-form-button">Reset password</button>
      <NuxtLink
        to="/signin"
        class="register-form-button"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
        "
        >Back
      </NuxtLink>
    </form>
  </div>
</template>

<style scoped>
.info-span {
  display: block;
  font-size: 13px;
  margin-top: 3px;
}
.register {
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}

.register-subtitle {
  color: var(--primary-lighter);
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.register-title {
  color: var(--primary);
  font-size: 42px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.register-form {
  padding-top: 100px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

@media screen and (min-width: 700px) {
  .register-subtitle {
    color: var(--primary-lighter);
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .register-title {
    color: var(--primary);
    font-size: 72px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .register-form {
    padding-top: 100px;
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

.register-form-button {
  margin-top: 20px;
  display: block;
  width: 100%;
  height: 40px;
}

.register-form-button {
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

.register-link {
  color: var(--primary-lighter);
  align-self: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-decoration-line: underline;
}

.register-input {
  display: block;
  width: 100%;
  height: 36px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
  background-color: transparent;
}

.register-input:focus {
  outline: none !important;
  border: 2px solid var(--primary-lighter);
}

.register-label {
  margin-top: 10px;
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
