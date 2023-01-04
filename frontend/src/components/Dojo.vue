<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5" style="height:55vh;">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Les combattants du Dojo</h5>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="fighter in store.fighters" class="bg-red-600">
          {{ fighter.name }}
        </div>
      </div>
      <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 pt-5">
        <a class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
           href="#">
          <div class="text-left">
            <div class="-mt-1 font-sans text-sm font-semibold">Ajouter un combattant</div>
          </div>
        </a>
      </div>
    </div>
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Statistique du Dojo</h5>
      <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Balance : ...</p>
      <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <a class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
           href="#">
          <div class="text-left">
            <div class="-mt-1 font-sans text-sm font-semibold">Mac App Store</div>
          </div>
        </a>
        <a class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
           href="#">
          <div class="text-left">
            <div class="-mt-1 font-sans text-sm font-semibold">Google Play</div>
          </div>
        </a>
      </div>
    </div>
  </div>
  <div class="p-4 bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5" style="height: 25vh">
    zqd
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {dojoStore} from "../store/dojoStore.ts";

export default defineComponent({
  name: "Dojo",
  data() {
    return {
      store: dojoStore()
    }
  },
  methods: {},
  mounted() {
    console.log("CHARGEMENT DU DOJO");
  }
})
</script>

<style scoped>

</style>