// basic store setup with pinia

import { defineStore } from 'pinia'
import Web3 from "web3";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { useMetaMaskWallet } from "vue-connect-wallet";
const wallet = useMetaMaskWallet();
export const accountStore = defineStore('accountStore',{
    state: () => {
        return {
            account: '',
            balance: '',
            isConnected: false,
        }
    },
    getters: {
        getAccount: (state) => {
            return state.account;
        },
        getBalance: (state) => {
            return state.balance;
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
            this.account = accounts[0];
            cookies.set('account', this.account);
            this.isConnected = true;
        },
        async switchWallet() {
            await wallet.switchAccounts();
            await this.connectWallet();
        },
        async disconnectWallet() {
            console.log("disconnectWallet");
        },
        // async isConnected() {
        //     const accounts = await wallet.getAccounts();
        //     if (typeof accounts === "string") return false;
        //     return accounts.length > 0;
        // }
    },
    persist: true,
})