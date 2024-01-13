<script setup lang="ts">
const { signIn } = useAuth();

const email = ref("");
const password = ref("");

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
const isError = ref(false);
const isErrorTooManyTries = ref(false);

const handleSignIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    isError.value = false;
    isErrorTooManyTries.value = false;
    //https://sidebase.io/nuxt-auth/application-side/custom-sign-in-page
    const { error, url } = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (error) {
      isError.value = true;
    } else {
      console.log(url);
      // No error, continue with the sign in, e.g., by following the returned redirect:
      return navigateTo(url, { external: true });
    }
  } catch (error) {
    isErrorTooManyTries.value = true;
  }
};
</script>

<template>
  <div class="login">
    <label class="login-title">ZALOGUJ SIĘ</label>
    <div class="login-form">
      <div class="login-form-container">
        <label class="label">Adres email</label>
        <input v-model="email" type="text" name="email" class="login-input" />
        <label class="label">Hasło</label>
        <input
          v-model="password"
          type="password"
          name="password"
          class="login-input"
        />
        <span class="alert-error" v-if="isError">Incorrect credentials</span>
        <span class="alert-error" v-if="isErrorTooManyTries"
          >Too many tries. Try again in a minute.
        </span>
        <button
          @click="handleSignIn({ email, password })"
          class="login-form-button"
        >
          Login
        </button>
      </div>
    </div>
    <span class="have-account">Nie masz jeszcze konta? </span>
    <NuxtLink to="/signup" class="span-login">Zarejestruj się!</NuxtLink>
  </div>
</template>

<style scoped>
.login-button,
.login-button,
.split {
  background: transparent;
  border: 0;
  font-weight: 400;
  color: #fff;
  font-size: 24px;
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

.login-button:hover,
.login-button:hover {
  cursor: pointer;
}

.login {
  color: #163020;
  display: block;
  text-align: center;
  font-weight: 500;
  font-size: 69px;
  width: 100%;
  height: 100%;
  margin-top: 100px;
}

.login-form-container {
  display: block;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.login-title {
  margin-top: 100px;
}

.login-form {
  position: block;
}

.login-input {
  display: block;
  width: 100%;
  height: 40px;
  border-radius: 7px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
}

.login-form-button {
  margin-top: 20px;
  display: block;
  width: 100%;
  height: 40px;
}

.login-form-button {
  width: 150px;
  height: 40px;
  background-color: #163020;
  color: #fff;
  border: 0;
  border-radius: 7px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
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
  color: #163020;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
