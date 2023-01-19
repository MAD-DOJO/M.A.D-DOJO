<template>
  <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 bg-gray-800 border-gray-700 m-5">
  <div class="flex" style="justify-content: center;">
      <div class="m-3">
        <button class="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                v-on:click="this.selectedRank = 'Beginner'">
          Beginner
        </button>
      </div>
      <div class="m-3">
        <button class="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                v-on:click="this.selectedRank = 'Novice'">
        Novice
        </button>
      </div>
      <div class="m-3">
        <button class="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                v-on:click="this.selectedRank = 'Apprentice'">
        Apprentice
        </button>
      </div>
      <div class="m-3">
        <button class="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                v-on:click="this.selectedRank = 'Adept'">
        Adept
        </button>
      </div>
      <div class="m-3">
        <button class="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                v-on:click="this.selectedRank = 'Master'">
        Master
        </button>
      </div>
      <div class="m-3">
        <button class="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                v-on:click="this.selectedRank = 'GrandMaster'">
        Grand Master
        </button>
      </div>
      <div class="m-3">
        <button class="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                v-on:click="this.selectedRank = 'Legendary'">
        Legendary
        </button>
      </div>
  </div>

  <div class="relative overflow-x-auto ml-10 mr-10 mt-6">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">
          Name
        </th>
        <th scope="col" class="px-6 py-3">
          Level
        </th>
        <th scope="col" class="px-6 py-3">
          Rank
        </th>
        <th scope="col" class="px-6 py-3">
          Wins
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="fighter in this.filteredFighters">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ fighter.name }}
          </th>
          <td class="px-6 py-4">
            {{ fighter.level }}
          </td>
          <td class="px-6 py-4">
            {{ fighter.rank }}
          </td>
          <td class="px-6 py-4">
            {{ fighter.wins }}
          </td>
      </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {dojoStore} from "../store/dojoStore.ts";
import FighterDetails from "./FighterDetails.vue";
import FighterCard from "./FighterCard.vue";

export default defineComponent({
name: "Ranking",
  components: {
    FighterDetails,
    FighterCard
  },
  data() {
    return {
      store: dojoStore(),
      fighters : [],
      filteredFighters: [],
      selectedFighter: undefined,
      selectedRank: "Beginner",
    }
  },
  methods: {

    sortByWins(){
      this.filteredFighters.sort((a, b) => (a.wins < b.wins) ? 1 : -1);
    },

    filterByRank() {
      this.filteredFighters = this.fighters.filter(fighter => {
            if (fighter.rank === this.selectedRank) {
              return fighter;
            }});
      console.log(this.fighters);
    },
  },
  watch: {
    selectedRank: function () {
      this.filterByRank();
      this.sortByWins();
    }
  },
  beforeMount() {
    this.store.getAllFighters().then((fighters) => {
      this.fighters = fighters;
      this.filterByRank();
      this.sortByWins();
    });
  }
})
</script>

<style scoped>

</style>