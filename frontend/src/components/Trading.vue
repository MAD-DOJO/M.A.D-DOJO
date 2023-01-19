<template>
  <vue-final-modal v-model="showSelectFighterModal" classes="modal-container" content-class="modal-content">
    <button class="modal__close" @click="showSelectFighterModal = false">X</button>
    <span class="modal__title">Choisir un combattant à vendre</span>
    <div class="modal__content">
      <div class="grid grid-cols-4 gap-4 overflow-auto" style="height:40vh;">
        <div v-for="fighter in store.fighters" class="mr-2 mt-2">
          <FighterCard :fighter="fighter" v-on:click="selectedFighter = fighter" v-bind:class="selectedFighter === fighter ? 'border-green-600' : ''" class="hover:bg-gray-600  w-44"/>
        </div>
      </div>
      <div class="flex justify-center">
        <label class="mr-2 font-bold">
          Prix :
        </label>
        <input type="number" class="border-4 border-black" v-model="price">
        <label class="ml-2 font-bold">
          Gold
        </label>
      </div>
      <div class="flex justify-center mt-2">
        <button class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300" v-on:click="sellFighter">
            Vendre
        </button>
      </div>
    </div>
  </vue-final-modal>
  <div class="flex justify-center mt-5">
    <button class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300" v-on:click="showSelectFighterModal = true">
      Sell Fighter
    </button>
  </div>
  <div v-if="sellOffers" class="p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 bg-gray-800 border-gray-700 m-5">
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Token Id
            </th>
            <th scope="col" class="px-6 py-3">
              Seller
            </th>
            <th scope="col" class="px-6 py-3">
              Price
            </th>
            <th scope="col" class="px-6 py-3">
              Acheter
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="sell in sellOffers">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ sell.tokenId }}
            </th>
            <td class="px-6 py-4">
              {{ sell.seller }}
            </td>
            <td class="px-6 py-4">
              {{ sell.price }} GOLD
            </td>
            <td class="px-6 py-4">
              <button class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300" v-on:click="buyFighter(sell.tokenId)">Buy</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {dojoStore} from "../store/dojoStore.ts";
import FighterCard from "./FighterCard.vue";
import {POSITION, useToast} from "vue-toastification";
import {ethers} from "ethers";
const toast = useToast();
export default {
  name: "Trading",
  components: {
    FighterCard,
  },
  data() {
    return {
      store: dojoStore(),
      sellOffers: undefined,
      showSelectFighterModal: false,
      selectedFighter: null,
      price: 0,
    };
  },
  methods: {
    sellFighter() {
      if(this.price === 0) {
        toast.error("Le prix doit être supérieur à 0", {
          position: POSITION.TOP_CENTER,
        });
      }else{
        this.showSelectFighterModal = false;
        const tokenId = this.selectedFighter.name.split("#")[1];
        this.store.sellFighter(tokenId, this.price);
      }
    },
    buyFighter(tokenId) {
      this.store.buyFighter(tokenId);
    },
  },
  mounted() {
    this.store.loadTradingOffers().then((offers) => {
      const sellOfferList = offers.map((offer) => {
        if(offer.seller !== ethers.constants.AddressZero){
          return {
            tokenId: offer.tokenId.toNumber(),
            seller: offer.seller,
            price: offer.price.toNumber(),
          };
        }
      });
      this.sellOffers = sellOfferList.filter((offer) => offer !== undefined);
    });
  }
}
</script>

<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #FFFFFF;
  border-radius: 0.25rem;
  background: #FFFFFF;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>