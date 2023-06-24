import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../abi/contractABI.js";
import Card from "../components/card/card";


const Profile = () => {


    const [metamaskPrompt, setMetamaskPrompt] = useState("Wallet Not Connected");
    const [account, setAccount] = useState();
    const [listings, setListings] = useState([]);
    const [amount, setAmount] = useState();
    const [balance, setBalance] = useState();
    const [userBalance, setUserBalance] = useState();
    const [ethPrice, setEthPrice] = useState();

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

    const getBalance = async (address) => {
        return window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, "latest"]
          });
    };

    const getUserBalance = async (address) => {
        const value = await contract.accountBalance(address);
        console.log(value);
        setUserBalance(parseInt(value._hex));
    }

    const connectWallet = async () => {
        if (metamaskInstalled) {
          const accounts = await getAccount();
          if (accounts.length > 0) {
            setMetamaskPrompt("Wallet Connected");
            setAccount(String(accounts[0]));
            const walletBalance = await getBalance(accounts[0]);
            setBalance(ethers.utils.formatEther(walletBalance));
          }
          const price = await contract.getPrice();
          setEthPrice(price);
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

    const withdraw = async () => {
        if (amount.includes(".")) {
            alert("Please enter a whole number");
        }
        else{
            try {
                const withdraw = await contract.userWithdraw(amount);
                await withdraw.wait();
                getUserBalance(account);
                const walletBalance = await getBalance(account);
                setBalance(ethers.utils.formatEther(walletBalance));
                alert("Withdraw Successful");
            }
            catch (err) {
                alert(err);
            }
        }
        
    }

    const readableBalance = (balance) => {
        return (balance / 10 ** 18).toFixed(2);
    }
            
    React.useEffect(() => {
        connectWallet();
        if(account){
            getUserBalance(account);
            getOwnerListings();
        }
    }, [account]);

    return (
        <>
            <div>
                <div className="withdraw">
                    <h1>Withdraw Here</h1>
                    <p>Wallet Balance: {balance} ETH (≈{balance * ethPrice / 10 ** 18} USD)</p>
                    <p>Account Balance: US${readableBalance(userBalance)}</p>
                    <input type="number" id="amount" step="1" onChange={(e) => setAmount(document.getElementById("amount").value)} />
                    <button onClick={withdraw}>Withdraw (USD)</button>
                </div>
                <div>
                    <h1>Your Listings</h1>
                    <div className="myListings">
                    {listings.map((listing) => (
                        <Card itemId={parseInt(listing.itemId._hex)} pictureLink={listing.pictureLink} price={parseInt(listing.price._hex)} description={listing.description} sold={listing.sold} profile={true} account={account} owner={listing.owner} />
                    ))}
                    </div>
                </div>
            </div>

        </>
    );
};

export default Profile;