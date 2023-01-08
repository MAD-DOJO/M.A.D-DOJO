// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Dojo.sol";

contract Fighter is Dojo {

    uint256 public totalSupply;
    mapping(uint256 => address) public fighterApprovals;
    event NewTokenFighter(uint256 tokenId, string name);

    constructor() {
        totalSupply = 0;
    }
}