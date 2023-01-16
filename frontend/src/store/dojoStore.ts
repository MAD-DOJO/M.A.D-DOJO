import {defineStore} from "pinia";
import {ethers} from 'ethers';
import {Fighter, Rank} from '../utils/interfaces/fighter';
import Dojo from '../../../artifacts/contracts/Dojo.sol/Dojo.json';
import {POSITION, useToast} from "vue-toastification";

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
        }
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
                return this.mapFighter(fighter);
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
        },
        async loadAllFightersByLevel(level: number) {
            const fighterList = await contract.connect(provider.getSigner()).getAllFighters();
            return fighterList.map((fighter: any) => {
                if(fighter.level === level)
                    return this.mapFighter(fighter);
            });
        },
        async fight(fighterName: string, opponentName: string) {
            const fighterId = fighterName.split("#")[1];
            const opponentId = opponentName.split("#")[1];
            await contract.connect(provider.getSigner()).fight(fighterId, opponentId);
        },
        async heal(fighterName: string) {
            const fighterId = fighterName.split("#")[1];
            await contract.connect(provider.getSigner()).payToHealFighter(fighterId);
        },
        async levelUp(fighterName: string) {
            const fighterId = fighterName.split("#")[1];
            await contract.connect(provider.getSigner()).levelUp(fighterId);
        },
        mapFighter(fighter: any) {
            console.log(fighter);
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
                wins: fighter.stats.wins.toNumber(),
                losses: fighter.stats.losses.toNumber(),
                wounds: fighter.wounds.toNumber(),
                isOnSale: fighter.isOnSale,
            }
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
    toast.success(`Fighter #${fighterId} level up with ${bonus} ${stat}`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
    dojoStore().loadFighters().then(r => console.log(r));
});
contract.on('FighterFightResult', (fighterId, opponentId, result) => {
    toast.success(`Fighter ${fighterId} fight against ${opponentId} and the result is ${result}`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
});
contract.on('FighterForSale', (fighterId, price) => {
    toast.success(`Fighter with id: ${fighterId} is now for sale for ${price} gold`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
});
contract.on('FighterBought', (fighterId, seller, price) => {
    toast.success(`Fighter with id: ${fighterId} is now yours for ${price} gold`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
    dojoStore().loadFighters().then(r => console.log(r));
});

contract.on('FighterIsHealed', (fighterId) => {
    toast.success(`Fighter with id: ${fighterId} is now healed`, {
        position: POSITION.TOP_CENTER,
        timeout: 5000,
    });
    dojoStore().loadFighters().then(r => console.log(r));
});
