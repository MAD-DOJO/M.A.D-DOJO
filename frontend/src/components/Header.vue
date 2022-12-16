<template>
  <!-- nav bar -->
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between">
        <div class="flex space-x-7">
          <!-- logo -->
          <div>
            <!-- logo image -->
            <router-link :to="'Home'" class="flex items-center py-4 px-2">
              <img class="h-12" src="../assets/dojo-logo.png" alt="M.A.D DOJO" />
            </router-link>
          </div>
          <!-- Primary Nav -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link :to="'Dojo'" class="py-4 px-2 text-gray-500 hover:text-gray-900">Dojo</router-link>
            <router-link :to="'Ring'" class="py-4 px-2 text-gray-500 hover:text-gray-900">Ring</router-link>
            <router-link :to="'Classement'" class="py-4 px-2 text-gray-500 hover:text-gray-900">Classement</router-link>
            <router-link :to="'Help'" class="py-4 px-2 text-gray-500 hover:text-gray-900">A propos</router-link>
          </div>
        </div>
        <!-- Secondary Nav -->
        <div class="hidden md:flex items-center space-x-3">
          <button class="bg-transparent hover:bg-red-600 text-black px-2 py-2 font-bold rounded">
            <img src="../assets/metamask.svg.png" class="h-10">
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Header",
});
</script>

<style scoped>
</style>