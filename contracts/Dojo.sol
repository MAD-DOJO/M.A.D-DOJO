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
    event NewGold(uint amount, string name);
    event FighterLevelUp(uint fighterId, uint bonus, uint stat);
    event FighterFightResult(uint fighterId, uint opponentId, string result);
    event FighterForSale(uint fighterId, uint price);
    event TradeProposed(uint requestId, uint fighterId, uint otherFighterId, address otherAddress);
    event TradeExecuted(uint requestId);

    modifier onlyOwnerOf(uint _fighterId) {
        require(msg.sender == fighterToOwner[_fighterId], "You are not the owner of this fighter");
        _;
    }

    modifier isAboveLevel(uint _fighterId, uint _level) {
        require(fighters[_fighterId].level >= _level, "Fighter is not high enough level");
        _;
    }

    modifier hasEnoughXP(uint _fighterId) {
        require(fighters[_fighterId].xp >= fighters[_fighterId].xpToNextLevel, "Fighter does not have enough XP");
        _;
    }

    modifier hasEnoughGold(uint _numberOfGold) {
        require(balanceOf(msg.sender, GOLD) >= _numberOfGold, "You do not have enough gold");
        _;
    }

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

    struct FighterSell {
        uint256 tokenId;
        address seller;
        uint256 price;
    }

    struct TradeRequest {
        uint tokenId;
        uint otherTokenId;
        address otherAddress;
        bool accepted;
    }

    mapping(uint256 => FighterSell) public fighterSellOffers;
    mapping (uint256 => TradeRequest) public tradeRequests;

    enum Rank {Beginner, Novice, Apprentice, Adept, Master, GrandMaster, Legendary}

    //TODO: Ajouter les images stockées sur IPFS pour les Fighters
    constructor() ERC1155("https://bafybeiajtvxmsvidnwxj5ezsurtphdgdy47uuki34ma3byi3vt42l4iaom.ipfs.nftstorage.link/{id}.json") {}

    uint256 public constant GOLD = 0;
    uint256 public constant FIGHTER = 1;

    uint256 public tradeCount;
    Fighter[] public fighters;
    FighterSell[] public sellOffers;

    mapping (uint256 => address) fighterToOwner;
    mapping(address => uint) ownerFighterCount;

    function _createFighter() internal {
        uint256 _id = fighters.length;
        string memory _name = string.concat("Fighter#", Strings.toString(_id));
        (uint _strength, uint _speed, uint _endurance) = _generateFighterStats();
        fighters.push(Fighter(_name, 1, 0, 6, 'https://bafkreifrm3g3ntvejidi2ka4j5gho6pofw2ggsw3oien2mgqtuazd7jgoa.ipfs.nftstorage.link', Rank.Beginner, _strength, _speed, _endurance, 0, 0, 0));
        _mint(msg.sender, FIGHTER, 1, "");
        fighterToOwner[_id] = msg.sender;
        ownerFighterCount[msg.sender]++;
        emit NewFighter(_id, _name);
    }

    function _generateFighterStats() internal view returns (uint256, uint256, uint256) {
        uint256 _seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, fighters.length)));
        uint256 _strength = (_seed % 5) + 1;
        uint256 _speed = ((_seed / 5) % 5) + 1;
        uint256 _endurance = ((_seed / 25) % 5) + 1;
        return (_strength, _speed, _endurance);
    }

    function createFighter() public {
        if (ownerFighterCount[msg.sender] == 0) {
            _createFighter();
        }else{
            revert("You already have a fighter, pay to create a new one");
        }
    }

    function payForGold() public payable {
        require(msg.value == 0.01 ether, "You must pay at least 0.01 ETH to get gold");
        _mint(msg.sender, GOLD, 10, "");
        emit NewGold(10, "Gold");
    }

    function payToCreateFighter() public hasEnoughGold(5) {
        _burn(msg.sender, GOLD, 5);
        _createFighter();
    }

    function payToHealFighter(uint256 _fighterId) public hasEnoughGold(2) onlyOwnerOf(_fighterId) {
        require(fighters[_fighterId].wounds == 3, "Your fighter is not wounded");
        _burn(msg.sender, GOLD, 2);
        fighters[_fighterId].wounds = 0;
    }

    function withdrawEther() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getGoldBalance(address _user) public view returns (uint256) {
        return balanceOf(_user, GOLD);
    }

    function getOwnerFighterCount(address _owner) public view returns (uint) {
        return ownerFighterCount[_owner];
    }

    function getFighterOwner(uint256 _id) public view returns (address) {
        return fighterToOwner[_id];
    }

    function getFighter(uint256 _id) public view returns (Fighter memory) {
        Fighter memory _fighter = fighters[_id];
        return _fighter;
    }

    function getFightersCount() public view returns (uint) {
        return fighters.length;
    }

    function getMyFighters() public view returns (Fighter[] memory) {
        Fighter[] memory _fighters = new Fighter[](ownerFighterCount[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i < fighters.length; i++) {
            if (fighterToOwner[i] == msg.sender) {
                _fighters[counter] = fighters[i];
                counter++;
            }
        }
        return _fighters;
    }

    function fight(uint256 _fighterId, uint256 _opponentId) public onlyOwnerOf(_fighterId) {
        require(fighterToOwner[_opponentId] != msg.sender, "You can't fight yourself");
        require(fighters[_fighterId].wounds < 3, "Your fighter is wounded, you need to heal him");
        require(fighters[_fighterId].level == fighters[_opponentId].level, "You can't fight a fighter with a different level");
        //uint256 _seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, fighters.length)));
        //uint256 _bonus = (_seed % 10) + 1;
        uint256 _fighterScore = getFighterScore(_fighterId);
        uint256 _opponentScore = getFighterScore(_opponentId);
        if (_fighterScore > _opponentScore || _fighterScore == _opponentScore) {
            fighters[_fighterId].xp++;
            emit FighterFightResult(_fighterId, _opponentId, 'Won');
        } else {
            fighters[_fighterId].wounds++;
            emit FighterFightResult(_fighterId ,_opponentId, 'Lost');
        }
    }

    function getFighterScore(uint256 _fighterId) public view returns (uint256) {
        return fighters[_fighterId].strength.add(fighters[_fighterId].speed).add(fighters[_fighterId].endurance);
    }

    function levelUp(uint256 _fighterId) public onlyOwnerOf(_fighterId) hasEnoughXP(_fighterId) hasEnoughGold(1) {
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

    function sellFighter(uint256 _fighterId, uint256 _price) public onlyOwnerOf(_fighterId) {
        require(ownerFighterCount[msg.sender] > 1, "You need to have more than 1 fighter");
        require(_price > 0, "Price must be greater than 0");
        fighterSellOffers[_fighterId] = FighterSell(_fighterId, msg.sender, _price);
        sellOffers.push(FighterSell(_fighterId, msg.sender, _price));
        emit FighterForSale(_fighterId, _price);
    }

    function buyFighter(uint256 _fighterId) public hasEnoughGold(fighterSellOffers[_fighterId].price) {
        require(fighterSellOffers[_fighterId].price > 0, "This fighter is not for sale");
        require(fighterSellOffers[_fighterId].seller != msg.sender, "You can't buy your own fighter");
        _safeTransferFrom(fighterSellOffers[_fighterId].seller, msg.sender, FIGHTER, 1, "");
        fighterToOwner[_fighterId] = msg.sender;
        _burn(msg.sender, GOLD, fighterSellOffers[_fighterId].price);
        delete fighterSellOffers[_fighterId];
    }

    function getSellOffers() public view returns (FighterSell[] memory) {
        return sellOffers;
    }

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

    function proposeTrade(uint256 _fighterId, uint256 _otherFighterId, address _otherAddress) public onlyOwnerOf(_fighterId) {
        uint _requestId = tradeCount;
        tradeRequests[_requestId] = TradeRequest(_fighterId, _otherFighterId, _otherAddress, false);
        tradeCount++;
        emit TradeProposed(_requestId, _fighterId, _otherFighterId, _otherAddress);
    }

    function acceptTrade(uint _requestId) public {
        require(msg.sender == tradeRequests[_requestId].otherAddress, "You are not the intended recipient of this trade");
        require(!tradeRequests[_requestId].accepted, "This trade has already been accepted");
        _safeTransferFrom(msg.sender, tradeRequests[_requestId].otherAddress, FIGHTER, tradeRequests[_requestId].tokenId, "");
        _safeTransferFrom(tradeRequests[_requestId].otherAddress, msg.sender, FIGHTER, tradeRequests[_requestId].otherTokenId, "");
        fighterToOwner[tradeRequests[_requestId].tokenId] = tradeRequests[_requestId].otherAddress;
        fighterToOwner[tradeRequests[_requestId].otherTokenId] = msg.sender;
        delete tradeRequests[_requestId];
        emit TradeExecuted(_requestId);
    }
}
