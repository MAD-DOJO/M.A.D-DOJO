# Dojo

Dojo is a game that allows users to create and train their own fighters. Each fighter has a name, level, and three stats: strength, speed, and endurance. These stats determine the fighter's ability in combat and can be improved through training.

Users can create their own fighters by calling the createFighter function. If they do not already have a fighter, a new one will be created for them. Each new fighter is given a unique name and a set of randomly generated stats.

The contract also features a gold currency that can be purchased with ether. Gold can be used to purchase additional fighters or heal existing ones that have been injured in combat. Users can purchase gold by calling the payForGold function and sending ether to the contract.

Users can pit their fighters against each other in combat by calling the fight function and specifying the id of the fighter they wish to use. The winner of the fight is determined by the fighter with the highest strength stat. In the event of a tie, the fighter with the highest speed stat wins. If both fighters have the same strength and speed, the fight is considered a draw.

After a fight, the losing fighter is injured and must be healed before it can fight again. Users can heal their fighters by calling the payToHealFighter function and using gold to pay for the heal.

Dojo also includes events that are emitted when a new fighter is created, gold is purchased, or a fight occurs. These events can be used to track the activity of the contract and update user interfaces.

# Getting Started

### Using in Local :
- Add .env file at root 
```dotenv
API_URL=NO NEED IN LOCAL
PRIVATE_KEY=PRIVATE KEY OF YOUR ACCOUNT
ETHERSCAN_API_KEY=NO NEED IN LOCAL
```

- Start project locally with these commands
```bash
npx hardhat compile
npx hardhat node
npx hardhat run --network localhost scripts/deploy.js
```
For a better usage launch commands in different consoles

### Using in Goerli (testnet) :
- Add .env file at root
```dotenv
API_URL=API URL OF YOUR INFURA PROJECT
PRIVATE_KEY=PRIVATE KEY OF YOUR ACCOUNT
ETHERSCAN_API_KEY=NO NEED HERE
```

- Deploy contract on Goerli blockchain with these command
```bash
npx hardhat run scripts/deploy.js --network goerli
```

### Deploy on Etherscan :
-Add .env file at root
```dotenv
API_URL=API URL OF YOUR INFURA PROJECT
PRIVATE_KEY=PRIVATE KEY OF YOUR ACCOUNT
ETHERSCAN_API_KEY=Etherscan API KEY
```

- Deploy contract on etherscan with these command
```bash
npx hardhat verify --network goerli
```

___

## FRONT

### Using in Local :
- Add .env file to root
```dotenv
VITE_ALCHEMY_KEY=NO NEED IN LOCAL
VITE_DOJO_CONTRACT=ADDRESS OF YOUR CONTRACT
```

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