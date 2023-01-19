import { defineStore } from 'pinia'
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { useMetaMaskWallet } from "vue-connect-wallet";
import router from "../router/router";
import {dojoStore} from "./dojoStore";
const wallet = useMetaMaskWallet();

window.ethereum.on('accountsChanged', function (accounts: any) {
    // Time to reload your interface with accounts[0]!
    accountStore().setAccount(accounts[0]).then();
    dojoStore().initializeDojo().then(r => {
        router.push('/dojo').then(r => {
        });
    });
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
            await dojoStore().initializeDojo();
            this.isConnected = true;
        },
        disconnectWallet() {
            this.isConnected = false;
            this.account = '';
            cookies.remove('account');
            router.go(0);
        },
        async setAccount(account: string) {
            this.account = account;
            cookies.set('account', this.account);
        }
    },
    persist: true,
})