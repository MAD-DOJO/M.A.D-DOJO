import {defineStore} from "pinia";

export const dojoStore = defineStore('dojoStore',{
    state: () => {
        return {
            fighters: [
                {
                    name: 'Ryu',
                },
                {
                    name: 'Ken',
                }
            ],
        }
    },
    getters: {

    },
    actions: {

    },
    persist: true,
})