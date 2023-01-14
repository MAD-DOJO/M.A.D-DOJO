import {defineStore} from "pinia";
import { ethers } from 'ethers';
import { Fighter } from '../utils/interfaces/fighter';
import Dojo from '../../../artifacts/contracts/Dojo.sol/Dojo.json';
const provider = new ethers.providers.Web3Provider(window.ethereum);

export const dojoStore = defineStore('dojoStore',{
    state: () => {
        return {
            contractAddress: import.meta.env.VITE_DOJO_CONTRACT || '',
            fighters: [] as Array<Fighter>,
            gold: 0,
        }
    },
    getters: {

    },
    actions: {
        async getFighters() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            this.fighters.push(await contract.getFighters());
        },

        async getGold() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            this.gold = await contract.getGoldBalance();
        }
    },
    persist: true,
})