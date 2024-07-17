import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { ethers } from 'ethers';
import NFT_artifacts from "../../contracts/Hero.json";
import Marketplace_address from "../../contracts/contract-HeroMarketplace-address.json";
import Marketplace_artifacts from "../../contracts/HeroMarketplace.json";
import '../../css/NFTDisplay.css';

const NFTDisplay = ({ contractAddress, tokenId, provider }) => {
  const [nftData, setNFTData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isListed, setIsListed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!contractAddress || !tokenId || !provider) {
          throw new Error('contractAddress, tokenId, hoặc provider bị undefined');
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

      const price = prompt("Nhập giá niêm yết bằng ETH:");
      if (!price || isNaN(price)) {
        alert("Giá nhập vào không hợp lệ. Vui lòng nhập một số hợp lệ.");
        return;
      }

      const listTx = await marketplaceContract.listNft(tokenId, ethers.utils.parseEther(price));
      await listTx.wait();
      
      alert("NFT đã được niêm yết thành công!");
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
      
      alert("NFT đã được hủy niêm yết thành công!");
      setIsListed(false);
    } catch (error) {
      console.error('Error unlisting NFT:', error);
    }
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  if (!nftData) {
    return <p>Không tìm thấy dữ liệu cho NFT này.</p>;
  }

  return (
    <div className="nft-display text-center p-4">
      <Card className="nft-display card">
        {nftData && (
          <>
            <Card.Img variant="top" src={nftData.image} className="nft-display card-img-top" />
            <Card.Body>
              <Card.Title className="nft-display card-title">{nftData.name}</Card.Title>
              <Card.Text className="nft-display card-text">{nftData.description}</Card.Text>
              <div className="nft-display button-group">
                <Button variant="primary" href={nftData.external_url} target="_blank" rel="noopener noreferrer">
                  Xem NFT
                </Button>
                <Button 
                  variant="success" 
                  onClick={listNft} 
                  disabled={isListed}
                >
                  Niêm yết NFT
                </Button>
              </div>
            </Card.Body>
          </>
        )}
      </Card>
    </div>
  );
};

export default NFTDisplay;
