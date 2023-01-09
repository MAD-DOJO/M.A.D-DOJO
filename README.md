# Dojo

Dojo is a game that allows users to create and train their own fighters. Each fighter has a name, level, and three stats: strength, speed, and endurance. These stats determine the fighter's ability in combat and can be improved through training.

Users can create their own fighters by calling the createFighter function. If they do not already have a fighter, a new one will be created for them. Each new fighter is given a unique name and a set of randomly generated stats.

The contract also features a gold currency that can be purchased with ether. Gold can be used to purchase additional fighters or heal existing ones that have been injured in combat. Users can purchase gold by calling the payForGold function and sending ether to the contract.

Users can pit their fighters against each other in combat by calling the fight function and specifying the id of the fighter they wish to use. The winner of the fight is determined by the fighter with the highest strength stat. In the event of a tie, the fighter with the highest speed stat wins. If both fighters have the same strength and speed, the fight is considered a draw.

After a fight, the losing fighter is injured and must be healed before it can fight again. Users can heal their fighters by calling the payToHealFighter function and using gold to pay for the heal.

Dojo also includes events that are emitted when a new fighter is created, gold is purchased, or a fight occurs. These events can be used to track the activity of the contract and update user interfaces.

## Getting Started

To use Dojo, you will need to have a wallet that can interact with the Ethereum blockchain, such as MetaMask. You will also need some ether to purchase gold and create or heal fighters.

1. Connect to the Ethereum network of your choice using your wallet.
2. Interact with Dojo by using a tool such as [Remix](https://remix.ethereum.org/) or [MyEtherWallet](https://www.myetherwallet.com/).
3. Call the `payForGold` function to purchase gold with ether.
4. Call the `createFighter` function to create a new fighter for yourself.
5. Use the `fight` function to pit your fighter against another user's fighter.
6. If your fighter is injured in combat, use the `payToHealFighter` function and your gold balance to heal it.

## Events

Dojo includes several events that can be used to track the activity of the contract:

- `NewFighter` is emitted when a new fighter is created. It includes the id and name of the new fighter.
- `NewGold` is emitted when gold is purchased. It includes the id and name of the gold.
- `Fight` is emitted when a fight occurs. It includes the id and name of the winning fighter, as well as the id and name of the losing fighter.

## Contract Details

Dojo is implemented as an extension of the ERC1155 and Ownable contracts. It features a `Fighter` struct to store information about each fighter, and mappings to track the ownership and number of fighters owned by each user.

Each fighter has a name, level, and three stats: strength, speed, and endurance. These stats determine the fighter's ability in combat and can be improved through training. The contract also has internal functions to handle the creation and generation of stats for new fighters, and the minting and burning of gold.

## Disclaimer

Dojo is for entertainment purposes only and carries no real-world value. Please use it at your own risk.

___

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
