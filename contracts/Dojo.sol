pragma solidity ^0.8.17;

import "./Fighter.sol";

// Contract for the Dojo
// The Dojo is the main contract for the game
// The Dojo contains the fighters
// The Dojo is owned by the player
// The Dojo is the contract to trade Fighters token to other players
// The Dojo is more popular if the fighters in the Dojo are more powerful
contract Dojo is Fighter {
    // The owner of the Dojo
    address public owner;
    // The fighters in the Dojo
    Fighter[] public fighters;
    // The number of fighters in the Dojo
    uint256 public fightersCount;

    // The event to notify that a new fighter has been added to the Dojo
    event FighterAdded(address indexed owner, uint256 indexed fighterId);
    // The event to notify that a fighter has been removed from the Dojo
    event FighterRemoved(address indexed owner, uint256 indexed fighterId);
    // The event to notify that a fighter has been traded to another player
    event FighterTraded(address indexed from, address indexed to, uint256 indexed fighterId);

    constructor () {
        owner = msg.sender;
    }

    // Add a new fighter to the Dojo
    function addFighter(Fighter _fighter) public {
        // Only the owner of the Dojo can add a new fighter
        require(msg.sender == owner);
        // Add the new fighter to the Dojo
        fighters.push(_fighter);
        // Increment the number of fighters in the Dojo
        fightersCount++;
        // Notify that a new fighter has been added to the Dojo
        FighterAdded(owner, fightersCount);
    }

    // Remove a fighter from the Dojo
    function removeFighter(uint256 _fighterId) public {
        // Only the owner of the Dojo can remove a fighter
        require(msg.sender == owner);
        // Remove the fighter from the Dojo
        delete fighters[_fighterId];
        // Decrement the number of fighters in the Dojo
        fightersCount--;
        // Notify that a fighter has been removed from the Dojo
        FighterRemoved(owner, _fighterId);
    }

    // Trade a fighter to another player
    function tradeFighter(address _to, uint256 _fighterId) public {
        // Only the owner of the Dojo can trade a fighter
        require(msg.sender == owner);
        // Remove the fighter from the Dojo
        delete fighters[_fighterId];
        // Decrement the number of fighters in the Dojo
        fightersCount--;
        // Notify that a fighter has been traded to another player
        FighterTraded(owner, _to, _fighterId);
    }

    // Get the number of fighters in the Dojo
    function getFightersCount() public view returns (uint256) {
        return fightersCount;
    }
}
