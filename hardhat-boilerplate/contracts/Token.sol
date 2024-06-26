// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("My Hardhat Token", "EDU") {
        _mint(msg.sender, 100000000000000000000000000000); // Mint 100 billion tokens to the contract deployer
    }
}
