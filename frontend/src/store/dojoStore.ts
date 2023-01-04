import {defineStore} from "pinia";

export const dojoStore = defineStore('dojoStore',{
    state: () => {
        return {
            fighters: [{
                name: 'Fighter 1',
                health: 100,
            },
            {
                name: 'Fighter 2',
                health: 100,
            },
                {
                    name: 'Fighter 3',
                    health: 100,
                },
                {
                    name: 'Fighter 4',
                    health: 100,
                }
                ,
                {
                    name: 'Fighter 4',
                    health: 100,
                }
                ,
                {
                    name: 'Fighter 4',
                    health: 100,
                }
                ,
                {
                    name: 'Fighter 4',
                    health: 100,
                }],
        }
    },
    getters: {

    },
    actions: {

    },
    persist: true,
})