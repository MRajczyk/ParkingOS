<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });

const { status, data } = useAuth();

const name = ref(data.value.user.name);
const surname = ref(data.value.user.surname);
const email = ref(data.value.user.email);
const firstPassword = ref("");
const secondPassword = ref("");

const isNameError = ref(false);
const isSurnameError = ref(false);
const isEmailError = ref(false);
const passwordError = ref("");

const patchSuccess = ref("");
const patchError = ref("");

function putUserProfile() {
  patchSuccess.value = "";
  patchError.value = "";

  if (name.value.length === 0) {
    isNameError.value = true;
    return;
  }
  if (surname.value.length === 0) {
    isSurnameError.value = true;
    return;
  }
  if (email.value.length === 0) {
    isEmailError.value = true;
    return;
  }
  if (
    firstPassword.value.length === 0 ||
    !secondPassword.value.length === 0 ||
    firstPassword.value !== secondPassword.value
  ) {
    passwordError.value = "Incorrect Password";
    return;
  }
  isSurnameError.value = false;
  isNameError.value = false;
  isEmailError.value = false;
  passwordError.value = "";

  axios
    .put("http://localhost:3000/api/profiles", {
      name: name.value,
      surname: surname.value,
      email: email.value,
      password: firstPassword.value,
    })
    .then((response) => {
      patchSuccess.value = response.data.statusMessage;
    })
    .catch((error) => {
      patchError.value = error.response.data.statusMessage;
    });
}
</script>

<template>
  <TopBar>
    <div class="content">
      <div class="edit-picture-container">
        <img
          style="vertical-align: middle; margin-top: 35px"
          src="/images/user.png"
        />
      </div>
      <div class="personal-data-form-container">
        <form
          v-on:submit.prevent="onsubmit"
          class="edit-personal-data-form"
          method="PUT"
          @submit="putUserProfile()"
        >
          <div class="edit-personal-data-form-container">
            <div class="setting-wraper">
              <label class="label">Name</label>
              <input
                form="none"
                type="text"
                name="name"
                v-model="name"
                class="edit-personal-data-input"
              />
              <span class="info-span" style="color: red" v-if="isNameError">
                Incorrect name
              </span>
            </div>
            <div class="setting-wraper">
              <label class="label">Surname</label>
              <input
                form="none"
                type="text"
                name="surname"
                v-model="surname"
                class="edit-personal-data-input"
              />
              <span class="info-span" style="color: red" v-if="isNameError">
                Incorrect surname
              </span>
            </div>
            <div class="setting-wraper">
              <label class="label">Email</label>
              <input
                type="text"
                name="email"
                v-model="email"
                class="edit-personal-data-input"
              />
              <span class="info-span" style="color: red" v-if="isEmailError">
                Incorrect email address
              </span>
            </div>
            <div class="setting-wraper">
              <label class="label">Hasło</label>
              <input
                v-model="firstPassword"
                type="password"
                name="password"
                class="edit-personal-data-input"
              />
              <span
                class="info-span"
                style="color: red"
                v-if="passwordError.length > 0"
              >
                {{ passwordError }}
              </span>
            </div>
            <div class="setting-wraper">
              <label class="label">Powtórz hasło</label>
              <input
                v-model="secondPassword"
                type="password"
                class="edit-personal-data-input"
              />
              <span
                class="info-span"
                style="color: red"
                v-if="passwordError.length > 0"
              >
                {{ passwordError }}
              </span>
            </div>
            <span
              class="info-span"
              style="color: red"
              v-if="patchError.length > 0"
            >
              {{ patchError }}
            </span>
            <span
              class="info-span"
              style="color: green"
              v-if="patchSuccess.length > 0"
            >
              {{ patchSuccess }}
            </span>
            <button type="submit" class="edit-personal-data-form-button">
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  </TopBar>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  padding-bottom: 1000px;
}

.info-span {
  display: block;
  font-size: 13px;
  margin-top: 3px;
}

.content {
  display: flex;
  width: 100%;
  height: 100%;
  color: #163020;
  text-align: center;
  font-size: 69px;
  margin-top: 40px;
}

.edit-picture-container {
  margin-left: 25%;
  margin-right: 5%;
  height: 100%;
  width: 30%;
}

.personal-data-form-container {
  height: 100%;
  width: 70%;
  margin-right: 10%;
}

.edit-personal-data-form-container {
  width: 100%;
}

.edit-personal-data-form {
  width: 100%;
  text-align: left;
}

.edit-personal-data-input {
  margin-top: 0px;
  margin-right: 12px;
  display: block;
  width: 40%;
  height: 40px;
  border-radius: 7px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
}

.edit-personal-data-form-button {
  margin-top: 0px;
  display: block;
  width: 20%;
  height: 40px;
  margin-top: 15px;
  background-color: #163020;
  color: #fff;
  border: 0;
  border-radius: 7px;
  text-align: center;
  font-size: 1.2rem;
  cursor: pointer;
}

.setting-wrapper {
  width: 100%;
}

.label {
  font-size: 13px;
  color: #163020;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
