import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../abi/contractABI.js";
import Card from "../components/card/card";

const Home = () => {

    const metamaskInstalled = !!window.ethereum;
  // const contractAddress = "0xEb629b80D277B3aD53d92E1E65660551caD82FD5";
  const contractAddress = "0xfe6991603D0A4B2C0d6D05DdB085Af3E170093FC";
  const [account, setAccount] = useState();
  const [amount, setAmount] = useState();
  const [balance, setBalance] = useState();
  const [userBalance, setUserBalance] = useState();
  const [userBalanceInETH, setUserBalanceInETH] = useState();
  const [listings, setListings] = useState([]);
  const [metamaskPrompt, setMetamaskPrompt] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());

  const connectWallet = async () => {
    if (metamaskInstalled) {
      const accounts = await getAccount();
      if (accounts.length > 0) {
        setMetamaskPrompt("Wallet Connected");
        setAccount(String(accounts[0]));
        const walletBalance = await getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(walletBalance));
      }
    }
    getAllListings();
  };

  const getAllListings = async () => {
    let allListings = [];
    let id = await contract.itemId()
    
    console.log(id);
    // const itemId = await contract.itemId.call();
    if (id !== null){
      for (let i = 0; i < id; i++) {
        let listing = await contract.allListings(i);
        allListings.push(listing);
      }
      console.log(allListings);
      setListings(allListings);
    }
    
  }

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

  const fundAccount = async (event) => {
    if (amount.includes(".")) {
      alert("Please enter a whole number");
    }
    else{
      setAmount(parseInt(amount));
      const price = await contract.getPrice();
      console.log(parseInt(price));
      if (amount != ""){
        const amountInETH = amount * 10 ** 36 / parseInt(price);
        setAmount(amountInETH);
        try{
          const tx = await contract.fundAccount({value: amountInETH, from: account});
          await tx.wait();
          const walletBalance = await getBalance(account);
          setBalance(ethers.utils.formatEther(walletBalance));
          setUserBalance(getUserBalance(account));
        }
        catch (err) {
          alert(err);
        }

      }
    }
    // const tx = await contract.methods.fundAccount({value: amount, from: account});
    // await tx.wait();
  }

  const buyListing = async (itemId) => {
    try {
      const tx = await contract.buyListing(itemId);
      await tx.wait();
    }
    catch (err) {
      alert(err);
    }
  }

  const readableBalance = (balance) => {
    return (balance / 10 ** 18).toFixed(2);
  }

  useEffect(() => {
    if(metamaskInstalled) {
      const accounts = getAccount();
      if (account) {
        setMetamaskPrompt("Connected");
        getUserBalance(account);
      }
      else {
        setMetamaskPrompt("Connect Wallet");
      }
    }
    else {
      setMetamaskPrompt("Install Metamask");
    }
    connectWallet();
    getAllListings();
    
  }, [metamaskInstalled, account]);




    return (
        <>


            {account ? null : <button onClick={connectWallet}>Connect Wallet</button>}

            <div id="walletBalance">
                {metamaskInstalled && account ? <p>Wallet Balance: {balance} ETH</p> : null}
            </div>

            <div id="userBalance">
                {metamaskInstalled && account ? <p>Account Balance: US${readableBalance(userBalance)}</p> : null}
            </div>
            
            <input type="number" id="amount" step="1" onChange={(e) => setAmount(document.getElementById("amount").value)} />
            <button onClick={fundAccount}>Fund Account (USD)</button>
            {
            account ?
            <div className="dataContainer">
            {listings.map((listing) => {
                return (
                <Card itemId={parseInt(listing.itemId._hex)} pictureLink={listing.pictureLink} price={parseInt(listing.price._hex)} description={listing.description} sold={listing.sold} buyListing={buyListing} profile={false} account={account} owner={listing.owner}/>
                )
            })}
            </div> : <p>Connect your wallet!</p>
            }
        </>
    );
};

export default Home;