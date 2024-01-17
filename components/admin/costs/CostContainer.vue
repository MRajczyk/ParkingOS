<script setup>
const props = defineProps({
  costId: Number,
  parkingId: Number,
  costName: String,
  costValue: Number,
  discardCallback: Function,
});

const showModalFlag = ref(false);

function showModal() {
  showModalFlag.value = true;
}

function hideModal() {
  showModalFlag.value = false;
}
</script>

<template>
  <div class="modal" v-if="showModalFlag" @click="hideModal()">
    <div class="modal-content">
      <p>
        Do you really wanna delete <b>{{ props.costName }}</b
        >?
      </p>
      <p style="color: red"><b>This action cannot be reversed.</b></p>
      <button
        class="modal-button"
        @click="discardCallback(props.costId)"
        style="background-color: red; margin-top: 10px"
      >
        Delete
      </button>
      <button class="modal-button" @click="hideModal">Back</button>
    </div>
  </div>
  <div class="cost-container">
    <div class="cost-container-row">
      <div style="width: 100%">
        <label class="cost-label">Cost name</label>
        <span
          type="text"
          name="name"
          placeholder="Name"
          class="cost-input"
          style="display: flex; align-items: center; justify-content: start"
        >
          {{ props.costName }}
        </span>
      </div>
      <NuxtLink
        :to="`/admin/costs/${props.parkingId}/edit/${props.costId}`"
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
    <div class="cost-container-row">
      <div style="width: 100%">
        <label class="cost-label">Cost amount</label>
        <span
          name="name"
          class="cost-input"
          style="display: flex; align-items: center; justify-content: start"
        >
          {{ props.costValue }}
        </span>
      </div>
      <button
        @click="showModal()"
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
.modal {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  background-color: white;
  width: 200px;
  gap: 4px;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 20px;
}

.modal-content > p {
  color: var(--primary-lighter);
}

.modal-button {
  border-radius: 20px;
  text-decoration: none;
  text-align: center;
  width: 160px;
  padding: 10px 0px;
  color: white;
  font-size: 20px;
  background-color: var(--primary);
  cursor: pointer;
}

.cost-container {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  background-color: white;
  width: 220px;
  gap: 10px;
}

.cost-container-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.cost-input {
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

.cost-label {
  font-size: 13px;
  color: #163020;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 5px;
}

@media screen and (min-width: 700px) {
  .cost-container {
    width: 480px;
  }

  .cost-input {
    width: 410px;
  }

  .modal-content {
    padding: 40px;
    width: 300px;
    font-size: 24px;
  }

  .modal-button {
    width: 260px;
    font-size: 20px;
  }
}
</style>
