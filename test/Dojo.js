const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Dojo Smart Contract Test", function () {

    async function deployTokenFixture() {
        // Get the ContractFactory and Signers here.
        const Dojo = await ethers.getContractFactory("Dojo");
        const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
        // To deploy our contract, we just have to call Token.deploy() and await
        // its deployed() method, which happens once its transaction has been
        // mined.
        const hardhatDojo = await Dojo.deploy();
        await hardhatDojo.deployed();
        // Fixtures can return anything you consider useful for your tests
        return { Dojo, hardhatDojo, owner, addr1, addr2, addr3, addr4 };
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
            expect(fighter.stats.wins).to.equal(0);
            expect(fighter.stats.losses).to.equal(0);
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
            ).to.be.revertedWith("You do not have enough gold");
        });
    });

    describe("Withdraw ether", function () {
       it("should withdraw ether from the contract to the owner", async function () {
              const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
              await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
              await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
              await hardhatDojo.connect(owner).withdrawEther({ from: owner.address });
              const balance = await ethers.provider.getBalance(owner.address);
              expect(balance).to.be.greaterThan(ethers.utils.parseEther("0.01"));
       });

       it("should revert if the caller is not the owner", async function () {
           const { hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
           await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
           await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
              await expect(
                    hardhatDojo.connect(addr1).withdrawEther({ from: addr1.address })
                ).to.be.reverted;
       });
    });

    describe("Getting Fighters", function () {
        let hardhatDojo, owner, addr1, addr2;
        beforeEach(async function () {
            ({ hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture));
            await hardhatDojo.connect(addr1).createFighter({ from: addr1.address });
            await hardhatDojo.connect(addr2).createFighter({ from: addr2.address });
            await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
            await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
        });
        it("should get all user's fighters", async function () {
            let userFightersArray = await hardhatDojo.connect(addr1).getMyFighters({ from: addr1.address });
            expect(userFightersArray.length).to.equal(2);
        });

        it("should get all the fighters", async function () {
                let allFighters = await hardhatDojo.getFightersCount();
                expect(allFighters).to.equal(3);
            }
        );
    });

    describe("Leveling up and Fighting", function () {
        let hardhatDojo, owner, addr1, addr2, addr3, addr4;
        let [winnerAddress, winnerId, winningFighter] = [];
        let [loserAddress, loserId] = [];
        beforeEach(async function () {
            ({ hardhatDojo, owner, addr1, addr2, addr3, addr4 } = await loadFixture(deployTokenFixture));
            let addresses = [addr1, addr2, addr3, addr4];

            let fighters = [];
            for (let i = 0; i < addresses.length; i++) {
                await hardhatDojo.connect(addresses[i]).createFighter({ from: addresses[i].address });
                let fighter = await hardhatDojo.getFighter(i)
                fighters.push(fighter);
            }

            // get the score for each fighter
            let fighterScores = [];
            for (let i = 0; i < fighters.length; i++) {
                let score = await hardhatDojo.getFighterScore(i);
                fighterScores.push(score);
            }

            // make sure the scores are different
            let found = false;
            for (let i = 0; i < fighterScores.length; i++) {
                if (found === true)
                    break;
                for (let j = i + 1; j < fighterScores.length; j++) {
                    if (Number(fighterScores[i]) > Number(fighterScores[j])) {
                        winnerAddress = addresses[i];
                        winnerId = i;
                        winningFighter = fighters[i];
                        loserAddress = addresses[j];
                        loserId = j;
                        found = true;
                        break;
                    }
                    if (Number(fighterScores[i]) < Number(fighterScores[j])) {
                        winnerAddress = addresses[j];
                        winnerId = j;
                        winningFighter = fighters[j];
                        loserAddress = addresses[i];
                        loserId = i;
                        found = true;
                        break;
                    }
                }
            }
            console.log(fighterScores);
        });

        describe("Leveling up", function () {
            it("should revert if the user tries to level up a fighter with no gold", async function () {
                while (winningFighter.xp < winningFighter.xpToNextLevel) {
                    await hardhatDojo.connect(winnerAddress).fight(winnerId, loserId, { from: winnerAddress.address });
                    winningFighter = await hardhatDojo.getFighter(winnerId);
                }
                await expect(
                    hardhatDojo.connect(winnerAddress).levelUp(winnerId, { from: winnerAddress.address })
                ).to.be.revertedWith("You do not have enough gold");
            });

            it("should revert if the user tries to level up a fighter that is not ready to level up", async function () {
                await expect(
                    hardhatDojo.connect(winnerAddress).levelUp(winnerId, { from: winnerAddress.address })
                ).to.be.revertedWith("Fighter does not have enough XP");
            });

            it("should level up a fighter when all the required conditions are met", async function () {
                while (winningFighter.xp < winningFighter.xpToNextLevel) {
                    await hardhatDojo.connect(winnerAddress).fight(winnerId, loserId, { from: winnerAddress.address });
                    winningFighter = await hardhatDojo.getFighter(winnerId);
                }
                await hardhatDojo.connect(winnerAddress).payForGold({ from: winnerAddress.address, value: ethers.utils.parseEther("0.01") });
                await expect (
                    await hardhatDojo.connect(winnerAddress).levelUp(winnerId, { from: winnerAddress.address })
                ).to.emit(hardhatDojo, "FighterLevelUp");
            });

            it("should increase the fighter's level by 1 when leveled up", async function () {
                let baselevel = winningFighter.level;
                while (winningFighter.xp < winningFighter.xpToNextLevel) {
                    await hardhatDojo.connect(winnerAddress).fight(winnerId, loserId, { from: winnerAddress.address });
                    winningFighter = await hardhatDojo.getFighter(winnerId);
                }
                await hardhatDojo.connect(winnerAddress).payForGold({ from: winnerAddress.address, value: ethers.utils.parseEther("0.01") });
                await hardhatDojo.connect(winnerAddress).levelUp(winnerId, { from: winnerAddress.address })
                winningFighter = await hardhatDojo.getFighter(winnerId);
                expect(winningFighter.level).to.equal(baselevel + 1);
            });

            it("should restore the fighter's XP to 0 when leveled up", async function () {
                while (winningFighter.xp < winningFighter.xpToNextLevel) {
                    await hardhatDojo.connect(winnerAddress).fight(winnerId, loserId, { from: winnerAddress.address });
                    winningFighter = await hardhatDojo.getFighter(winnerId);
                }
                await hardhatDojo.connect(winnerAddress).payForGold({ from: winnerAddress.address, value: ethers.utils.parseEther("0.01") });
                await hardhatDojo.connect(winnerAddress).levelUp(winnerId, { from: winnerAddress.address })
                winningFighter = await hardhatDojo.getFighter(winnerId);
                expect(winningFighter.xp).to.equal(0);
            });

            it("should increase one random stat when leveld up", async function () {
                let fighterBaseStats = winningFighter;
                while (winningFighter.xp < winningFighter.xpToNextLevel) {
                    await hardhatDojo.connect(winnerAddress).fight(winnerId, loserId, { from: winnerAddress.address });
                    winningFighter = await hardhatDojo.getFighter(winnerId);
                }
                await hardhatDojo.connect(winnerAddress).payForGold({ from: winnerAddress.address, value: ethers.utils.parseEther("0.01") });
                await hardhatDojo.connect(winnerAddress).levelUp(winnerId, { from: winnerAddress.address })
                winningFighter = await hardhatDojo.getFighter(winnerId);
                if(fighterBaseStats.strength < winningFighter.strength) {
                    expect(winningFighter.strength).to.greaterThan(fighterBaseStats.strength);
                }else if(fighterBaseStats.speed < winningFighter.speed) {
                    expect(winningFighter.speed).to.greaterThan(fighterBaseStats.speed);
                }else if(fighterBaseStats.endurance < winningFighter.endurance) {
                    expect(winningFighter.endurance).to.greaterThan(fighterBaseStats.endurance);
                }
            });
        });

        describe("Fighting", function () {
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

            it("should revert if the user fight a wounded fighter", async function () {
                await hardhatDojo.connect(loserAddress).fight(loserId, winnerId, { from: loserAddress.address });
                await hardhatDojo.connect(loserAddress).fight(loserId, winnerId, { from: loserAddress.address });
                await hardhatDojo.connect(loserAddress).fight(loserId, winnerId, { from: loserAddress.address });
                await expect(
                    hardhatDojo.connect(loserAddress).fight(loserId, winnerId, { from: loserAddress.address })
                ).to.be.revertedWith("Your fighter is wounded, you need to heal him");
            });

            //TODO test if fighters level are the same
            it("should revert if the user fight a fighter with a different level", async function () {
                while (winningFighter.xp < winningFighter.xpToNextLevel) {
                    await hardhatDojo.connect(winnerAddress).fight(winnerId, loserId, { from: winnerAddress.address });
                    winningFighter = await hardhatDojo.getFighter(winnerId);
                }
                await hardhatDojo.connect(winnerAddress).payForGold({ from: winnerAddress.address, value: ethers.utils.parseEther("0.01") });
                await hardhatDojo.connect(winnerAddress).levelUp(winnerId, { from: winnerAddress.address });
                await expect(
                    hardhatDojo.connect(winnerAddress).fight(winnerId, loserId, { from: winnerAddress.address })
                ).to.be.revertedWith("You can't fight a fighter with a different level");
            });

            it("should reveert with not enough gold on payToHealFighter", async function () {
                await expect(
                    hardhatDojo.connect(winnerAddress).payToHealFighter(winnerId, { from: winnerAddress.address})
                ).to.be.revertedWith("You do not have enough gold");
            });

            it("should revert if the user figter tries to heal a full health fighter", async function () {
                await hardhatDojo.connect(winnerAddress).payForGold({ from: winnerAddress.address, value: ethers.utils.parseEther("0.01") });
                await expect(
                    hardhatDojo.connect(winnerAddress).payToHealFighter(winnerId, { from: winnerAddress.address})
               ).to.be.revertedWith("Your fighter is not wounded");
            });

            it("should heal the fighter when the user pays for it", async function () {
                await hardhatDojo.connect(loserAddress).fight(loserId, winnerId, { from: loserAddress.address });
                await hardhatDojo.connect(loserAddress).fight(loserId, winnerId, { from: loserAddress.address });
                await hardhatDojo.connect(loserAddress).fight(loserId, winnerId, { from: loserAddress.address });
                await hardhatDojo.connect(loserAddress).payForGold({ from: loserAddress.address, value: ethers.utils.parseEther("0.01") });
                await hardhatDojo.connect(loserAddress).payToHealFighter(loserId, { from: loserAddress.address });
                let loserFighter = await hardhatDojo.getFighter(loserId);
                expect(loserFighter.wounds).to.equal(0);
            });
        });
    });

    describe("Market Place", function () {});

    describe('Trading Token', function () {
        beforeEach(async function () {
            ({ hardhatDojo, owner, addr1, addr2 } = await loadFixture(deployTokenFixture));
            await hardhatDojo.connect(addr1).createFighter({ from: addr1.address });
            await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
            await hardhatDojo.connect(addr2).createFighter({ from: addr2.address });
            await hardhatDojo.connect(addr2).payForGold({ from: addr2.address, value: ethers.utils.parseEther("0.01") });
        });

        describe('Sell Token', function () {
            it('should revert if the user have less than 1 fighter', function () {
                expect(
                    hardhatDojo.connect(addr1).sellFighter(0, 5, { from: addr1.address })
                ).to.be.revertedWith('You need to have at least one fighter');
            });
            it('should revert if the user try to sell a fighter he does not own', async function () {
                await hardhatDojo.connect(addr1).payForGold({ from: addr1.address, value: ethers.utils.parseEther("0.01") });
                await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
                await expect(
                    hardhatDojo.connect(addr1).sellFighter(1, 5, { from: addr1.address })
                ).to.be.revertedWith("You are not the owner of this fighter");
            });
            it('should set the fighter for sale', async function () {
                await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
                await hardhatDojo.connect(addr1).sellFighter(0, 5, { from: addr1.address });
                const sellOffers = await hardhatDojo.connect(addr1).getSellOffers({ from: addr1.address });
                expect(sellOffers.length).to.equal(1);
                expect(sellOffers[0].price).to.equal(5);
                expect(sellOffers[0].tokenId).to.equal(0);
                expect(sellOffers[0].seller).to.equal(addr1.address);
            });
            it('should revert if the user try to sell a fighter at a price of 0', async function () {
                await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
                await expect(
                    hardhatDojo.connect(addr1).sellFighter(0, 0, { from: addr1.address })
                ).to.be.revertedWith("Price must be greater than 0");
            });
        });
        describe('Buy Token', function () {
            it('should revert if the user try to buy a fighter he already own', async function () {
                await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
                await hardhatDojo.connect(addr1).sellFighter(0, 5, { from: addr1.address });
                await expect(
                    hardhatDojo.connect(addr1).buyFighter(0, { from: addr1.address })
                ).to.be.revertedWith("You can't buy your own fighter");
            });
            it('should revert if the user try to buy a fighter that is not for sale', async function () {
                await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
                await expect(
                    hardhatDojo.connect(addr1).buyFighter(0, { from: addr1.address })
                ).to.be.revertedWith("This fighter is not for sale");
            });
            it('should revert if the user try to buy a fighter with a price lower than the one set', async function () {
                await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
                await hardhatDojo.connect(addr1).sellFighter(0, 10, { from: addr1.address });
                await hardhatDojo.connect(addr2).payToCreateFighter({ from: addr2.address });
                await expect(
                    hardhatDojo.connect(addr2).buyFighter(0, { from: addr2.address})
                ).to.be.revertedWith("You do not have enough gold");
            });
            it('should validate the trade', async function () {
                await hardhatDojo.connect(addr1).payToCreateFighter({ from: addr1.address });
                await hardhatDojo.connect(addr1).sellFighter(0, 5, { from: addr1.address });
                await hardhatDojo.connect(addr2).buyFighter(0, { from: addr2.address });
                const owner = await hardhatDojo.connect(addr2).getFighterOwner(0, { from: addr2.address });
                expect(owner).to.equal(addr2.address);
            });
        });
    });
});

