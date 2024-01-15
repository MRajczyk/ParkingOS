<script setup>
import TopBar from "/components/TopBar.vue";
import axios from "axios";
definePageMeta({ middleware: "auth" });

const { status, data } = useAuth();

const name = ref("");
const surname = ref("");
const firstPassword = ref("");
const secondPassword = ref("");

const isNameError = ref(false);
const isSurnameError = ref(false);
const passwordError = ref("");

const putSuccess = ref("");
const putError = ref("");

axios
  .get("http://localhost:3000/api/profiles/" + data.value.user.id)
  .then((response) => {
    name.value = response.data.data.name;
    surname.value = response.data.data.surname;
  })
  .catch((error) => {
    alert(error);
  });

function checkPassword(str) {
  var re =
    /^(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~*]{8,}$/;
  return re.test(str);
}

function putUserProfile() {
  isSurnameError.value = false;
  isNameError.value = false;
  passwordError.value = "";
  putSuccess.value = "";
  putError.value = "";

  if (name.value.length === 0) {
    isNameError.value = true;
  }
  if (surname.value.length === 0) {
    return;
  }
  if (
    firstPassword.value.length === 0 ||
    !secondPassword.value.length === 0 ||
    firstPassword.value !== secondPassword.value
  ) {
    passwordError.value = "Incorrect Password";
  }

  if (!checkPassword(firstPassword.value)) {
    passwordError.value =
      "Password must contain at least one lowercase, one uppercase, one digit and one special character while being 8 characters long.";
  }

  if (
    passwordError.value.length > 0 ||
    isNameError.value ||
    isSurnameError.value
  ) {
    return;
  }

  axios
    .put("http://localhost:3000/api/profiles", {
      id: data.value.user.id,
      name: name.value,
      surname: surname.value,
      password: firstPassword.value,
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
        <form
          class="profile-form"
          v-on:submit.prevent="onsubmit"
          method="POST"
          @submit="putUserProfile()"
        >
          <label class="profile-label">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            class="profile-input"
            v-model="name"
          />
          <span class="info-span" style="color: red" v-if="isNameError">
            Enter valid name
          </span>
          <label class="profile-label">Surname</label>
          <input
            type="text"
            placeholder="Surname"
            name="surname"
            class="profile-input"
            v-model="surname"
          />
          <span class="info-span" style="color: red" v-if="isSurnameError">
            Enter valid surname
          </span>
          <label class="profile-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            class="profile-input"
            v-model="firstPassword"
          />
          <span
            class="info-span"
            style="color: red"
            v-if="passwordError.length > 0"
          >
            {{ passwordError }}
          </span>
          <label class="profile-label">Repeat password</label>
          <input
            type="password"
            placeholder="Repeat Password"
            name="password"
            v-model="secondPassword"
            class="profile-input"
          />
          <span
            class="info-span"
            style="color: red"
            v-if="passwordError.length > 0"
          >
            {{ passwordError }}
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
      </div>
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
  display: block;
  width: 100%;
  height: 40px;
}

.profile-form-button {
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
  margin-top: 10px;
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
