<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5" style="height:75vh;">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Vos combattants</h5>
      <div class="grid grid-cols-4 gap-4 overflow-auto" style="height:40vh;">
      <div v-for="fighter in store.fighters" class="mr-2 mt-2">
        <FighterCard :fighter="fighter" v-on:click="selectedFighter = fighter" v-bind:class="selectedFighter === fighter ? 'border-green-600' : ''" class="hover:bg-gray-600"/>
      </div>
      </div>
    </div>
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-5">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Combattants adverses</h5>
      <div class="grid grid-cols-4 gap-4 overflow-auto" style="height:40vh;">
        <div class="mr-2 mt-2">
          <FighterCard :fighter="store.opponent" v-on:click="selectedOpponent = store.opponent" v-bind:class="selectedOpponent === store.opponent ? 'border-green-600' : ''" class="hover:bg-gray-600"/>
        </div>
      </div>
    </div>
  </div>
  <div class="justify-center align-text-bottom space-y-4 sm:flex sm:space-y-0 sm:space-x-4 pt-1">
    <a class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" href="#">
      <div class="-mt-1 font-sans text-sm font-semibold" v-on:click="store.fight(selectedFighter.name, selectedOpponent.name)">Commencer un combat</div>
    </a>
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
      store: dojoStore(),
      selectedFighter: {},
      selectedOpponent: {}
    }
  },
  beforeMount() {
    this.store.getFighter(2);
  },
})
</script>

<style scoped>

</style>