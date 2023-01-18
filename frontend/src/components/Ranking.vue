<template>
  <div class="grid grid-cols-1 gap-2">
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 bg-gray-800 border-gray-700 m-5" style="height:75vh;">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 text-white">Vos combattants</h5>
      <div class="grid grid-cols-4 gap-4 overflow-auto" style="height:40vh;">
        <div v-for="fighter in fighters" class="mr-2 mt-2">
          <FighterCard :fighter="fighter" v-on:click="selectedFighter = fighter" class="hover:bg-gray-600"/>
        </div>
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
name: "Ranking",
  components: {
    FighterDetails,
    FighterCard
  },
  data() {
    return {
      store: dojoStore(),
      fighters : [],
      selectedFighter: undefined,
      selectedRank: "Beginner",
    }
  },
  methods: {
  //sortFightersByWins function
    sortByWins(){
      this.fighters.sort((a, b) => (a.wins < b.wins) ? 1 : -1);
    },
    //filter By rank Beginner function
    filterByRank() {
      this.fighters = this.fighters.filter(fighter => {
            if (fighter.rank === this.selectedRank) {
              return fighter;
            }});
      console.log(this.fighters);
    },
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