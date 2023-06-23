import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../abi/contractABI.js";
import Card from "../components/card/card";


const Profile = () => {


    const [metamaskPrompt, setMetamaskPrompt] = useState("Wallet Not Connected");
    const [account, setAccount] = useState();
    const [listings, setListings] = useState([]);

    const metamaskInstalled = !!window.ethereum;
    // const contractAddress = "0xEb629b80D277B3aD53d92E1E65660551caD82FD5";
    const contractAddress = "0xfe6991603D0A4B2C0d6D05DdB085Af3E170093FC";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());

    const getAccount = async () => {
        return window.ethereum.request({
          method: 'eth_requestAccounts'
        });
    }

    const connectWallet = async () => {
        if (metamaskInstalled) {
          const accounts = await getAccount();
          if (accounts.length > 0) {
            setMetamaskPrompt("Wallet Connected");
            setAccount(String(accounts[0]));
          }
        }
    };

    const getOwnerListings = async () => {
        try {
            let ownerListings = [];
            let id = await contract.itemId()

            if (id !== null){
              for (let i = 0; i < id; i++) {
                let listing = await contract.allListings(i);
                console.log(listing.owner);
                // console.log(account);
                if (listing.owner.toLowerCase() == account.toLowerCase()) {
                    ownerListings.push(listing);
                }
              }
              setListings(ownerListings);
            }
            // console.log(listings);
        }
        catch (err) {
            alert(err);
        }
    }
            
    React.useEffect(() => {
        connectWallet();
        if(account){
            getOwnerListings();
        }
    }, [account]);

    return (
        <>
            <h1>Your Listings</h1>

            {listings.map((listing) => (
                <Card itemId={parseInt(listing.itemId._hex)} pictureLink={listing.pictureLink} price={parseInt(listing.price._hex)} description={listing.description} sold={listing.sold} profile={true} account={account} owner={listing.owner} />
            ))}

        </>
    );
};

export default Profile;