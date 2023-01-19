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
            <router-link :to="'Tournaments'" class="py-4 px-2 text-gray-500 hover:text-gray-900">Tournaments</router-link>
            <router-link :to="'Ranking'" class="py-4 px-2 text-gray-500 hover:text-gray-900">Ranking</router-link>
            <router-link :to="'Trading'" class="py-4 px-2 text-gray-500 hover:text-gray-900">Trading</router-link>
          </div>
        </div>
        <!-- Secondary Nav -->
        <div class="hidden md:flex items-center space-x-3">
          <ConnectWalletButton v-bind:address="store.account" v-on:click="connectWallet"/>
          <button class="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300" v-on:click="disconnectWallet" v-if="store.isConnected">X</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { accountStore } from "../store/accountStore";
import { ConnectWalletButton } from "vue-connect-wallet";
export default defineComponent({
  name: "Header",
  components: {
    ConnectWalletButton,
  },
  data() {
    return {
      store: accountStore(),
    };
  },
  methods: {
    connectWallet() {
      this.store.connectWallet();
    },
    disconnectWallet() {
      this.store.disconnectWallet();
    },
  },
});
</script>

<style scoped>
</style>