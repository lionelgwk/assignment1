// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceOracle {

    function getPrice() public view returns (uint256){
        // You need to read the price off of a contract (by Chainlink Oracle)
        // You will need:
        // 1) Contract Address
        // 2) ABI

        // 1)
        // Find the Contract Address of ETH/USD (0x694AA1769357215DE4FAC081bf1f309aDC325306) (Sepolia)
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (, int256 price,,,) = priceFeed.latestRoundData();
        // ETH in terms of USD

        return uint256(price * 1e10); // 1**10 = 10000000000
    }

    function USD(uint256 usdAmount) public pure returns (uint256) {
        uint256 usdAmountInETH = usdAmount * 1e18;
        return usdAmountInETH;
    }

}
