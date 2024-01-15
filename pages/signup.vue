<script setup>
import axios from "axios";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const name = ref("");
const surname = ref("");
const email = ref("");
const firstPassword = ref("");
const secondPassword = ref("");

const isNameError = ref(false);
const isSurnameError = ref(false);
const isEmailError = ref(false);
const passwordError = ref("");

const registerSuccess = ref("");
const registerError = ref("");

function checkPassword(str) {
  var re =
    /^(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~*]{8,}$/;
  return re.test(str);
}

function registerUser() {
  isNameError.value = false;
  isSurnameError.value = false;
  isEmailError.value = false;
  passwordError.value = "";
  registerSuccess.value = "";
  registerError.value = "";

  if (name.value.length === 0) {
    isNameError.value = true;
  }
  if (surname.value.length === 0) {
    isSurnameError.value = true;
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

  if (!checkPassword(firstPassword.value)) {
    passwordError.value =
      "Password must contain at least one lowercase, one uppercase, one digit and one special character while being 8 characters long.";
  }

  if (
    isEmailError.value ||
    passwordError.value.length > 0 ||
    isNameError.value ||
    isSurnameError.value
  ) {
    return;
  }

  axios
    .post("http://localhost:3000/api/profiles", {
      name: name.value,
      surname: surname.value,
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
  <div class="register">
    <form
      class="register-form"
      v-on:submit.prevent="onsubmit"
      method="POST"
      @submit="registerUser()"
    >
      <label class="register-subtitle">Sign in to</label>
      <label class="register-title">ParkingOS</label>
      <NuxtLink to="/signin" class="register-link" style="margin-top: 50px"
        >Already have an account? Sign in!
      </NuxtLink>
      <label class="register-label">Email address</label>
      <input
        type="text"
        name="email"
        placeholder="Email"
        v-model="email"
        class="register-input"
      />
      <span class="info-span" style="color: red" v-if="isEmailError">
        Please enter valid email!
      </span>
      <label class="register-label">Name</label>
      <input
        type="text"
        name="name"
        placeholder="Name"
        class="register-input"
        v-model="name"
      />
      <span class="info-span" style="color: red" v-if="isNameError">
        Enter valid name
      </span>
      <label class="register-label">Surname</label>
      <input
        type="text"
        placeholder="Surname"
        name="surname"
        class="register-input"
        v-model="surname"
      />
      <span class="info-span" style="color: red" v-if="isSurnameError">
        Enter valid surname
      </span>
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
      <span
        class="info-span"
        style="color: red"
        v-if="registerError.length > 0"
      >
        {{ registerError }}
      </span>
      <span
        class="info-span"
        style="color: green; align-self: center"
        v-if="registerSuccess.length > 0"
      >
        {{ registerSuccess }}
      </span>
      <button type="submit" class="register-form-button">Sign-up</button>
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
