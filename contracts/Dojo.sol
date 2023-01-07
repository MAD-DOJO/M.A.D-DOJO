// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Fighter.sol";

contract Dojo is Ownable {
    event NewFighter(uint fighterId, string name);

//  Fighter[] public fighters;
//  mapping(uint => address) public fighterToOwner;
    mapping(address => uint) ownerFighterCount;
    mapping (uint256 => address) private fighters;

//    function createFighter(uint _level, uint _health, uint _lives, uint _strength, string memory _name) public {
//        uint id = fighters.length;
//        fighters.push(Fighter(_level, _health, _lives, _strength, 0, 0, _name));
//        fighterToOwner[id] = msg.sender;
//        ownerFighterCount[msg.sender]++;
//    }

//    function getOwnerFighters() public view returns (Fighter[] memory) {
//        Fighter[] memory result = new Fighter[](ownerFighterCount[msg.sender]);
//        uint counter = 0;
//        for (uint i = 0; i < fighters.length; i++) {
//            if (fighterToOwner[i] == msg.sender) {
//                result[counter] = fighters[i];
//                counter++;
//            }
//        }
//        return result;
//    }
//
//    function getSpecificOwnerFighters(address _owner) public view returns (Fighter[] memory) {
//        Fighter[] memory result = new Fighter[](ownerFighterCount[_owner]);
//        uint counter = 0;
//        for (uint i = 0; i < fighters.length; i++) {
//            if (fighterToOwner[i] == _owner) {
//                result[counter] = fighters[i];
//                counter++;
//            }
//        }
//        return result;
//    }
//
//    function getFighterById(uint _id) public view returns (Fighter memory) {
//        return fighters[_id];
//    }
//
//    function getFighterCount() public view returns (uint) {
//        return fighters.length;
//    }
//
//    function getFighterOwner(uint _id) public view returns (address) {
//        return fighterToOwner[_id];
//    }
//
//    function getFighterOwnerCount(address _owner) public view returns (uint) {
//        return ownerFighterCount[_owner];
//    }
//
//    function getFighters() public view returns (Fighter[] memory) {
//        return fighters;
//    }
}
