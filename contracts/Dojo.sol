// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import ERC1155 from OpenZeppelin
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Dojo is Ownable, ERC1155 {
    event NewFighter(uint fighterId, string name);

    struct Fighter {
        string name;
        uint32 level;
        uint256 strength;
        uint256 speed;
        uint256 endurance;
        uint wins;
        uint losses;
        uint wounds;
    }

    constructor() ERC1155("") {
        _createFighter();
    }

    uint256 public constant GOLD = 0;
    // Tableau qui contient tous les combattants
    Fighter[] public fighters;

    // Mapping qui associe chaque combattant à son propriétaire
    mapping (uint256 => address) private fighterToOwner;
    mapping(address => uint) ownerFighterCount;

    // Fonction qui permet de créer un nouveau combattant
    function _createFighter() internal {
        // Création d'un nouveau combattant
        uint256 _id = fighters.length;
        string memory _name = string.concat("Fighter#", Strings.toString(_id));
        fighters.push(Fighter(_name, 1, 10, 10, 10, 0, 0, 0));
        fighterToOwner[_id] = msg.sender;
        ownerFighterCount[msg.sender]++;
        emit NewFighter(_id, _name);
    }

    // Fonction payable qui permet de payer pour augmenter le nombre de GOLD
    function payForGold() public payable {
        require(msg.value == 0.01 ether, "You need to pay 0.01 ether");
        _mint(msg.sender, GOLD, 10, "");
    }

    // Fonction qui permet de payer pour créer un nouveau combattant si l'utilisateur détient déjà un combattant
    function payToCreateFighter() public payable {
        require(balanceOf(msg.sender, GOLD) >= 5, "You need to have 5 GOLD");
        _burn(msg.sender, GOLD, 5);
        _createFighter();
    }

    // Fonction qui permet de récuperer le solde du contrat Dojo
    function withdrawEther() public onlyOwner {
        // Récupérer l'ether détenu par le contrat et le transférer à l'appelant
        payable(msg.sender).transfer(address(this).balance);
    }

    // Fonction qui permet de récupérer le nombre de combattants d'un propriétaire
    function getOwnerFighterCount(address _owner) public view returns (uint) {
        return ownerFighterCount[_owner];
    }

    // Fonction qui permet de récupérer le propriétaire d'un combattant
    function getFighterOwner(uint256 _id) public view returns (address) {
        return fighterToOwner[_id];
    }

    // Fonction qui permet de récupérer les informations d'un combattant
    function getFighter(uint256 _id) public view returns (Fighter memory) {
        Fighter memory _fighter = fighters[_id];
        return _fighter;
    }

    // Fonction qui permet de récupérer le nombre de combattants
    function getFightersCount() public view returns (uint) {
        return fighters.length;
    }
}
