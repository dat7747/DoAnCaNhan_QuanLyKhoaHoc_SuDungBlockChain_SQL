import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { ethers } from 'ethers'; // Import ethers.js để tương tác với Ethereum
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

        // Kết nối tới contract NFT
        const contract = new ethers.Contract(NFT_address.Hero, NFT_artifacts.abi, provider);

        // Lấy thông tin metadata của NFT với tokenId tương ứng
        const tokenURI = await contract.tokenURI(tokenId);
        const response = await fetch(tokenURI);
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
