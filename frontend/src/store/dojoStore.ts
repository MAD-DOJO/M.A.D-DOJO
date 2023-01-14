import {defineStore} from "pinia";
import { ethers } from 'ethers';
import {Fighter, Rank} from '../utils/interfaces/fighter';
import Dojo from '../../../artifacts/contracts/Dojo.sol/Dojo.json';
const provider = new ethers.providers.Web3Provider(window.ethereum);


export const dojoStore = defineStore('dojoStore',{
    state: () => {
        return {
            contractAddress: import.meta.env.VITE_DOJO_CONTRACT || '',
            fighters: [] as Array<Fighter>,
            fighterCount: 0,
            gold: 0,
        }
    },
    getters: {
        getFighters: (state) => {
            return state.fighters;
        },
        getFighterCount: (state) => {
            return state.fighterCount;
        },
        getGold: (state) => {
            return state.gold;
        },
    },
    actions: {
        async initializeDojo() {
            await this.loadFighters();
            await this.loadFighterCount();
            await this.loadGold();
        },
        async loadFighters() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            const fighters = await contract.connect(provider.getSigner()).getMyFighters();
            this.fighters = fighters.map((fighter: any) => {
                return {
                    name: fighter.name,
                    level: fighter.level,
                    xp: fighter.xp,
                    xpToNextLevel: fighter.xpToNextLevel,
                    uri: fighter.uri,
                    rank: Rank[fighter.rank],
                    strength: fighter.strength.toNumber(),
                    speed: fighter.speed.toNumber(),
                    endurance: fighter.endurance.toNumber(),
                    wins: fighter.wins.toNumber(),
                    losses: fighter.losses.toNumber(),
                    wounds: fighter.wounds.toNumber(),
                }
            });
        },
        async loadFighterCount() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            let fighterCountPromise = await contract.getOwnerFighterCount(provider.getSigner().getAddress());
            this.fighterCount = fighterCountPromise.toNumber();
        },
        async loadGold() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            let goldPromise = await contract.getGoldBalance(provider.getSigner().getAddress());
            this.gold = goldPromise.toNumber();
        },
        async payForGold() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            await contract.connect(provider.getSigner()).payForGold({value: ethers.utils.parseEther('0.01')});
            await this.loadGold();
        },
        async createFighter() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            await contract.connect(provider.getSigner()).createFighter();
            await this.loadFighters();
        },
        async payToCreateFighter() {
            const contract = new ethers.Contract(this.contractAddress, Dojo.abi, provider);
            await contract.connect(provider.getSigner()).payToCreateFighter();
            await this.loadFighters();
        }
    },
    persist: true,
})