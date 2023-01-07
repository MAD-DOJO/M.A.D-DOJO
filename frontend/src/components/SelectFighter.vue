<template>
  <div class="grid grid-cols-4 gap-4">
    <div v-for="fighter in fighters">
      <FighterCard v-bind:fighter="fighter"
                   v-on:click="selectedFighter = fighter"
                   v-bind:class="selectedFighter === fighter ? 'bg-neutral-500':''"
                   v-bind:is-with-details="true">
      </FighterCard>
    </div>
  </div>
  <div class="justify-center align-text-bottom space-y-4 sm:flex sm:space-y-0 sm:space-x-4 pt-5">
    <a class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" href="#">
      <div class="-mt-1 font-sans text-sm font-semibold" v-on:click="showSelectFighterModal = true">Recruter un combattant</div>
    </a>
  </div>
</template>

<script>
import FighterCard from "./FighterCard.vue";

export default {
  name: "SelectFighter",
  components: {
    FighterCard
  },
  data(){
    return {
      fighters: [],
      selectedFighter: null
    }
  },
  mounted() {
    // create a list of 8 fighters with random stats
    //level
    //strength
    //agility
    //endurance
    //health
    for(let i = 0; i < 8; i++){
      this.fighters.push({
        name: "Fighter " + i,
        level: 1,
        strength: Math.floor(Math.random() * 100),
        agility: Math.floor(Math.random() * 100),
        endurance: Math.floor(Math.random() * 100),
        health: Math.floor(Math.random() * 100),
      })
    }
  }
}
</script>

<style scoped>

</style>