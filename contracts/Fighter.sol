// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Dojo.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Fighter is Dojo {

    using SafeMath for uint256;

    modifier onlyOwnerOf(uint _fighterId) {
        require(msg.sender == fighterToOwner[_fighterId]);
        _;
    }

    mapping(uint256 => address) public fighterApprovals;

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerFighterCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return fighterToOwner[_tokenId];
    }

    // Fonction de transfer internes qui emit un event ERC1155
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        ownerFighterCount[_to] = ownerFighterCount[_to].add(1);
        ownerFighterCount[msg.sender] = ownerFighterCount[msg.sender].sub(1);
        fighterToOwner[_tokenId] = _to;
        emit TransferSingle(msg.sender, _from, _to, _tokenId, 1);
    }

    // Fonction de transfer ERC1155
    function transfer(address _from, address _to, uint256 _tokenId, uint256 _amount, bytes memory _data) public {
        require(_to != address(0));
        require(_amount == 1);
        require(fighterToOwner[_tokenId] == _from);
        require(msg.sender == _from || fighterApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    // Fonction pour approuver un transfer
    function approve(address _approved, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        fighterApprovals[_tokenId] = _approved;
        emit ApprovalForAll(msg.sender, _approved, true);
    }

}