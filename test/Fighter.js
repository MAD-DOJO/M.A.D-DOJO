const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Fighter Smart Contract Test", function () {
    async function deployTokenFixture() {
        // Get the ContractFactory and Signers here.
        const Fighter = await ethers.getContractFactory("Fighter");
        const [owner, addr1, addr2] = await ethers.getSigners();
        // To deploy our contract, we just have to call Token.deploy() and await
        // its deployed() method, which happens once its transaction has been
        // mined.
        const hardhatFighter = await Fighter.deploy();
        await hardhatFighter.deployed();
        // Fixtures can return anything you consider useful for your tests
        return { Fighter, hardhatFighter, owner, addr1, addr2 };
    }

    describe("ERC721", function () {
        it("Should be ERC721", async function () {
            const { hardhatFighter, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            expect(await hardhatFighter.supportsInterface("0x80ac58cd")).to.equal(true);
        });

        it("Should return the owner of the token", async function () {
            const { hardhatFighter, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await hardhatFighter.createFighter(50, 50, 50, 100, 100, 50, 50, 50, 1, "Fighter 1", { from: owner.address });
            expect(await hardhatFighter.ownerOf(0)).to.equal(owner.address);
        });
    });
});