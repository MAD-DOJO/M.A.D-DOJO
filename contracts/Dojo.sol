// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Dojo is Ownable, ERC1155 {

    using SafeMath for uint256;

    event NewFighter(uint fighterId, string name);
    event NewGold(uint goldId, string name);
    event FighterLevelUp(uint fighterId, uint level);
    event FighterFightResult(uint fighterId, uint opponentId, string result);

    // Modifier de méthode pour vérifier que l'adresse est celle du propriétaire du Fighter
    modifier onlyOwnerOf(uint _fighterId) {
        require(msg.sender == fighterToOwner[_fighterId]);
        _;
    }

    // Modifier de méthode pour vérifier que le Fighter soit du bon level
    modifier isAboveLevel(uint _fighterId, uint _level) {
        require(fighters[_fighterId].level >= _level);
        _;
    }

    // Structure de données pour les Fighters
    struct Fighter {
        string name;
        uint32 level;
        uint32 xp;
        uint32 xpToNextLevel;
        string uri;
        Rank rank;
        uint256 strength;
        uint256 speed;
        uint256 endurance;
        uint wins;
        uint losses;
        uint wounds;
    }

    enum Rank {Beginner, Novice, Apprentice, Adept, Master, GrandMaster, Legendary}

    //TODO: Ajouter les images stockées sur IPFS pour les Fighters
    constructor() ERC1155("https://bafybeiajtvxmsvidnwxj5ezsurtphdgdy47uuki34ma3byi3vt42l4iaom.ipfs.nftstorage.link/{id}.json") {}

    uint256 public constant GOLD = 0;
    uint256 public constant FIGHTER = 1;
    // Tableau qui contient tous les combattants
    Fighter[] private fighters;

    // Mapping qui associe chaque combattant à son propriétaire
    mapping (uint256 => address) fighterToOwner;
    mapping(address => uint) ownerFighterCount;

    // Fonction qui permet de créer un nouveau combattant
    function _createFighter() internal {
        // Création d'un nouveau combattant
        uint256 _id = fighters.length;
        string memory _name = string.concat("Fighter#", Strings.toString(_id));
        (uint _strength, uint _speed, uint _endurance) = _generateFighterStats();
        fighters.push(Fighter(_name, 1, 0, 6, '', Rank.Beginner, _strength, _speed, _endurance, 0, 0, 0));
        _mint(msg.sender, FIGHTER, 1, "");
        fighterToOwner[_id] = msg.sender;
        ownerFighterCount[msg.sender]++;
        emit NewFighter(_id, _name);
    }

    // Fonction to generate random statistics to a new Fighter (between 1 and 5) and all stats must be different from each other using the Fighter # as seed
    function _generateFighterStats() internal view returns (uint256, uint256, uint256) {
        uint256 _seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, fighters.length)));
        uint256 _strength = (_seed % 5) + 1;
        uint256 _speed = ((_seed / 5) % 5) + 1;
        uint256 _endurance = ((_seed / 25) % 5) + 1;
        return (_strength, _speed, _endurance);
    }

    function createFighter() public {
        // Vérifier si l'utilisateur a déjà un combattant
        if (ownerFighterCount[msg.sender] == 0) {
            // Si l'utilisateur n'a pas de combattant, en créer un pour lui
            _createFighter();
        }else{
            // Si l'utilisateur a déjà un combattant, ne rien faire
            revert("You already have a fighter, pay to create a new one");
        }
    }

    // Fonction qui permet de return le nom du fichier en string
    function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/bafybeihjjkwdrxxjnuwevlqtqmh3iegcadc32sio4wmo7bv2gbf34qs34a/",
                Strings.toString(_tokenid),".json"
            )
        );
    }

    // Fonction payable qui permet de payer pour augmenter le nombre de GOLD
    function payForGold() public payable {
        require(msg.value == 0.01 ether, "You must pay at least 0.01 ETH to get gold");
        _mint(msg.sender, GOLD, 10, "");
    }

    // Fonction qui permet de payer pour créer un nouveau combattant si l'utilisateur détient déjà un combattant
    function payToCreateFighter() public {
        require(balanceOf(msg.sender, GOLD) >= 5, "You need to have 5 GOLD");
        _burn(msg.sender, GOLD, 5);
        _createFighter();
    }

    // Fonction pour payer lorsque le combattant arrive à 3 blessures pour le soigner et le remettre à 0 en payant 2 gold
    function payToHealFighter(uint256 _fighterId) public {
        require(balanceOf(msg.sender, GOLD) >= 2, "You need to have 2 GOLD");
        require(fighterToOwner[_fighterId] == msg.sender, "You are not the owner of this fighter");
        require(fighters[_fighterId].wounds == 3, "Your fighter is not wounded");
        _burn(msg.sender, GOLD, 2);
        fighters[_fighterId].wounds = 0;
    }

    // Fonction qui permet de récuperer le solde du contrat Dojo
    function withdrawEther() public onlyOwner {
        // Récupérer l'ether détenu par le contrat et le transférer à l'appelant
        payable(msg.sender).transfer(address(this).balance);
    }

    // Fonction pour récuperer le nombre de gold de l'utilisateur
    function getGoldBalance(address _user) public view returns (uint256) {
        return balanceOf(_user, GOLD);
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

    // Fonction qui permet de récupérer la liste des combattants du msg.sender
    function getFighters() public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](ownerFighterCount[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i < fighters.length; i++) {
            if (fighterToOwner[i] == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    //TODO: Implementer une méthode 'Fight' entre deux token Fighter et mettre à jour uniquement le combattant qui attaque. Combat par rapport aux stats de chaque combattant
    //Implementer une méthode 'Fight' entre deux token Fighter et mettre à jour uniquement le combattant qui attaque. Combat par rapport aux stats de chaque combattant
    function fight(uint256 _fighterId, uint256 _opponentId) public {
        require(fighterToOwner[_fighterId] == msg.sender, "You are not the owner of this fighter");
        require(fighterToOwner[_opponentId] != msg.sender, "You can't fight yourself");
        require(fighters[_fighterId].wounds < 3, "Your fighter is wounded, you need to heal him");
        //require(fighters[_opponentId].wounds < 3, "Your opponent is wounded, you can't fight him");
        require(fighters[_fighterId].level == fighters[_opponentId].level, "You can't fight a fighter with a different level");
        //uint256 _seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, fighters.length)));
        //uint256 _bonus = (_seed % 10) + 1;
        uint256 _fighterScore = getFighterScore(_fighterId);
        uint256 _opponentScore = getFighterScore(_opponentId);
        if (_fighterScore > _opponentScore) {
            fighters[_fighterId].level++;
            emit FighterFightResult(_fighterId, _opponentId, 'Won');
        } else {
            fighters[_fighterId].wounds++;
            emit FighterFightResult(_fighterId ,_opponentId, 'Lost');
        }
    }

    // Fonction qui permet de return le score d'un combattant using safeMath
    function getFighterScore(uint256 _fighterId) public view returns (uint256) {
        return fighters[_fighterId].strength.add(fighters[_fighterId].speed).add(fighters[_fighterId].endurance);
    }

    //TODO: Implementer une méthode 'levelUp' permettant de monter de niveau un combattant et de payer 1 gold pour cela. Augmente une ou plusieurs stats du combattant aléatoirement
    function levelUp() public {

    }

    //TODO: Implementer une méthode 'enterTournament' permettant de participer à un tournoi. Le tournoi est un combat entre 4 combattants. Si le combattant gagne le tournoi il monte de rang et gagne 2 gold
    function enterTournament() public {

    }

    //TODO: Implementer une methode afin de mettre en vente un token Fighter sur le marché uniquement si l'utilisateur possède plus d'un combattant
    function putOnSale() public {

    }

    //TODO: Implementer une methode afin d'acheter un token Fighter sur le marché
    function buyOnSale() public {

    }

    //TODO: implementer une methode pour récupérer la liste des combattants en vente
    function getFightersOnSale() public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](ownerFighterCount[msg.sender]);
        return result;
    }

    //TODO: implementer une methode pour récupérer la liste des combattants en vente d'un utilisateur
    function getFightersOnSaleByUser() public view returns (uint256[] memory) {
        // return uint256[];
        uint256[] memory result = new uint256[](ownerFighterCount[msg.sender]);
        return result;
    }

    //TODO: implementer une méthode afin de proposer un échange de token à un utilisateur uniquement si l'utilisateur possède plus d'un combattant
    function proposeExchange() public {

    }

    //TODO: implementer une méthode afin d'accepter un échange de token à un utilisateur
    function acceptExchange() public {

    }

    //TODO: implementer les méthodes de transfer de Token Fighter ERC1155
    function transfer() public {

    }

    //TODO: implementer une methode d'appovals
    function approval() public {

    }
}
