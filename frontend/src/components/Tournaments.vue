<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 bg-gray-800 border-gray-700 m-5" style="height:75vh;">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 text-white">Vos combattants</h5>
      <div class="grid grid-cols-4 gap-4 overflow-auto" style="height:40vh;">
      <div v-for="fighter in store.fighters" class="mr-2 mt-2">
        <FighterCard :fighter="fighter" v-on:click="selectedFighter = fighter" v-bind:class="selectedFighter === fighter ? 'border-green-600' : ''" class="hover:bg-gray-600"/>
      </div>
      </div>
    </div>
    <div class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 bg-gray-800 border-gray-700 m-5">
      <h5 class="mb-2 text-3xl font-bold text-gray-900 text-white">Combattants adverses</h5>
      <h6 class="mb-2 text-2xl font-bold text-gray-900 text-white" v-if="!selectedFighter">Selectionnez un de vos combattant pour pouvoir vous battre contre des combattants du même level</h6>
      <div class="grid grid-cols-4 gap-4 overflow-auto" style="height:40vh;">
        <div class="mr-2 mt-2" v-for="opponent in opponentList">
          <FighterCard :fighter="opponent" v-on:click="selectedOpponent = opponent" v-bind:class="selectedOpponent === opponent ? 'border-green-600' : ''" class="hover:bg-gray-600"/>
        </div>
      </div>
    </div>
  </div>
  <div class="justify-center align-text-bottom space-y-4 sm:flex sm:space-y-0 sm:space-x-4 pt-1">
    <button class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
            v-on:click="store.fight(selectedFighter.name, selectedOpponent.name)"
            v-bind:disabled="!selectedOpponent || !selectedFighter">
      Commencer un combat
    </button>
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
      opponentList: [],
      selectedFighter: undefined,
      selectedOpponent: undefined
    }
  },
  watch: {
    selectedFighter: function (fighter) {
      this.store.loadAllFightersByLevel(fighter.level).then((fighters) => {
        this.opponentList = fighters.filter(f => f.name !== fighter.name);
      });
    }
  }
})
</script>

<style scoped>

</style>