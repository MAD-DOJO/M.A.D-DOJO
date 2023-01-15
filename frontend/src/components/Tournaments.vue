<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5" style="height:80vh;">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Vos combattants</h5>
      <div class="grid grid-cols-4 gap-4 overflow-auto" style="height:40vh;">
      <div v-for="fighter in store.fighters" class="mr-2 mt-2">
        <FighterCard :fighter="fighter" v-on:click="selectedFighter = fighter" class="hover:bg-gray-600"/>
      </div>
      </div>
    </div>
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Combattants adverses</h5>
      <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {dojoStore} from "../store/dojoStore.ts";
import FighterDetails from "./FighterDetails.vue";
import FighterCard from "./FighterCard.vue";

export default defineComponent({
  name: "Tournaments",
  components: {
    FighterDetails,
    FighterCard
  },
  data() {
    return {
      store: dojoStore()
    }
  },
})
</script>

<style scoped>

</style>