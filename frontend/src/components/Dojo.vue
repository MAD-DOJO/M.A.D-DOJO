<template>
  <vue-final-modal v-model="showFighterDetailModal" classes="modal-container" content-class="modal-content">
    <button class="modal__close" @click="showFighterDetailModal = false">X</button>
    <span class="modal__title">Détails du combattant : {{selectedFighter?.name}}</span>
    <div class="modal__content">
      <fighter-details v-bind:fighter="selectedFighter"></fighter-details>
    </div>
  </vue-final-modal>
  <div class="grid grid-cols-2 gap-2">
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5" style="height:55vh;">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Vos combattants</h5>
      <div class="grid grid-cols-4 gap-4 overflow-auto" style="height:40vh;">
        <div v-for="fighter in store.fighters" class="mr-2 mt-2">
          <FighterCard :fighter="fighter" v-on:click="selectedFighter = fighter;showFighterDetailModal= true" class="hover:bg-gray-600"/>
        </div>
      </div>
      <div class="justify-center align-text-bottom space-y-4 sm:flex sm:space-y-0 sm:space-x-4 pt-5">
        <a class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" href="#">
            <div class="-mt-1 font-sans text-sm font-semibold" v-on:click="store.createFighter()">Recruter un combattant</div>
        </a>
      </div>
    </div>
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Information du Dojo</h5>
      <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Gold : {{ store.gold }}</p>
      <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Nombre de combattant : {{ store.fighterCount }}</p>
      <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <a class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
           href="#">
          <div class="text-left">
            <div class="-mt-1 font-sans text-sm font-semibold" v-on:click="store.payForGold()">Payer 0.01 ETH pour 10 Golds</div>
          </div>
        </a>
      </div>
    </div>
  </div>
  <div class="p-4 bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5" style="height: 25vh">
    <div class="bg-white rounded-2xl h-10">
      zqdqzd
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {dojoStore} from "../store/dojoStore.ts";
import FighterCard from "./FighterCard.vue";
import FighterDetails from "./FighterDetails.vue";
export default defineComponent({
  name: "Dojo",
  components: {
    FighterDetails,
    FighterCard
  },
  data() {
    return {
      store: dojoStore(),
      showSelectFighterModal: false,
      showFighterDetailModal: false,
      selectedFighter: {}
    }
  },
})
</script>

<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #FFFFFF;
  border-radius: 0.25rem;
  background: #FFFFFF;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>