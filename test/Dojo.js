const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {BigNumber} = require("ethers");

describe("Dojo Smart Contract Test", function () {

    async function deployTokenFixture() {
        // Get the ContractFactory and Signers here.
        const Dojo = await ethers.getContractFactory("Dojo");
        const [owner, addr1, addr2] = await ethers.getSigners();
        // To deploy our contract, we just have to call Token.deploy() and await
        // its deployed() method, which happens once its transaction has been
        // mined.
        const hardhatDojo = await Dojo.deploy();
        await hardhatDojo.deployed();
        // Fixtures can return anything you consider useful for your tests
        return { Dojo, hardhatDojo, owner, addr1, addr2 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { hardhatDojo, owner } = await loadFixture(deployTokenFixture);
            expect(await hardhatDojo.owner()).to.equal(owner.address);
        });
    });

    describe("Creation", function () {
        it("should create a new fighter", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.connect(addr1);
            const numFighters = await hardhatDojo.getOwnerFighterCount(addr1.address);
            // expect(numFighters).to.equal(1);

            const fighter = await hardhatDojo.getFighter(0);
            expect(fighter.name).to.equal("Fighter");
            expect(fighter.level).to.equal(1);
            expect(fighter.strength).to.equal(10);
            expect(fighter.speed).to.equal(10);
            expect(fighter.endurance).to.equal(10);
            expect(fighter.wins).to.equal(0);
            expect(fighter.losses).to.equal(0);
            expect(fighter.wounds).to.equal(0);
        });
    });

    describe("View Method", function () {
        it("should return the right number of fighters", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.connect(addr1).createFighter("Fighter1", { from: addr1.address });
            await hardhatDojo.connect(addr1).createFighter("Fighter2", { from: addr1.address });
            await hardhatDojo.connect(addr2).createFighter("Fighter1", { from: addr2.address });

            const numFighters = await hardhatDojo.getFightersCount();
            expect(numFighters).to.equal(3);
        });
        it("should return the right fighter", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.connect(addr1).createFighter("Sarah", { from: addr1.address });
            await hardhatDojo.connect(addr1).createFighter("Bobi", { from: addr1.address });
            await hardhatDojo.connect(addr2).createFighter("Sam", { from: addr2.address });

            const fighter = await hardhatDojo.getFighter(1);
            expect(fighter.name).to.equal("Bobi");
            expect(fighter.level).to.equal(1);
            expect(fighter.strength).to.equal(10);
            expect(fighter.speed).to.equal(10);
            expect(fighter.endurance).to.equal(10);
            expect(fighter.wins).to.equal(0);
            expect(fighter.losses).to.equal(0);
            expect(fighter.wounds).to.equal(0);
        });
    });

    describe("Transaction", function () {
        it("should get the msg sender balance", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.connect(addr1).createFighter("Sarah", { from: addr1.address });
            await hardhatDojo.connect(addr2).createFighter("Sam", { from: addr2.address });

            const balance = await hardhatDojo.balanceOf(addr2.address, 3)
            console.log(balance);
            expect(balance).to.equal(0);
        });
        it("should set the new value of the balance after a buying transaction", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.connect(addr1).createFighter("Sarah", { from: addr1.address });
            await hardhatDojo.connect(addr2).createFighter("Sam", { from: addr2.address });

            await hardhatDojo.connect(addr2).payForGold({ from: addr2.address, value: ethers.utils.parseEther("0.01") });

            const balance = await hardhatDojo.balanceOf(addr2.address, 0)
            console.log(balance);
            expect(balance).to.equal(10);
        });
    });
});

