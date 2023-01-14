// basic store setup with pinia
import { defineStore } from 'pinia'
import Web3 from "web3";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { useMetaMaskWallet } from "vue-connect-wallet";
import {dojoStore} from "./dojoStore";
const wallet = useMetaMaskWallet();

window.ethereum.on('accountsChanged', function (accounts: any) {
    // Time to reload your interface with accounts[0]!
    accountStore().setAccount(accounts[0]).then();
})

window.ethereum.on('chainChanged', function (networkId: any) {
    // Time to reload your interface with the new networkId
    console.log(networkId);
})

export const accountStore = defineStore('accountStore',{
    state: () => {
        return {
            account: '',
            isConnected: false,
        }
    },
    getters: {
        getAccount: (state) => {
            return state.account;
        },
        getIsConnected: (state) => {
            return state.isConnected;
        }
    },
    actions: {
        async connectWallet() {
            const accounts = await wallet.connect();
            if (typeof accounts === "string") {
                console.log("An error occurred" + accounts);
            }
            await this.setAccount(accounts[0]);
            this.isConnected = true;
        },
        async disconnectWallet() {
            console.log("disconnectWallet");
        },
        async setAccount(account: string) {
            this.account = account;
            cookies.set('account', this.account);
            await dojoStore().initializeDojo();
        }
    },
    persist: true,
})