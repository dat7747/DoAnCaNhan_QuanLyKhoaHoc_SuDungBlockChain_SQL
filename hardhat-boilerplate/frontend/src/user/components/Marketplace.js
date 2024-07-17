import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { ethers } from 'ethers';
import Marketplace_address from "../../contracts/contract-HeroMarketplace-address.json";
import Marketplace_artifacts from "../../contracts/HeroMarketplace.json";
import NFT_address from "../../contracts/contract-Hero-address.json";
import NFT_artifacts from "../../contracts/Hero.json";
import '../../css/Marketplace.css';

const Marketplace = ({ provider }) => {
  const [listedNfts, setListedNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListedNfts = async () => {
    try {
      const marketplaceContract = new ethers.Contract(Marketplace_address.HeroMarketplace, Marketplace_artifacts.abi, provider);
      const nftContract = new ethers.Contract(NFT_address.Hero, NFT_artifacts.abi, provider);

      const nfts = await marketplaceContract.getListedNft();

      const formattedNfts = await Promise.all(nfts.map(async (nft) => {
        const tokenUri = await nftContract.tokenURI(nft.tokenId);
        const metadata = await fetch(tokenUri).then(res => res.json());

        return {
          tokenId: nft.tokenId.toString(),
          price: ethers.utils.formatUnits(nft.price, 'wei'), // Format price as wei string
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        };
      }));

      setListedNfts(formattedNfts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listed NFTs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListedNfts();
  }, [provider]);

  const buyNFT = async (tokenId, price) => {
    try {
      // Log to check the value and type of price
      console.log(`Buying NFT with tokenId: ${tokenId}, price: ${price}, type of price: ${typeof price}`);

      // Convert price to BigNumber
      const value = ethers.utils.parseUnits(price, 'wei'); // Note that `price` is already in wei

      // Log to check the value after conversion
      console.log(`Converted value: ${value.toString()}`);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(Marketplace_address.HeroMarketplace, Marketplace_artifacts.abi, signer);

      // Call buyNft function with tokenId and value
      const transaction = await contract.buyNft(tokenId, value);
      await transaction.wait();

      console.log('NFT bought successfully');
      fetchListedNfts();
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };

  const unlistNFT = async (tokenId) => {
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Marketplace_address.HeroMarketplace, Marketplace_artifacts.abi, signer);
      const transaction = await contract.unlistNft(tokenId);
      await transaction.wait();
      console.log('NFT unlisted successfully');
      fetchListedNfts();
    } catch (error) {
      console.error('Error unlisting NFT:', error);
    }
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <Container className="marketplace">
      <Row>
        {listedNfts.map((nft) => (
          <Col key={nft.tokenId} sm={6} md={4} lg={3}>
            <Card className="marketplace nft-card">
              <Card.Img variant="top" src={nft.image} />
              <Card.Body>
                <Card.Title className="marketplace nft-card-title">{nft.name}</Card.Title>
                <Card.Text className="marketplace nft-card-text">{nft.description}</Card.Text>
                <Card.Text className="marketplace nft-card-text">Price: {ethers.utils.formatEther(nft.price)} ETH</Card.Text>
                <div className="marketplace button-group">
                  <Button 
                    variant="primary" 
                    onClick={() => buyNFT(nft.tokenId, nft.price)}
                  >
                    Buy
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => unlistNFT(nft.tokenId)}
                  >
                    Unlist
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Marketplace;
