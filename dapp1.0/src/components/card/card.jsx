import { useState } from "react";
import "./card.css";

export default function Card(props) {
  const [listing, setListing] = useState(props);
  // const [nft, setNft] = useState(props);
  // const [nftImage, setNftImage] = useState(() => {
  //   if (nft?.image) {
  //     return nft.image.includes("ipfs")
  //       ? `https://ipfs.io/ipfs/${nft.image.split("ipfs://")[1]}`
  //       : nft.image.split("\\")[0];
  //   }
  // });

  return (
    <section className="cardContainer">
      <p>{listing.title}</p>
      <p>Item ID: {listing.itemId}</p>
      <img src={listing.pictureLink} />
      <p>US${listing.price}</p>
      <p>{listing.description}</p>
      {listing.sold ? <p>Sold</p> : <p>Available</p>}
      {/* {listing[0]?.image ? <p>{listing[0].image}</p> : <h4>No NFT Image can be shown.</h4>} */}
      {!listing.sold  && !listing.profile && listing.account.toLowerCase() != listing.owner.toLowerCase() ? <button onClick={() => props.buyListing(listing.itemId)}>Buy Now</button> : <button disabled>Buy Now</button>}
    </section>
  );
}