<script setup>
const props = defineProps({
  id: Number,
  name: String,
  licensePlateNumber: String,
  discardCallback: Function,
});

console.log(props);
</script>

<template>
  <div class="car-container">
    <div class="car-container-row">
      <div style="width: 100%">
        <label class="car-label">Car name</label>
        <span
          type="text"
          name="name"
          placeholder="Name"
          class="car-input"
          style="display: flex; align-items: center; justify-content: start"
        >
          {{ props.name }}
        </span>
      </div>
      <NuxtLink
        :to="`/account/car-edit/${props.id}`"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 15px;
        "
      >
        <img src="/images/edit.png" style="height: 34px; width: 34px" />
      </NuxtLink>
    </div>
    <div class="car-container-row">
      <div style="width: 100%">
        <label class="car-label">License Plate</label>
        <span
          type="text"
          name="name"
          placeholder="Name"
          class="car-input"
          style="display: flex; align-items: center; justify-content: start"
        >
          {{ props.licensePlateNumber }}
        </span>
      </div>
      <button
        @click="discardCallback(props.id)"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 15px;
          background-color: transparent;
          border: none;
          cursor: pointer;
        "
      >
        <img src="/images/recycle-bin.png" style="height: 34px; width: 34px" />
      </button>
    </div>
  </div>
</template>

<style>
.car-container {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  background-color: white;
  width: 220px;
  gap: 10px;
}

.car-container-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.car-input {
  display: block;
  width: 170px;
  height: 36px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  padding-left: 12px;
  background-color: transparent;
  border: 2px solid var(--primary-lighter);
}

.car-label {
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}

@media screen and (min-width: 700px) {
  .car-container {
    width: 480px;
  }

  .car-input {
    width: 410px;
  }
}
</style>
