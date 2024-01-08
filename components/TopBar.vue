<script setup>
const { status, signOut } = useAuth();
</script>

<template>
  <div class="topbar">
    <div class="topbar-buttons">
      <NuxtLink to="/finder/search" class="link">
        <span class="profile-link">Finder</span>
      </NuxtLink>
      <span class="split" style="font-weight: 200">|</span>
      <NuxtLink to="/payment" class="link">
        <span class="profile-link">Payment</span>
      </NuxtLink>
    </div>
    <NuxtLink to="/">
      <div class="topbar-title">
        <span style="vertical-align: middle">ParkingOS</span>
      </div>
    </NuxtLink>
    <div class="topbar-buttons">
      <NuxtLink to="/profile" class="link">
        <span class="profile-link">Account</span>
      </NuxtLink>
      <span class="split" style="font-weight: 200">|</span>
      <button @click="signOut({ callbackUrl: '/' })" class="logout">
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  background: #304d30;
}

.topbar-title {
  color: #fff;
  display: inline-block;
  font-weight: 600;
  font-size: 36px;
  cursor: pointer;
}

.link {
  text-decoration: none;
}

.topbar-buttons {
  display: inline-block;
  line-height: 58px;
}

.recipes,
.profile-link,
.create,
.logout,
.login,
.register,
.split {
  background: transparent;
  border: 0;
  font-weight: 400;
  text-decoration: none;
  color: #fff;
  font-size: 24px;
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
