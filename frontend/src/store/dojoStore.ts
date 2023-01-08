import {defineStore} from "pinia";

export const dojoStore = defineStore('dojoStore',{
    state: () => {
        return {
            fighters: [
                {
                    name: 'Ryu',
                    image: 'src/assets/card/ninja.jpg',
                },
                {
                    name: 'Ken',
                    image: 'src/assets/card/ninja2.jpg',
                },
                {
                    name: 'Ken',
                    image: 'src/assets/card/ninja3.jpg',
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