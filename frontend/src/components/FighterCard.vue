<template>
  <div v-bind:class="isWithDetails ? 'flex':''" class="rounded-2xl bg-gray-300 border-4 border-red-600">
    <div>
      <img v-bind:src="fighter.image" class="rounded-t-lg">
      <div class="bg-red-600" v-bind:class="isWithDetails ? '': 'rounded-b-lg'">
        <p class="text-2xl font-bold text-gray-900 dark:text-white truncate px-2">{{ fighter.name }}</p>
      </div>
    </div>
    <div class="border-l-4 rounded-r-2xl bg-gray-300 border-red-600 w-24" v-if="isWithDetails">
      <div class="flex flex-col justify-center items-center">
        <div class="flex flex-row justify-center items-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-white truncate px-2">Nv. {{ fighter.level }}</p>
        </div>
        <div class="flex flex-row justify-center items-center">
          <img src="src/assets/icon/strength.png" class="w-6 h-6">
          <p class="text-2xl font-bold text-gray-900 dark:text-white truncate px-2">{{ fighter.strength }}</p>
        </div>
        <div class="flex flex-row justify-center items-center">
          <img src="src/assets/icon/agility.png" class="w-6 h-6">
          <p class="text-2xl font-bold text-gray-900 dark:text-white truncate px-2">{{ fighter.agility }}</p>
        </div>
        <div class="flex flex-row justify-center items-center">
          <img src="src/assets/icon/stamina.png" class="w-6 h-6">
          <p class="text-2xl font-bold text-gray-900 dark:text-white truncate px-2">{{ fighter.endurance }}</p>
        </div>
        <div class="flex flex-row justify-center items-center">
          <img src="src/assets/icon/health.svg" class="w-6 h-6">
          <p class="text-2xl font-bold text-gray-900 dark:text-white truncate px-2">{{ fighter.health }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FighterCard",
  props: {
    fighter: Object,
    isWithDetails: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style scoped>

</style>