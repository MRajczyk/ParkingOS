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
    <div class="login-form">
      <label class="login-subtitle">Sign in to</label>
      <label class="login-title">ParkingOS</label>
      <NuxtLink to="/signup" class="login-link" style="margin-top: 50px"
        >Don't have an account? Sign up!</NuxtLink
      >
      <label class="label">Email Address</label>
      <input
        placeholder="Email"
        v-model="email"
        type="text"
        name="email"
        class="login-input"
      />
      <label class="label">Password</label>
      <input
        v-model="password"
        type="password"
        name="password"
        class="login-input"
        placeholder="Password"
      />
      <span class="alert-error" v-if="isError">Incorrect credentials</span>
      <span class="alert-error" v-if="isErrorTooManyTries"
        >Too many tries. Try again in a minute.
      </span>
      <NuxtLink to="/signup" class="login-link" style="margin-top: 10px"
        >Forgot password?</NuxtLink
      >
      <button
        @click="handleSignIn({ email, password })"
        class="login-form-button"
      >
        Login
      </button>
    </div>
  </div>
</template>

<style scoped>
.login {
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}

.login-subtitle {
  color: var(--primary-lighter);
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.login-title {
  color: var(--primary);
  font-size: 42px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.login-form {
  padding-top: 100px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

@media screen and (min-width: 700px) {
  .login-subtitle {
    color: var(--primary-lighter);
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .login-title {
    color: var(--primary);
    font-size: 72px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .login-form {
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

.login-form-button {
  margin-top: 20px;
  display: block;
  width: 100%;
  height: 40px;
}

.login-form-button {
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

.login-link {
  color: var(--primary-lighter);
  align-self: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-decoration-line: underline;
}

.login-input {
  display: block;
  width: 100%;
  height: 36px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
  background-color: transparent;
}

.login-input:focus {
  outline: none !important;
  border: 2px solid var(--primary-lighter);
}

.label {
  margin-top: 10px;
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}
</style>
