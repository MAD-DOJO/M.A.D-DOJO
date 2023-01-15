<template>
  <div class="flex mt-5">
    <FighterCard :fighter="fighter" :is-with-details="true" class="hover:bg-gray-600"/>
    <div class="flex">
      <div class="ml-2 mt-10">
        <p>
          <span class="font-bold">Rank: </span>
          <span>{{ fighter.rank }}</span>
        </p>
        <p>
          <span class="font-bold">Wins: </span>
          <span>{{ fighter.wins }}</span>
        </p>
        <p>
          <span class="font-bold">Losses: </span>
          <span>{{ fighter.losses }}</span>
        </p>
        <p>
          <span class="font-bold">Xp: </span>
          <span>{{ fighter.xp }} / {{fighter.xpToNextLevel}}</span>
        </p>
      </div>
      <button class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300 ml-5 h-10 mt-16"
              v-on:click="store.heal(fighter.name)"
              v-bind:disabled="fighter.wounds < 3">
        Heal Fighter
      </button>
      <button class="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300 ml-5 h-10 mt-16"
              v-on:click="store.levelUp(fighter.name)"
              v-bind:disabled="fighter.xp < fighter.xpToNextLevel">
        Level UP
      </button>
    </div>
  </div>
</template>

<script>
import FighterCard from "./FighterCard.vue";
import {dojoStore} from "../store/dojoStore.ts";

export default {
  name: "FighterDetails",
  components: {
    FighterCard
  },
  props: {
    fighter: Object
  },
  data() {
    return {
      store: dojoStore()
    }
  }
}
</script>

<style scoped>

</style>