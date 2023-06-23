import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../abi/contractABI.js";


const CreateListing = () => {
    const [title, setTitle] = useState("");
    const [pictureLink, setPictureLink] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");

    const [metamaskPrompt, setMetamaskPrompt] = useState("Wallet Not Connected");
    const [account, setAccount] = useState();

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

    useEffect(() => {
        connectWallet();
    }, []);

    

    const createListing = async () => {
        try {
            const tx = await contract.createListing(pictureLink, price, description);
            await tx.wait();
            alert("Listing created!");
          }
          catch (err) {
            alert(err);
          }

    }


    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between'}} ><h1>Create a Listing</h1> <h1>{metamaskPrompt}</h1></div>

            Picture Link: <input type="text" id="pictureLink" onChange={(e) => setPictureLink(document.getElementById("pictureLink").value)} />
            <br></br>
            Price (USD): <input type="number" id="price" onChange={(e) => setPrice(document.getElementById("price").value)} />
            <br></br>
            Description: <input type="text" id="description" onChange={(e) => setDescription(document.getElementById("description").value)} />
            <br></br>
            <button onClick={createListing}>Create Listing</button>

        </>
    );
};

export default CreateListing;