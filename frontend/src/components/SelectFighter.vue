<template>
  <div class="grid grid-cols-4 gap-4">
    <div v-for="fighter in fighters">
      <FighterCard v-bind:fighter="fighter"
                   v-bind:is-with-details="true">
      </FighterCard>
      <div class="justify-center align-text-bottom space-y-4 sm:flex sm:space-y-0 sm:space-x-4 pt-2">
        <a class="w-full bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" href="#">
          <div class="-m-1 font-sans text-sm font-semibold" v-on:click="showSelectFighterModal = true">Choisir</div>
        </a>
      </div>
    </div>
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
        image: 'src/assets/card/fighter.svg'
      })
    }
  }
}
</script>

<style scoped>

</style>