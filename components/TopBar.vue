<script setup>
const { status, signOut } = useAuth();
</script>

<template>
  <div class="topbar">
    <NuxtLink to="/">
      <div class="topbar-title">
        <img
          style="vertical-align: middle; width: 40px; height: 40px"
          src="/images/logo.png"
        />
        <span style="vertical-align: middle">ParkingOS</span>
      </div>
    </NuxtLink>
    <div v-if="status === 'authenticated'">
      <div class="topbar-buttons">
        <button @click="signOut({ callbackUrl: '/' })" class="logout">
          wyloguj
        </button>
        <NuxtLink to="/profile">
          <img style="vertical-align: middle" src="/images/user_info.png" />
        </NuxtLink>
      </div>
    </div>
    <div v-else class="topbar-buttons">
      <NuxtLink to="/signin" class="login">Zaloguj</NuxtLink>
      <span class="split" style="font-weight: 200">|</span>
      <NuxtLink to="/signup" class="register">Zarejestruj</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 1em;
  background: grey;
}

.topbar-title {
  margin-left: 10px;
  color: #fff0de;
  display: inline-block;
  font-family: Poppins;
  font-weight: 600;
  font-size: 36px;
  cursor: pointer;
}

.topbar-buttons {
  display: inline-block;
  line-height: 58px;
}

.recipes,
.create,
.logout,
.login,
.register,
.split {
  background: transparent;
  border: 0;
  font-family: Poppins;
  font-weight: 400;
  text-decoration: none;
  color: #fff0de;
  font-size: 24px;
}

.logout {
  margin-right: 10px;
}

.split {
  margin-left: 5px;
  margin-right: 5px;
}

.logout:hover,
.login:hover,
.register:hover {
  cursor: pointer;
}
</style>
