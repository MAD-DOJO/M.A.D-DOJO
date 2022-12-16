pragma solidity ^0.8.17;

// Contract for the Dojo
// The Dojo is the main contract for the game
// The Dojo contains the fighters
// The Dojo is owned by the player
// The Dojo is the contract to trade Fighters token to other players
// The Dojo is more popular if the fighters in the Dojo are more powerful
contract Dojo {
    // The owner of the Dojo
    address public owner;

    // struct of a Fighter
    struct Fighter {
        // The level of the Fighter
        uint256 level;
        // The abilities of the Fighter
        uint256[] abilities;
        // The stats of the Fighter
        uint256[] stats;
        // The weapons of the Fighter
        uint256[] weapons;
    }

    // mapping to store the fighters of the owner
    mapping(address => Fighter[]) public ownerFighters;
    // mapping to store the fighters of the owner
    mapping(address => uint) public ownerFightersCount;

    // The event to notify that a new fighter has been added to the Dojo
    event FighterAdded(address indexed owner, uint256 indexed fighterId);
    // The event to notify that a fighter has been removed from the Dojo
    event FighterRemoved(address indexed owner, uint256 indexed fighterId);
    // The event to notify that a fighter has been traded to another player
    event FighterTraded(address indexed from, address indexed to, uint256 indexed fighterId);

    constructor () {
        owner = msg.sender;
        ownerFightersCount[owner] = 0;
    }

    // get the number of fighters of the owner
    function getOwnerFightersCount(address _owner) public view returns (uint) {
        return ownerFightersCount[_owner];
    }
}
