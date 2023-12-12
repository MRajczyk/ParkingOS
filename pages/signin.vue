<script setup lang="ts">
const { signIn } = useAuth();

const username = ref("");
const password = ref("");

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
const isError = ref(false);

const handleSignIn = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  //https://sidebase.io/nuxt-auth/application-side/custom-sign-in-page
  const { error, url } = await signIn("credentials", {
    username,
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
};
</script>

<template>
  <TopBar />
  <div class="login">
    <label class="register-title">ZALOGUJ SIĘ</label>
    <div class="register-form">
      <div class="login-form-container">
        <label class="label">Nazwa użytkownika</label>
        <input
          v-model="username"
          type="text"
          name="username"
          class="login-input"
        />
        <label class="label">Hasło</label>
        <input
          v-model="password"
          type="password"
          name="password"
          class="login-input"
        />
        <span class="alert-error" v-if="isError">Błędne dane logowania! </span>
        <button
          @click="handleSignIn({ username, password })"
          class="login-form-button"
        >
          Login
        </button>
      </div>
    </div>
    <span class="have-account">Nie masz jeszcze konta? </span>
    <NuxtLink to="/signup" class="span-register">Zarejestruj się!</NuxtLink>
  </div>
</template>

<style scoped>
.login-button,
.register-button,
.split {
  background: transparent;
  border: 0;
  font-family: Poppins;
  font-weight: 400;
  color: #fff;
  font-size: 24px;
}

.alert-error {
  color: #ff0000;
  display: block;
  text-align: center;
  font-family: Poppins;
  font-weight: 500;
  margin-top: 20px;
  font-size: 14px;
  width: 100%;
  height: 100%;
}

.login-button:hover,
.register-button:hover {
  cursor: pointer;
}

.login {
  color: grey;
  display: block;
  text-align: center;
  font-family: Poppins;
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
  background-color: grey;
  color: #fff;
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

.span-register {
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
