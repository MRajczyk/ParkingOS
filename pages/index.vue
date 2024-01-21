<script setup>
definePageMeta({ middleware: "auth" });
import TopBar from "/components/TopBar.vue";

const { data: session, status, signOut } = useAuth();
</script>
<template>
  <TopBar>
    <!-- user home screen -->
    <div class="home-container" v-if="session.user.role === 'USER'">
      <a class="menu-link" href="/finder/search">
        <div class="menu-link-image-container">
          <img src="/images/parkingArea.png" class="menu-link-image" />
        </div>
        <span class="menu-link-text">FIND BEST PARKING LOT</span>
      </a>
      <a class="menu-link" href="/payment">
        <div class="menu-link-image-container">
          <img src="/images/wallet.png" class="menu-link-image" />
        </div>
        <span class="menu-link-text">MANAGE PAYMENTS</span>
      </a>
      <a class="menu-link" href="/account/user-data">
        <div class="menu-link-image-container">
          <img src="/images/accounting.png" class="menu-link-image" />
        </div>
        <span class="menu-link-text">CHECK YOUR ACCOUNT</span>
      </a>
    </div>
    <!-- admin home screen -->
    <div class="home-container" v-if="session.user.role === 'ADMIN'">
      <a class="menu-link" href="/admin/temp-maker">
        <div class="menu-link-image-container">
          <img src="/images/users.png" class="menu-link-image" />
        </div>
        <span class="menu-link-text">MANAGE USERS</span>
      </a>
      <a class="menu-link" href="/admin/summary">
        <div class="menu-link-image-container">
          <img src="/images/parkingArea.png" class="menu-link-image" />
        </div>
        <span class="menu-link-text">MANAGE PARKINGS</span>
      </a>
      <a class="menu-link" href="/admin/statistics/stat">
        <div class="menu-link-image-container">
          <img src="/images/statistics.png" class="menu-link-image" />
        </div>
        <span class="menu-link-text">STATISTICS</span>
      </a>
    </div>
  </TopBar>
</template>

<style scoped>
/* MOBILE + TABLET SCREENS */
.home-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.menu-link {
  width: 200px;
  padding: 30px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  color: var(--primary-lighter);
  background-color: var(--bg-darker);
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
}

.menu-link-image {
  display: none;
}

.menu-link-text {
  font-weight: bold;
  font-size: 24px;
}

/* BIG SCREENS */
@media only screen and (min-width: 1200px) {
  .home-container {
    flex-direction: row;
    gap: 40px;
  }

  .menu-link {
    height: 400px;
    width: 280px;
    display: flex;
    gap: 40px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;
    margin-bottom: 100px;
    cursor: pointer;
  }

  .menu-link-image-container {
    display: flex;
    width: 160px;
    height: 160px;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  }

  .menu-link-image {
    width: 150px;
    height: 150px;
    display: block;
  }

  .menu-link-text {
    font-size: 34px;
  }
}

@media only screen and (min-height: 700px) and (min-width: 400px) {
  .menu-link {
    padding: 50px;
  }

  .menu-link-text {
    font-weight: bold;
    font-size: 30px;
  }
}
</style>
