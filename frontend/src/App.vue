<template>
  <Header/>
  <router-view/>
</template>

<script lang="ts">
import Header from "./components/Header.vue";
import {defineComponent} from "vue";
export default defineComponent({
  name: "App",
  components: {
    Header
  },
  data(){
    return {
    }
  },
  methods: {
  },
})
</script>

<style scoped>

</style>
