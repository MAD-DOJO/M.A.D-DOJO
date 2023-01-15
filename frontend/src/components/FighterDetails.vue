<template>
  <FighterCard :fighter="fighter" :is-with-details="true" class="hover:bg-gray-600"/>
  <div class="justify-end align-text-bottom space-y-4 sm:flex sm:space-y-0 sm:space-x-4 pt-1">
    <a class="w-full sm:w-auto bg-green-800 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 text-white rounded-lg inline-flex items-center justify-center px-1 py-1 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-700" href="#">
      <div class="-mt-1 font-sans text-sm font-semibold" v-on:click="store.heal(fighter.name)">Heal Fighter</div>
    </a>
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