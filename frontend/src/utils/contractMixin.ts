import {Fighter} from "./interfaces/fighter";

require('dotenv').config();
const alchemyKey = process.env.VUE_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0xc8Ac3793E6095Cacc4D7d2CAe439afc643845Fa8";

export const dojoContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);
export default {
    data() {
        return {
            dojoContract
        };
    },
    methods: {
        async getFighters(): Promise<Fighter[]> {
            return await dojoContract.methods.getFighters().call();
        },
    },
}