<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const username = ref("");
const email = ref("");
const firstPassword = ref("");
const secondPassword = ref("");

const isNameError = ref(false);
const isEmailError = ref(false);
const passwordError = ref("");

const registerSuccess = ref("");
const registerError = ref("");

function registerUser() {
  console.log("function fired");
  registerSuccess.value = "";
  registerError.value = "";

  if (username.value.length === 0) {
    isNameError.value = true;
  }
  if (email.value.length === 0) {
    isEmailError.value = true;
  }
  if (
    firstPassword.value.length === 0 ||
    !secondPassword.value.length === 0 ||
    firstPassword.value !== secondPassword.value
  ) {
    passwordError.value = "Passwords don't match";
  }

  if (
    isEmailError.value ||
    passwordError.value.length > 0 ||
    isNameError.value
  ) {
    return;
  }

  isNameError.value = false;
  isEmailError.value = false;
  passwordError.value = "";

  axios
    .post("http://localhost:3000/api/profiles", {
      username: username.value,
      email: email.value,
      password: firstPassword.value,
    })
    .then((response) => {
      console.log(response);
      registerSuccess.value = response.data.statusMessage;
    })
    .catch((error) => {
      console.log(error);
      registerError.value = error.response.data.statusMessage;
    });
}
</script>

<template>
  <TopBar />
  <div class="register">
    <label class="register-title">ZAREJESTRUJ SIĘ</label>
    <form
      class="register-form"
      v-on:submit.prevent="onsubmit"
      method="POST"
      @submit="registerUser()"
    >
      <div class="register-form-container">
        <label class="label">Nazwa użytkownika</label>
        <input
          type="text"
          name="username"
          class="register-input"
          v-model="username"
        />
        <span class="info-span" style="color: red" v-if="isNameError">
          Enter valid username
        </span>
        <label class="label">Email</label>
        <input
          type="text"
          name="email"
          v-model="email"
          class="register-input"
        />
        <span class="info-span" style="color: red" v-if="isEmailError">
          Please enter valid email!
        </span>
        <label class="label">Hasło</label>
        <input
          type="password"
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
        <label class="label">Powtórz hasło</label>
        <input
          type="password"
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
        <span
          class="info-span"
          style="color: red"
          v-if="registerError.length > 0"
        >
          {{ registerError }}
        </span>
        <span
          class="info-span"
          style="color: green"
          v-if="registerSuccess.length > 0"
        >
          {{ registerSuccess }}
        </span>
        <button type="submit" class="register-form-button">Sign-up</button>
      </div>
    </form>
    <span class="have-account">Masz już konto? </span>
    <NuxtLink to="/signin" class="span-login">Zaloguj się!</NuxtLink>
  </div>
</template>

<style scoped>
.info-span {
  display: block;
  font-size: 13px;
  margin-top: 3px;
}
.register {
  color: #da80a8;
  display: block;
  text-align: center;
  font-family: Poppins;
  font-weight: 500;
  font-size: 69px;
  width: 100%;
  height: 100%;
  margin-top: 60px;
}

.register-title {
  padding-bottom: 20px;
}

.register-form-container {
  display: block;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.register-form {
  display: block;
}

.register-input {
  display: block;
  width: 100%;
  height: 40px;
  border-radius: 7px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
}

.register-form-button {
  margin-top: 30px;
  display: block;
  width: 150px;
  height: 40px;
  background-color: #f589b0;
  color: #fff0de;
  border: 0;
  border-radius: 7px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  font-family: Poppins;
  font-size: 1.2rem;
  cursor: pointer;
}

.have-account {
  padding: 0;
  color: black;
  font-size: 20px;
  font-weight: 400;
}

.span-login {
  padding: 0;
  color: blue;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
}

.label {
  font-size: 13px;
  color: gray;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
