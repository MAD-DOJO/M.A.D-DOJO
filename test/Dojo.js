const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

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

            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter1", { from: owner.address });
            const numFighters = await hardhatDojo.getFighterOwnerCount(owner.address);
            expect(numFighters).to.equal(1);

            const fighter = await hardhatDojo.getFighterById(0);
            expect(fighter.level).to.equal(1);
            expect(fighter.health).to.equal(100);
            expect(fighter.lives).to.equal(3);
            expect(fighter.strength).to.equal(50);
            expect(fighter.name).to.equal("Fighter1");
        });
    });

    describe("View Method", function () {
        it("should return the right number of fighters", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter1", { from: owner.address });
            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter2", { from: owner.address });
            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter3", { from: owner.address });
            const numFighters = await hardhatDojo.getFighterCount();
            expect(numFighters).to.equal(3);
        });
        it("should return the right fighter", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter1", { from: owner.address });
            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter2", { from: owner.address });
            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter3", { from: owner.address });

            const fighter = await hardhatDojo.getFighterById(1);
            expect(fighter.level).to.equal(1);
            expect(fighter.health).to.equal(100);
            expect(fighter.lives).to.equal(3);
            expect(fighter.strength).to.equal(50);
            expect(fighter.name).to.equal("Fighter2");
        });
        it("should return the list of fighters for a specific address", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter1", { from: owner.address });
            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter2", { from: owner.address });
            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter3", { from: owner.address });

            const fighters = await hardhatDojo.getSpecificOwnerFighters(owner.address);
            console.log(fighters);
            expect(fighters.length).to.equal(3);
        });
        it("should return the list of my fighters", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter1", { from: owner.address });
            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter2", { from: owner.address });
            await hardhatDojo.createFighter(1, 100, 3, 50, "Fighter3", { from: owner.address });

            const fighters = await hardhatDojo.getOwnerFighters({from: owner.address});
            console.log(fighters);
            expect(fighters.length).to.equal(3);
        });
    });
});

