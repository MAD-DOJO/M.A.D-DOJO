pragma solidity ^0.8.17;

contract Dojo {
    address public owner;
    mapping(address => uint) public numFighters;
    mapping(address => Fighter[]) public fighters;

    struct Fighter {
        uint level;
        uint health;
        uint lives;
        uint strength;
        string name;
    }

    constructor() {
        owner = msg.sender;
    }

    function createFighter(uint _level, uint _health, uint _lives, uint _strength, string memory _name) public {
        Fighter memory fighter = Fighter(_level, _health, _lives, _strength, _name);
        fighters[msg.sender].push(fighter);
        numFighters[msg.sender]++;
    }

    //TODO: Implement the function, better verification of the fighter Owner
    function exchangeFighters(address _from, address _to) public {
        require(numFighters[_from] > 0, "The sender has no fighters");
        require(numFighters[_to] > 0, "The receiver has no fighters");

        Fighter memory fighter = fighters[_from][0];
        fighters[_from][0] = fighters[_to][0];
        fighters[_to][0] = fighter;
    }

    //TODO: Implement the function
    function combat(address _address1, uint _index1, address _address2, uint _index2) public {
        require(_address1 != _address2, "Cannot fight with the same address");
        require(_index1 < numFighters[_address1], "Invalid index for fighter from");
        require(_index2 < numFighters[_address2], "Invalid index for fighter to");

        Fighter storage fighter1 = fighters[_address1][_index1];
        Fighter storage fighter2 = fighters[_address2][_index2];

        // Modify fighter attributes based on the outcome of the combat
        // ...
    }

    function getNumFighters(address _owner) public view returns (uint) {
        return numFighters[_owner];
    }

    function getFighter(address _owner, string _name) public view returns (Fighter memory) {
        require(_index < numFighters[_owner], "Invalid index for fighter");
        return fighters[_owner][_index];
    }
}
