<template>
  <Header/>
  <router-view/>
</template>

<script lang="ts">
import Header from "./components/Header.vue";
import {defineComponent} from "vue";
import {dojoStore} from "./store/dojoStore";

export default defineComponent({
  name: "App",
  components: {
    Header
  },
  data(){
    return {
      dojoStore: dojoStore()
    }
  },
  methods: {
  },
  mounted() {
    this.dojoStore.getFighters();
    this.dojoStore.getGold();
  }
})
</script>

<style scoped>

</style>
