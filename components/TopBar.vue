<script setup>
const { data: session, status, signOut } = useAuth();

function hideBurger() {
  const burgerOptions = document.getElementById("burger-options");
  const burgerButton = document.getElementById("burger-button");
  if (burgerOptions.style.display === "flex") {
    burgerOptions.style.display = "none";
    burgerButton.style.color = "white";
    burgerButton.style.backgroundColor = "transparent";
  } else {
    burgerOptions.style.display = "flex";
    burgerButton.style.color = "#304d30";
    burgerButton.style.backgroundColor = "white";
  }
}
</script>

<template>
  <!-- user topbar -->
  <div class="container" v-if="session.user.role === 'USER'">
    <div class="topbar">
      <a
        href="javascript:void(0);"
        class="burger"
        id="burger-button"
        @click="hideBurger()"
      >
        <i class="fa fa-bars"></i>
      </a>
      <div class="topbar-buttons" style="padding-left: 16px">
        <NuxtLink to="/finder/search" class="profile-link">Finder</NuxtLink>
        <span class="split" style="font-weight: 200">|</span>
        <NuxtLink to="/payment" class="profile-link">Payment</NuxtLink>
      </div>
      <NuxtLink to="/" class="topbar-title"> ParkingOS </NuxtLink>
      <div class="topbar-buttons" style="padding-right: 16px">
        <NuxtLink to="/account/user-data" class="profile-link"
          >Account</NuxtLink
        >
        <span class="split" style="font-weight: 200">|</span>
        <button
          @click="signOut({ callbackUrl: '/signin' })"
          class="burger-option"
          style="display: inline; text-decoration: none"
        >
          Logout
        </button>
      </div>
    </div>
    <div class="burger-options" id="burger-options">
      <NuxtLink to="/finder/search" class="burger-option">Finder</NuxtLink>
      <NuxtLink to="/payment" class="burger-option">Payment</NuxtLink>
      <NuxtLink to="/account/user-data" class="burger-option">Account</NuxtLink>
      <button
        @click="signOut({ callbackUrl: '/signin' })"
        class="burger-option"
      >
        Logout
      </button>
    </div>
    <slot></slot>
  </div>
  <!-- admin topbar -->
  <div class="container" v-if="session.user.role === 'ADMIN'">
    <div class="topbar">
      <a
        href="javascript:void(0);"
        class="burger"
        id="burger-button"
        @click="hideBurger()"
      >
        <i class="fa fa-bars"></i>
      </a>
      <div class="topbar-buttons" style="padding-left: 16px">
        <NuxtLink to="/admin/temp-maker" class="profile-link">Maker</NuxtLink>
        <span class="split" style="font-weight: 200">|</span>
        <NuxtLink to="/admin/temp-maker" class="profile-link">Users</NuxtLink>
        <span class="split" style="font-weight: 200">|</span>
        <NuxtLink to="/admin/temp-maker" class="profile-link"
          >Live View</NuxtLink
        >
      </div>
      <NuxtLink to="/" class="topbar-title"> ParkingOS </NuxtLink>
      <div class="topbar-buttons" style="padding-right: 16px">
        <NuxtLink to="/admin/statistics/stat" class="profile-link"
          >Statistics</NuxtLink
        >
        <span class="split" style="font-weight: 200">|</span>
        <NuxtLink to="/admin/summary" class="profile-link">Summary</NuxtLink>
        <span class="split" style="font-weight: 200">|</span>
        <button
          @click="signOut({ callbackUrl: '/signin' })"
          class="burger-option"
          style="display: inline; text-decoration: none"
        >
          Logout
        </button>
      </div>
    </div>
    <div class="burger-options" id="burger-options">
      <NuxtLink to="/admin/temp-maker" class="burger-option">Maker</NuxtLink>
      <NuxtLink to="/admin/temp-maker" class="burger-option">Users</NuxtLink>
      <NuxtLink to="/admin/temp-maker" class="burger-option"
        >Live view</NuxtLink
      >
      <NuxtLink to="/admin/statistics/stat" class="burger-option"
        >Statistics</NuxtLink
      >
      <NuxtLink to="/admin/summary" class="burger-option">Summary</NuxtLink>
      <button
        @click="signOut({ callbackUrl: '/signin' })"
        class="burger-option"
      >
        Logout
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.topbar {
  display: flex;
  width: 100%;
  min-height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: var(--primary-lighter);
}

.topbar-title {
  color: #fff;
  display: inline-block;
  font-weight: 600;
  font-size: 36px;
  cursor: pointer;
  text-decoration: none;
}

.topbar-buttons {
  display: none;
}

.burger {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0px;
  width: 60px;
  height: 60px;
  background: transparent;
  border: 0;
  text-decoration: none;
  color: #fff;
  font-size: 36px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.burger-options {
  display: none;
  position: absolute;
  top: 60px;
  flex-direction: column;
  background-color: var(--primary-lighter);
  width: 200px;
  border-top: 2px solid #fff;
}

.burger-option {
  text-align: start;
  display: block;
  background: transparent;
  border: 0;
  font-weight: 400;
  padding: 12px;
  text-decoration: none;
  color: #fff;
  font-size: 24px;
  border-bottom: 2px solid #fff;
  cursor: pointer;
}

.burger-option:hover {
  cursor: pointer;
}

.burger-options:last-child {
  border: none;
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

a.logout:hover,
.login:hover,
.register:hover {
  cursor: pointer;
}

@media screen and (min-width: 900px) {
  .burger-options {
    display: none;
  }
  .burger-option {
    display: none;
  }
  .burger {
    display: none;
  }
  .topbar-buttons {
    display: inline-block;
    line-height: 58px;
  }

  .topbar {
    justify-content: space-between;
  }

  .burger-option {
    cursor: pointer;
    border-bottom: none;
    padding: 0;
  }
}
</style>
