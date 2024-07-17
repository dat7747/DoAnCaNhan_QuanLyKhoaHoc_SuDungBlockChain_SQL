import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { ethers } from 'ethers';
import NFT_artifacts from "../../contracts/Hero.json";
import Marketplace_address from "../../contracts/contract-HeroMarketplace-address.json";
import Marketplace_artifacts from "../../contracts/HeroMarketplace.json";

const NFTDisplay = ({ contractAddress, tokenId, provider }) => {
  const [nftData, setNFTData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isListed, setIsListed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!contractAddress || !tokenId || !provider) {
          throw new Error('contractAddress, tokenId, or provider is undefined');
        }

        const contract = new ethers.Contract(contractAddress, NFT_artifacts.abi, provider);
        const tokenUri = await contract.tokenURI(tokenId);
        console.log('Token URI:', tokenUri);

        const response = await fetch(tokenUri, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`Fetch request failed with status: ${response.status}`);
        }

        const metadata = await response.json();
        setNFTData(metadata);

        const marketplaceContract = new ethers.Contract(Marketplace_address.HeroMarketplace, Marketplace_artifacts.abi, provider);
        const listing = await marketplaceContract.getListedNft(tokenId);
        console.log('Listing:', listing);
        setIsListed(listing.isActive);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [contractAddress, tokenId, provider]);

  const listNft = async () => {
    try {
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, NFT_artifacts.abi, signer);
      const marketplaceContract = new ethers.Contract(Marketplace_address.HeroMarketplace, Marketplace_artifacts.abi, signer);

      const approvalTx = await nftContract.approve(Marketplace_address.HeroMarketplace, tokenId);
      await approvalTx.wait();

      const price = prompt("Enter the listing price in ETH:");
      if (!price || isNaN(price)) {
        alert("Invalid price entered. Please enter a valid number.");
        return;
      }

      const listTx = await marketplaceContract.listNft(tokenId, ethers.utils.parseEther(price));
      await listTx.wait();
      
      alert("NFT listed successfully!");
      setIsListed(true);
    } catch (error) {
      console.error('Error listing NFT:', error);
    }
  };

  const unlistNft = async () => {
    try {
      const signer = provider.getSigner();
      const marketplaceContract = new ethers.Contract(Marketplace_address.HeroMarketplace, Marketplace_artifacts.abi, signer);

      const unlistTx = await marketplaceContract.unlistNft(tokenId);
      await unlistTx.wait();
      
      alert("NFT unlisted successfully!");
      setIsListed(false);
    } catch (error) {
      console.error('Error unlisting NFT:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!nftData) {
    return <p>No data found for this NFT.</p>;
  }

  return (
    <div className="text-center p-4">
      <Card style={{ width: '18rem', margin: '0 auto' }}>
        {nftData && (
          <>
            <Card.Img variant="top" src={nftData.image} />
            <Card.Body>
              <Card.Title>{nftData.name}</Card.Title>
              <Card.Text>{nftData.description}</Card.Text>
              <Button variant="primary" href={nftData.external_url} target="_blank" rel="noopener noreferrer">
                View NFT
              </Button>
              <Button 
                variant="success" 
                onClick={listNft} 
                disabled={isListed} 
                style={{ marginLeft: '10px', flex: 1, margin: '0 5px' }}
              >
                List NFT
              </Button>
            </Card.Body>
          </>
        )}
      </Card>
    </div>
  );
};

export default NFTDisplay;
