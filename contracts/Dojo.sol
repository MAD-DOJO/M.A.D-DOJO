pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dojo is Ownable {
    event NewFighter(uint fighterId, string name);

    Fighter[] public fighters;
    mapping(uint => address) public fighterToOwner;
    mapping(address => uint) ownerFighterCount;

    struct Fighter {
        uint level;
        uint health;
        uint lives;
        uint strength;
        uint wins;
        uint losses;
        string name;
    }

    function createFighter(uint _level, uint _health, uint _lives, uint _strength, string memory _name) public {
        uint id = fighters.length;
        fighters.push(Fighter(_level, _health, _lives, _strength, 0, 0, _name));
        fighterToOwner[id] = msg.sender;
        ownerFighterCount[msg.sender]++;
        emit NewFighter(id, _name);
    }

    //TODO: Implement the function, better verification of the fighter Owner
    function _transfer(address _from, address _to, uint _fighterId) internal {
        ownerFighterCount[_to]++;
        ownerFighterCount[msg.sender]--;
        fighterToOwner[_fighterId] = _to;
    }

    function transfer(address _to, uint _fighterId) public {
        require(msg.sender == fighterToOwner[_fighterId], "You are not the owner of this fighter");
        _transfer(msg.sender, _to, _fighterId);
    }

    //TODO: Implement the function
    function fight(uint _fighterId, uint _targetId) public {}

    function getOwnerFighters() public view returns (Fighter[] memory) {
        Fighter[] memory result = new Fighter[](ownerFighterCount[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i < fighters.length; i++) {
            if (fighterToOwner[i] == msg.sender) {
                result[counter] = fighters[i];
                counter++;
            }
        }
        return result;
    }

    function getSpecificOwnerFighters(address _owner) public view returns (Fighter[] memory) {
        Fighter[] memory result = new Fighter[](ownerFighterCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < fighters.length; i++) {
            if (fighterToOwner[i] == _owner) {
                result[counter] = fighters[i];
                counter++;
            }
        }
        return result;
    }

    function getFighterById(uint _id) public view returns (Fighter memory) {
        return fighters[_id];
    }

    function getFighterCount() public view returns (uint) {
        return fighters.length;
    }

    function getFighterOwner(uint _id) public view returns (address) {
        return fighterToOwner[_id];
    }

    function getFighterOwnerCount(address _owner) public view returns (uint) {
        return ownerFighterCount[_owner];
    }

    function getFighters() public view returns (Fighter[] memory) {
        return fighters;
    }
}
