import {defineStore} from "pinia";
import { ethers } from 'ethers';
import Dojo from '../../../artifacts/contracts/Dojo.sol/Dojo.json';
const provider = new ethers.providers.Web3Provider(window.ethereum);

export const dojoStore = defineStore('dojoStore',{
    state: () => {
        return {
            contractAddress: import.meta.env.VITE_DOJO_CONTRACT || '',
            fighters: [],
        }
    },
    getters: {

    },
    actions: {
        async getFighters() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            this.fighters = await contract.getFighters();
        }
    },
    persist: true,
})