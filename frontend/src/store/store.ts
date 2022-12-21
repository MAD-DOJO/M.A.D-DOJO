// basic store setup with pinia

import { defineStore } from 'pinia'
import Web3 from "web3";
export const useStore = defineStore({
    id: 'store',
    state: () => ({
        account: '',
        balance: '',
        isConnected: false,
    }),
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
            if ((window as any).ethereum) {
                try {
                    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                    this.account = accounts[0];
                    console.log(this.account);
                    const web3 = new Web3((window as any).ethereum);
                    this.balance = await web3.eth.getBalance(this.account);
                    console.log(this.balance);
                    this.isConnected = true;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
})