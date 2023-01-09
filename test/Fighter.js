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
        it("Should return the owner of the token", async function () {
            const { hardhatFighter, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await hardhatFighter.connect(addr1).createFighter({ from: addr1.address });
            await hardhatFighter.connect(addr2).createFighter({ from: addr2.address });
            expect(await hardhatFighter.ownerOf(0)).to.equal(addr1.address);
            expect(await hardhatFighter.ownerOf(1)).to.equal(addr2.address);
        });
    });
});