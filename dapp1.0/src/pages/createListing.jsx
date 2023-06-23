import React from "react";
import { useState, useEffect } from "react";

const CreateListing = () => {
    const [title, setTitle] = useState("");
    const [pictureLink, setPictureLink] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");


    return (
        <>
            <h1>Create a Listing</h1>

            Title: <input type="text" id="title" onChange={(e) => setTitle(document.getElementById("title").value)} />
            <br></br>
            Picture Link: <input type="text" id="pictureLink" onChange={(e) => setPictureLink(document.getElementById("pictureLink").value)} />
            <br></br>
            Price (USD): <input type="number" id="price" onChange={(e) => setPrice(document.getElementById("price").value)} />
            <br></br>
            Description: <input type="text" id="description" onChange={(e) => setDescription(document.getElementById("description").value)} />
            <br></br>
            <button>Create Listing</button>

        </>
    );
};

export default CreateListing;