// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Dojo is Ownable, ERC1155 {

    using SafeMath for uint256;

    event NewFighter(uint fighterId, string name);
    event NewGold(uint goldId, string name);
    event FighterLevelUp(uint fighterId, uint bonus, uint stat);
    event FighterFightResult(uint fighterId, uint opponentId, string result);
    event FighterForSale(uint fighterId, uint price);
    event TradeProposed(uint requestId, uint fighterId, uint otherFighterId, address otherAddress);
    event TradeExecuted(uint requestId);

    // Modifier de méthode pour vérifier que l'adresse est celle du propriétaire du Fighter
    modifier onlyOwnerOf(uint _fighterId) {
        require(msg.sender == fighterToOwner[_fighterId], "You are not the owner of this fighter");
        _;
    }

    // Modifier de méthode pour vérifier que le Fighter soit du bon level
    modifier isAboveLevel(uint _fighterId, uint _level) {
        require(fighters[_fighterId].level >= _level, "Fighter is not high enough level");
        _;
    }

    modifier hasEnoughXP(uint _fighterId) {
        require(fighters[_fighterId].xp >= fighters[_fighterId].xpToNextLevel, "Fighter does not have enough XP");
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

    // Structure pour enregistrer les offres de vente
    struct FighterSell {
        uint256 tokenId;
        address seller;
        uint256 price;
    }

    // Structure pour enregistrer les demandes d'échange
    struct TradeRequest {
        uint tokenId;
        uint otherTokenId;
        address otherAddress;
        bool accepted;
    }

    // Mapping pour enregistrer les offres de vente
    mapping(uint256 => FighterSell) public fighterSellOffers;

    // Mapping pour stocker les demandes d'échange
    mapping (uint256 => TradeRequest) public tradeRequests;

    enum Rank {Beginner, Novice, Apprentice, Adept, Master, GrandMaster, Legendary}

    //TODO: Ajouter les images stockées sur IPFS pour les Fighters
    constructor() ERC1155("https://bafybeiajtvxmsvidnwxj5ezsurtphdgdy47uuki34ma3byi3vt42l4iaom.ipfs.nftstorage.link/{id}.json") {}

    uint256 public constant GOLD = 0;
    uint256 public constant FIGHTER = 1;

    uint256 public tradeCount;
    // Tableau qui contient tous les combattants
    Fighter[] public fighters;

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

    //Méthode 'Fight' entre deux token Fighter et mettre à jour uniquement le combattant qui attaque. Combat par rapport aux stats de chaque combattant
    function fight(uint256 _fighterId, uint256 _opponentId) public onlyOwnerOf(_fighterId) {
        require(fighterToOwner[_opponentId] != msg.sender, "You can't fight yourself");
        require(fighters[_fighterId].wounds < 3, "Your fighter is wounded, you need to heal him");
        require(fighters[_fighterId].level == fighters[_opponentId].level, "You can't fight a fighter with a different level");
        //uint256 _seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, fighters.length)));
        //uint256 _bonus = (_seed % 10) + 1;
        uint256 _fighterScore = getFighterScore(_fighterId);
        uint256 _opponentScore = getFighterScore(_opponentId);
        if (_fighterScore > _opponentScore) {
            fighters[_fighterId].xp++;
            emit FighterFightResult(_fighterId, _opponentId, 'Won');
        } else if(_fighterScore < _opponentScore) {
            fighters[_fighterId].wounds++;
            emit FighterFightResult(_fighterId ,_opponentId, 'Lost');
        } else if(_fighterScore == _opponentScore) {
            fighters[_fighterId].xp++;
            emit FighterFightResult(_fighterId, _opponentId, 'Won');
        }
    }

    // Fonction qui permet de return le score d'un combattant using safeMath
    function getFighterScore(uint256 _fighterId) public view returns (uint256) {
        return fighters[_fighterId].strength.add(fighters[_fighterId].speed).add(fighters[_fighterId].endurance);
    }

    function levelUp(uint256 _fighterId) public onlyOwnerOf(_fighterId) hasEnoughXP(_fighterId) {
        require(balanceOf(msg.sender, GOLD) >= 1, "You need to have 1 GOLD");
        _burn(msg.sender, GOLD, 1);
        uint256 _seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, fighters.length)));
        uint256 _bonus = (_seed % 5) + 1;
        uint256 _stat = (_seed % 3) + 1;
        if (_stat == 1) {
            fighters[_fighterId].strength = fighters[_fighterId].strength.add(_bonus);
        } else if (_stat == 2) {
            fighters[_fighterId].speed = fighters[_fighterId].speed.add(_bonus);
        } else if (_stat == 3) {
            fighters[_fighterId].endurance = fighters[_fighterId].endurance.add(_bonus);
        }
        fighters[_fighterId].xp = 0;
        fighters[_fighterId].level++;
        emit FighterLevelUp(_fighterId, _bonus, _stat);
    }

    //TODO: Implementer une méthode 'enterTournament' permettant de participer à un tournoi. Le tournoi est un combat entre 4 combattants. Si le combattant gagne le tournoi il monte de rang et gagne 2 gold
    function enterTournament() public {

    }

    //Methode afin de mettre en vente un token Fighter sur le marché uniquement si l'utilisateur possède plus d'un combattant
    function sellFighter(uint256 _fighterId, uint256 _price) public {
        require(ownerFighterCount[msg.sender] > 1, "You need to have more than 1 fighter");
        require(fighterToOwner[_fighterId] == msg.sender, "You don't own this fighter");
        // Transférer le token à l'adresse 0x0 (état "non-propriétaire")
        _safeTransferFrom(msg.sender, address(0), FIGHTER, 1, "");
        // Enregistrer l'offre de vente
        fighterSellOffers[_fighterId] = FighterSell(_fighterId, msg.sender, _price);
        emit FighterForSale(_fighterId, _price);
    }

    //Methode afin d'acheter un token Fighter sur le marché
    function buyFighter(uint256 _fighterId) public payable {
        // Vérifier qu'il y a une offre de vente en cours pour ce token
        require(fighterSellOffers[_fighterId].price > 0, "This fighter is not for sale");
        // Vérifier que l'acheteur a suffisamment de fonds
        require(msg.value >= fighterSellOffers[_fighterId].price, "You do not have enough funds to buy this fighter");
        // Transférer le token à l'acheteur
        _safeTransferFrom(address(0), msg.sender, FIGHTER, 1, "");
        // Mettre à jour le propriétaire du token
        fighterToOwner[_fighterId] = msg.sender;
        // Enlever l'offre de vente
        fighterSellOffers[_fighterId].price = 0;
    }

    //Methode pour récupérer la liste des combattants en vente
    function getFightersOnSale() public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](fighters.length);
        uint counter = 0;
        for (uint i = 0; i < fighters.length; i++) {
            if (fighterSellOffers[i].price > 0) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    //Methode pour récupérer la liste des combattants en vente d'un utilisateur
    function getFightersOnSaleByUser() public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](fighters.length);
        uint counter = 0;
        for (uint i = 0; i < fighters.length; i++) {
            if (fighterSellOffers[i].price > 0 && fighterSellOffers[i].seller == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    // Méthode pour proposer un échange
    function proposeTrade(uint256 _fighterId, uint256 _otherFighterId, address _otherAddress) public {
        // Vérifier que le propriétaire actuel est bien celui qui essaie de faire l'échange
        require(msg.sender == fighterToOwner[_fighterId], "You are not the owner of this fighter");
        // Créer une demande d'échange
        uint _requestId = tradeCount;
        tradeRequests[_requestId] = TradeRequest(_fighterId, _otherFighterId, _otherAddress, false);
        tradeCount++;
        // Emettre un événement pour informer l'autre utilisateur de la demande
        emit TradeProposed(_requestId, _fighterId, _otherFighterId, _otherAddress);
    }

    function acceptTrade(uint _requestId) public {
        // Vérifier que l'utilisateur est bien l'autre utilisateur de la demande
        require(msg.sender == tradeRequests[_requestId].otherAddress, "You are not the intended recipient of this trade");
        // Vérifier que l'échange n'a pas déjà été accepté
        require(!tradeRequests[_requestId].accepted, "This trade has already been accepted");
        // Transférer votre token à l'autre utilisateur
        _safeTransferFrom(msg.sender, tradeRequests[_requestId].otherAddress, FIGHTER, tradeRequests[_requestId].tokenId, "");
        // Transférer le token de l'autre utilisateur à vous
        _safeTransferFrom(tradeRequests[_requestId].otherAddress, msg.sender, FIGHTER, tradeRequests[_requestId].otherTokenId, "");
        // Mettre à jour les propriétaires des tokens
        fighterToOwner[tradeRequests[_requestId].tokenId] = tradeRequests[_requestId].otherAddress;
        fighterToOwner[tradeRequests[_requestId].otherTokenId] = msg.sender;
        // Supprimer la demande d'échange
        delete tradeRequests[_requestId];
        // Emettre un événement pour informer les utilisateurs que l'échange est terminé
        emit TradeExecuted(_requestId);
    }

    //TODO: Implementer une méthode 'cancelTrade' permettant d'annuler une demande d'échange
    function cancelTrade(uint _requestId) public {

    }

    //TODO: Implementer une méthode 'getTradesByUser' permettant de récupérer la liste des demandes d'échange d'un utilisateur
    function getTradesByUser() public {

    }

    //TODO: Implementer une méthode 'getTrade' permettant de récupérer les informations d'une demande d'échange
    function getTrade(uint _requestId) public {

    }
}
