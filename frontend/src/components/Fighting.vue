<template>
  <div class="justify-center">
    <FighterCard v-for="fighter in fighters" :key="fighter.id" :fighter="fighter"/>
  </div>
</template>

<script>
import FighterCard from "./FighterCard.vue";

export default {
  name: "Fighting",
  components: {FighterCard}
}
</script>

<style scoped>

</style>