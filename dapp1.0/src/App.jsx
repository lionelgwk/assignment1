import Navbar from './components/navbar/navbar';
import { useState, useEffect } from "react";
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
import "./styles.css";
import './App.css';
import { contractABI } from "./abi/contractABI.js";
import axios, { all } from "axios";
import Home from './pages/home';
import Profile from './pages/profile';
import { ethers } from "ethers";
import Card from './components/card/card';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />} />
      {/* Need to route the activity.id to the below path */}
      {/* <Route path={`/activitydetail/${activity.id}`} element={<ActivityDetail />} /> */}
    </Route>
  )
)

function App() {
  const metamaskInstalled = !!window.ethereum;
  // const contractAddress = "0xEb629b80D277B3aD53d92E1E65660551caD82FD5";
  const contractAddress = "0xabE153162Db65EC6cd23Ce5d2C1273935a881521";
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
    const price = await contract.getPrice();
    console.log(parseInt(price));
    if (amount != ""){
      const amountInETH = amount * 10 ** 36 / parseInt(price);
      setAmount(amountInETH);
      const tx = await contract.fundAccount({value: amountInETH, from: account});
      await tx.wait();
      const walletBalance = await getBalance(account);
      setBalance(ethers.utils.formatEther(walletBalance));
      setUserBalance(getUserBalance(account));
    }
    // const tx = await contract.methods.fundAccount({value: amount, from: account});
    // await tx.wait();
  }

  const buyListing = async (itemId) => {
    const tx = await contract.buyListing(itemId);
    await tx.wait();
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
    getAllListings();
    
  }, [metamaskInstalled, account]);
  




  return (
    <>
    <RouterProvider forceRefresh={true} router={router}/>


    {account ? null : <button onClick={connectWallet}>Connect Wallet</button>}

    <div id="walletBalance">
        {metamaskInstalled && account ? <p>Wallet Balance: {balance} ETH</p> : null}
    </div>

    <div id="userBalance">
        {metamaskInstalled && account ? <p>Account Balance: US${readableBalance(userBalance)}</p> : null}
    </div>
    
    <input type="text" id="amount" onChange={(e) => setAmount(parseInt(document.getElementById("amount").value))} />
    <button onClick={fundAccount}>Fund Account (USD)</button>
    {
    account ?
    <div className="dataContainer">
      {listings.map((listing) => {
        return (
          <Card itemId={parseInt(listing.itemId._hex)} pictureLink={listing.pictureLink} price={parseInt(listing.price._hex)} description={listing.description} sold={listing.sold} buyListing={buyListing} />
        )
      })}
    </div> : <p>Connect your wallet!</p>
    }






    </>
  )
}

export default App;
