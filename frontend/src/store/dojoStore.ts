import {defineStore} from "pinia";
import {ethers} from 'ethers';
import {Fighter, Rank} from '../utils/interfaces/fighter';
import Dojo from '../../../artifacts/contracts/Dojo.sol/Dojo.json';
import {POSITION, useToast} from "vue-toastification";
import router from "../router/router";

const toast = useToast();

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(import.meta.env.VITE_DOJO_CONTRACT || '', Dojo.abi, provider);

export const dojoStore = defineStore('dojoStore',{
    state: () => {
        return {
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
            let fighterCountPromise = await contract.getOwnerFighterCount(provider.getSigner().getAddress());
            this.fighterCount = fighterCountPromise.toNumber();
        },
        async loadGold() {
            let goldPromise = await contract.getGoldBalance(provider.getSigner().getAddress());
            this.gold = goldPromise.toNumber();
        },
        async payForGold() {
            await contract.connect(provider.getSigner()).payForGold({value: ethers.utils.parseEther('0.01')});
            await this.loadGold();
        },
        async createFighter() {
            if(this.fighters.length <= 0){
                await contract.connect(provider.getSigner()).createFighter();
                await this.loadFighters();
            }else{
                await contract.connect(provider.getSigner()).payToCreateFighter();
                await this.loadFighters();
                await this.loadGold();
            }
        },
        async payToCreateFighter() {
            await contract.connect(provider.getSigner()).payToCreateFighter();
            await this.loadFighters();
        },
        async loadTradingOffers() {
            return await contract.connect(provider.getSigner()).getSellOffers();
        },
        async sellFighter(tokenId: number, price: number) {
            await contract.connect(provider.getSigner()).sellFighter(tokenId, price);
            await this.loadFighters();
        },
        async buyFighter(tokenId: number) {
            await contract.connect(provider.getSigner()).buyFighter(tokenId);
            await this.loadFighters();
        }
    },
    persist: true,
})

contract.on('NewFighter', (fighterId, name) => {
    toast.success(`New Fighter: ${name} with id: ${fighterId}`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
    dojoStore().loadFighters().then(r => console.log(r));
});
contract.on('NewGold', (amount, name) => {
    toast.success(`You receive : ${amount} ${name}`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
    dojoStore().loadGold().then(r => console.log(r));
});
contract.on('FighterLevelUp', (fighterId, bonus, stat) => {
    console.log('FighterLevelUp', fighterId, bonus, stat);
});
contract.on('FighterFightResult', (fighterId, opponentId, result) => {
    console.log('FighterFightResult', fighterId, opponentId, result);
});
contract.on('FighterForSale', (fighterId, price) => {
    toast.success(`Fighter with id: ${fighterId} is now for sale for ${price} gold`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
    console.log('FighterForSale', fighterId, price);
});
contract.on('FighterBought', (fighterId, seller, price) => {
    toast.success(`Fighter with id: ${fighterId} is now yours for ${price} gold`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
    dojoStore().loadFighters().then(r => console.log(r));
});