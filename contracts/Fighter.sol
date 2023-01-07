// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Dojo.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Fighter is ERC721 {

    address private _owner;

    uint256 public  id;
    string public  fighterName;
    uint public  wins;
    uint public  losses;
    uint public  wounds;

    // Statistiques principales du combattant
    uint256 public  strength;
    uint256 public  speed;
    uint256 public  endurance;
    uint256 public  standardHP;
    uint256 public  complementaryHP;

    // Statistiques cachées du combattant
    uint256 public  comboRate;
    uint256 public  evasion;
    uint256 public  damage;

    // Niveau du combattant
    uint256 public  level;

    constructor() ERC721("Fighter", "FTR") {
        _owner = msg.sender;
    }

    // mintFighter est une fonction qui permet de créer un nouveau combattant avec des statistiques aléatoires
    function createFighter(uint256 _strength, uint256 _speed, uint256 _endurance, uint256 _standardHP, uint256 _complementaryHP, uint256 _comboRate, uint256 _evasion, uint256 _damage, uint256 _level, string memory _fighterName) public {
        strength = _strength;
        speed = _speed;
        endurance = _endurance;
        standardHP = _standardHP;
        complementaryHP = _complementaryHP;
        comboRate = _comboRate;
        evasion = _evasion;
        damage = _damage;
        level = _level;
        fighterName = _fighterName;
    }

    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        return _owner;
    }

    function levelUp(uint256 _strengthBoost, uint256 _speedBoost, uint256 _enduranceBoost) public {
    }
}
