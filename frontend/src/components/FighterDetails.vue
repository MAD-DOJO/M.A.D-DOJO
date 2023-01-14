<template>
  <FighterCard :fighter="fighter" :is-with-details="true" class="hover:bg-gray-600"/>
</template>

<script>
import FighterCard from "./FighterCard.vue";

export default {
  name: "FighterDetails",
  components: {
    FighterCard
  },
  props: {
    fighter: Object
  },
}
</script>

<style scoped>

</style>