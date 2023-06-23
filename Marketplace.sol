// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceOracle.sol";

contract Marketplace {
    using PriceOracle for uint;
    uint32 public itemId = 0;

    struct Listing {
        uint itemId;
        string pictureLink;
        uint price;
        string description;
        address owner;
        bool sold;
    }

    address contractOwner;

    constructor() {
        contractOwner = msg.sender;
    }

    // Listing[] public allListings;
    mapping(address => uint) public accountBalance;
    mapping(address => uint) public accountBalanceInETH;
    mapping(uint => Listing) public allListings;
    mapping(uint => address) public itemToOwner;
    mapping(address => Listing[]) public ownerToItems;

    modifier ownerOf(uint _itemId) {
        require(msg.sender == allListings[_itemId].owner, "You are not the owner!");  
        _;
    }

    modifier contractOwnerOnly() {
        require(msg.sender == contractOwner, "You are not the owner of the contract!");  
        _;
    }

    function getPrice() public view returns (uint256){
        return PriceOracle.getPrice();
    }

    function fundAccount() public payable {
        accountBalance[msg.sender] += (msg.value * PriceOracle.getPrice()) / 1e18 ;
        accountBalanceInETH[msg.sender] += msg.value;
    }

    function seeListing(uint _itemId) public view returns (Listing memory) {
        return allListings[_itemId];
    }

    function createListing(string memory _pictureLink, uint _price, string memory _description) external {
        address _owner = msg.sender;
        Listing memory newListing = Listing(itemId, _pictureLink,  _price, _description, _owner, false);
        // Add to large list of listings
        allListings[itemId] = newListing;
        // Tag the item to an owner, so the owner can be found by the itemId
        itemToOwner[itemId] = _owner;
        // Tag the item to an owner, so all items under the owner can be found by the address of the owner
        ownerToItems[itemToOwner[itemId]].push(allListings[itemId]);
        itemId++;
    }

    function editListing(uint _itemId, string memory _pictureLink, uint _price, string memory _description) external ownerOf(_itemId){
        Listing storage listingToBeEdited = allListings[_itemId];
        listingToBeEdited.pictureLink = _pictureLink;
        listingToBeEdited.price = _price;
        listingToBeEdited.description = _description;
    }

    function buyListing(uint _itemId) external {
        Listing storage listingToBeBought = allListings[_itemId];
        address receiver = listingToBeBought.owner;
        address payer = msg.sender;
        uint minPriceInUSD = listingToBeBought.price;
        uint USDInBase18 = minPriceInUSD.USD();
        require(accountBalance[payer] >= USDInBase18, "Not enough balance!");
        accountBalance[payer] -= USDInBase18;
        accountBalance[receiver] += USDInBase18;
        accountBalanceInETH[payer] -= USDInBase18 * 1e18 / PriceOracle.getPrice();
        accountBalanceInETH[receiver] += USDInBase18 * 1e18 / PriceOracle.getPrice();
        allListings[_itemId].sold = true;
        allListings[_itemId].owner = payer;
    }

    // function helperForBuyListing (Listing[] memory _array, uint _itemId) public pure {
    //     for (uint i=0; i < _array.length; i++){
    //         Listing memory myListing = _array[i];
    //         if (myListing.itemId == _itemId){
    //             myListing.sold = true;
    //         }
    //     }
    // }

    function withdrawAll() public contractOwnerOnly {
        require(msg.sender == contractOwner);
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Withdrawal via call failed.");
    }

    function userWithdraw(uint _usdAmount) public {
        uint usdAmount18 = _usdAmount * 1e18;
        uint usdAmountInETH = usdAmount18 * 1e18 / PriceOracle.getPrice();
        require(usdAmountInETH <= accountBalanceInETH[msg.sender], "Insufficient Balance.");
        payable(msg.sender).transfer(usdAmountInETH);
        accountBalance[msg.sender] -= usdAmount18;
        accountBalanceInETH[msg.sender] -= usdAmountInETH;
    }
}

// library PriceOracle {

//     function getPrice() public view returns (uint256){
//         // You need to read the price off of a contract (by Chainlink Oracle)
//         // You will need:
//         // 1) Contract Address
//         // 2) ABI

//         // 1)
//         // Find the Contract Address of ETH/USD (0x694AA1769357215DE4FAC081bf1f309aDC325306) (Sepolia)
//         AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
//         (, int256 price,,,) = priceFeed.latestRoundData();
//         // ETH in terms of USD

//         return uint256(price * 1e10); // 1**10 = 10000000000
//     }

//     function USD(uint256 usdAmount) public pure returns (uint256) {
//         uint256 usdAmountInETH = usdAmount * 1e18;
//         return usdAmountInETH;
//     }

// }

