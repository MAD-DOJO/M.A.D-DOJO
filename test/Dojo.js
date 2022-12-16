
// Test the Dojo smart contract
import { Dojo } from '../src/Dojo';
describe("Dojo", function () {
    it("should be deployed", async function () {
        const dojo = await Dojo.deploy();
        await dojo.deployed();
    });
});
