<template>
  <Header/>
  <router-view/>
</template>

<script lang="ts">
import Header from "./components/Header.vue";
import {defineComponent} from "vue";
import contractMixin from "./utils/contractMixin";
export default defineComponent({
  name: "App",
  components: {
    Header
  },
  mixins: [contractMixin],
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
