const { expect } = require('chai');
const {ethers} = require("hardhat");

describe("Dojo contract", function () {
    async function deployTokenFixture() {
        // Get the ContractFactory and Signers here.
        const Dojo = await ethers.getContractFactory("Dojo");
        const [owner, addr1, addr2] = await ethers.getSigners();
        // To deploy our contract, we just have to call Dojo.deploy() and await
        // its deployed() method, which happens once its transaction has been
        // mined.
        const hardhatDojo = await Dojo.deploy();
        await hardhatDojo.deployed();
        // Fixtures can return anything you consider useful for your tests
        return { Dojo, hardhatDojo, owner, addr1, addr2 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { hardhatDojo, owner } = await deployTokenFixture();
            expect(await hardhatDojo.owner()).to.equal(owner.address);
        });
        it("should create a Dojo with no Fighters", async function () {
            const { hardhatDojo, owner } = await deployTokenFixture();
            const fightersCount = await hardhatDojo.getOwnerFightersCount(owner.address);
            expect(fightersCount).to.equal(0);
        });
    });
});
