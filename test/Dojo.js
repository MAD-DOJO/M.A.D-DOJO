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
        }).timeout(100000);
    });

    describe("Create Fighter", function () {
        it("should create a new fighter when the contract is called by a user who does not already have a fighter", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await hardhatDojo.connect(addr1).createFighter({ from: addr1.address });
            const numFighters = await hardhatDojo.getOwnerFighterCount(addr1.address);
            expect(numFighters).to.equal(1);
            const fighter = await hardhatDojo.getFighter(0);
            expect(fighter.name).to.equal("Fighter#0");
            expect(fighter.level).to.equal(1);
            expect(fighter.wins).to.equal(0);
            expect(fighter.losses).to.equal(0);
            expect(fighter.wounds).to.equal(0);
        });
        it('should reverts if the contract is called by a user who already has a fighter', async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await hardhatDojo.connect(addr1).createFighter({ from: addr1.address });
            await expect(
                hardhatDojo.connect(addr1).createFighter({ from: addr1.address })
            ).to.be.revertedWith("You already have a fighter, pay to create a new one");
        });
        it("should generate random stats between 1 and 5", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await hardhatDojo.connect(addr1).createFighter({ from: addr1.address });
            const fighter = await hardhatDojo.getFighter(0);
            expect(fighter.strength).to.be.greaterThan(0);
            expect(fighter.strength).to.be.lessThan(11);
            expect(fighter.speed).to.be.greaterThan(0);
            expect(fighter.speed).to.be.lessThan(11);
            expect(fighter.endurance).to.be.greaterThan(0);
            expect(fighter.endurance).to.be.lessThan(11);
        });
    });

    describe("Pay For Gold", function () {
        it("should add gold to the user's account when they pay for gold", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
            const gold = await hardhatDojo.getGoldBalance(addr1.address);
            expect(gold).to.equal(10);
        });
        it("should revert if the user does not pay enough to get gold", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await expect(
                hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.001") })
            ).to.be.revertedWith("You must pay at least 0.01 ETH to get gold");
        });
    });

    describe("Pay For New Fighter", function () {
        it("should create a new fighter when the user pays 5 golds for a new fighter and burn the gold", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
            await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
            const numFighters = await hardhatDojo.getOwnerFighterCount(addr1.address);
            expect(numFighters).to.equal(1);
            const gold = await hardhatDojo.getGoldBalance(addr1.address);
            expect(gold).to.equal(5);
        });
        it("should revert if the user does not pay enough to get a new fighter", async function () {
            const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await expect(
                hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address })
            ).to.be.revertedWith("You need to have 5 GOLD");
        });
    });

    describe("Fighting", function () {
        let hardhatDojo, owner, addr1, addr2;
        let fighter1, fighter2;
        beforeEach(async function () {
            ({ hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture));
            await hardhatDojo.connect(addr1).createFighter({ from: addr1.address });
            fighter1 = await hardhatDojo.getFighter(0);
            await hardhatDojo.connect(addr2).createFighter({ from: addr2.address });
            fighter2 = await hardhatDojo.getFighter(1);
        });

        it("should revert if the user does not use is fighter", async function () {
            await expect(
                hardhatDojo.connect(addr1).fight(1, 0, { from: addr1.address })
            ).to.be.revertedWith("You are not the owner of this fighter");
        });

        it("should revert if the user fight himself", async function () {
            await expect(
                hardhatDojo.connect(addr1).fight(0, 0, { from: addr1.address })
            ).to.be.revertedWith("You can't fight yourself");
        });

        //TODO: test if the fighter is wounded
        it("should revert if the user fight a wounded fighter", async function () {
            await expect(
                hardhatDojo.connect(addr2).fight(1, 0, { from: addr2.address })
            ).to.be.revertedWith("Your fighter is wounded, you need to heal him");
        });

        //TODO test if fighters level are the same
        it("should revert if the user fight a fighter with a different level", async function () {
            await hardhatDojo.connect(addr1).fight(0, 1, { from: addr1.address });
            await expect(
                hardhatDojo.connect(addr1).fight(0, 1, { from: addr1.address })
            ).to.be.revertedWith("You can't fight a fighter with a different level");
        });
    });

    describe("Market Place", function () {});

    describe('Trading Token', function () {
        beforeEach(async function () {
            ({ hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture));
            await hardhatDojo.connect(addr1).createFighter({ from: addr1.address });
            await hardhatDojo.connect(addr2).createFighter({ from: addr2.address });
        });
        it('should revert if the user have less than 1 fighter', function () {
            expect(
                hardhatDojo.connect(addr1).sellFighter(0, 5, { from: addr1.address })
            ).to.be.revertedWith('You need to have at least one fighter');
        });
        it('should revert if the user try to trade a fighter he does not own', async function () {
            await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
            await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
            await expect(
                hardhatDojo.connect(addr1).sellFighter(1, 5, { from: addr1.address })
            ).to.be.revertedWith("You don't own this fighter");
        });
        it('should set the fighter for sale', async function () {
            await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
            await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
            await hardhatDojo.connect(addr1).sellFighter(0, 5, { from: addr1.address });
            await hardhatDojo.connect(addr1).getFightersOnSale({ from: addr2.address });
        });
    });
});

