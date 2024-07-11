import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { ethers } from 'ethers';
import Marketplace_address from "../../contracts/contract-HeroMarketplace-address.json";
import Marketplace_artifacts from "../../contracts/HeroMarketplace.json";

const Marketplace = ({ provider }) => {
  const [listedNfts, setListedNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListedNfts = async () => {
      try {
        const contract = new ethers.Contract(Marketplace_address.HeroMarketplace, Marketplace_artifacts.abi, provider);
        const nfts = await contract.getListedNft();

        // Convert BigNumber to string
        const formattedNfts = nfts.map(nft => ({
          tokenId: nft.tokenId.toString(),
          price: ethers.utils.formatEther(nft.price)
        }));

        setListedNfts(formattedNfts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listed NFTs:', error);
        setLoading(false);
      }
    };

    fetchListedNfts();
  }, [provider]);

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="marketplace">
      <h2>Listed NFTs</h2>
      <div className="nft-grid">
        {listedNfts.map((nft) => (
          <Card key={nft.tokenId} style={{ width: '18rem', margin: '10px' }}>
            <Card.Body>
              <Card.Title>NFT ID: {nft.tokenId}</Card.Title>
              <Card.Text>Price: {nft.price} ETH</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
