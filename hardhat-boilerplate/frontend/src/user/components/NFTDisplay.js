import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { ethers } from 'ethers';
import NFT_address from "../../contracts/contract-Hero-address.json";
import NFT_artifacts from "../../contracts/Hero.json";

const NFTDisplay = ({ contractAddress, tokenId, provider }) => {
  const [nftData, setNFTData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!contractAddress || !tokenId || !provider) {
          throw new Error('contractAddress, tokenId, or provider is undefined');
        }

        const contract = new ethers.Contract(NFT_address.Hero, NFT_artifacts.abi, provider);
        let tokenURI = await contract.tokenURI(tokenId);
        console.log('Token URI:', tokenURI);

        // Thêm `.json` vào cuối đường dẫn
        if (!tokenURI.endsWith('.json')) {
          tokenURI += '.json';
        }

        const response = await fetch(tokenURI, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`Fetch request failed with status: ${response.status}`);
        }

        const metadata = await response.json();
        setNFTData(metadata);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu NFT:', error);
      }
    };

    fetchData();
  }, [contractAddress, tokenId, provider]);

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <Card style={{ width: '18rem' }}>
      {nftData && (
        <>
          <Card.Img variant="top" src={nftData.image} />
          <Card.Body>
            <Card.Title>{nftData.name}</Card.Title>
            <Card.Text>{nftData.description}</Card.Text>
            <Button variant="primary" href={nftData.external_url} target="_blank" rel="noopener noreferrer">
              Xem NFT
            </Button>
          </Card.Body>
        </>
      )}
    </Card>
  );
};

export default NFTDisplay;
