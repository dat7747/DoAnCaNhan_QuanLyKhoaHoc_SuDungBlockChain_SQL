const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HeroMarketplace", function () {
  let HeroMarketplace, heroMarketplace, owner, addr1, addr2;
  let NFT, nft;
  let Token, token;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Triển khai hợp đồng NFT (giả lập)
    NFT = await ethers.getContractFactory("Hero");
    nft = await NFT.deploy();
    await nft.deployed();

    // Triển khai hợp đồng Token ERC20 (giả lập)
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.deployed();

    // Triển khai hợp đồng HeroMarketplace
    HeroMarketplace = await ethers.getContractFactory("HeroMarketplace");
    heroMarketplace = await HeroMarketplace.deploy(token.address, nft.address);
    await heroMarketplace.deployed();
  });

  it("should set the correct owner", async function () {
    expect(await heroMarketplace.owner()).to.equal(owner.address);
  });

  it("should list an NFT", async function () {
    // Mint một NFT cho addr1
    await nft.connect(owner).mint(addr1.address, 1);
    expect(await nft.ownerOf(1)).to.equal(addr1.address);

    // Approve marketplace để chuyển NFT
    await nft.connect(addr1).approve(heroMarketplace.address, 1);

    // List NFT
    await heroMarketplace.connect(addr1).listNft(1, ethers.utils.parseUnits("1", "ether"));

    // Kiểm tra xem NFT đã được list chưa
    const listedNfts = await heroMarketplace.getListedNft();
    expect(listedNfts.length).to.equal(1);
    expect(listedNfts[0].author).to.equal(addr1.address);
    expect(listedNfts[0].price).to.equal(ethers.utils.parseUnits("1", "ether"));
    expect(listedNfts[0].tokenId).to.equal(1);
  });

  it("should allow buying a listed NFT", async function () {
    // Mint một NFT cho addr1
    await nft.connect(owner).mint(addr1.address, 1);
    expect(await nft.ownerOf(1)).to.equal(addr1.address);

    // Approve marketplace để chuyển NFT
    await nft.connect(addr1).approve(heroMarketplace.address, 1);

    // List NFT
    await heroMarketplace.connect(addr1).listNft(1, ethers.utils.parseUnits("1", "ether"));

    // Mint và approve token cho addr2 để mua NFT
    await token.connect(owner).transfer(addr2.address, ethers.utils.parseUnits("10", "ether"));
    await token.connect(addr2).approve(heroMarketplace.address, ethers.utils.parseUnits("1", "ether"));

    // Mua NFT
    await heroMarketplace.connect(addr2).buyNft(1, ethers.utils.parseUnits("1", "ether"));

    // Kiểm tra xem NFT đã được chuyển sang addr2 chưa
    expect(await nft.ownerOf(1)).to.equal(addr2.address);
  });

  it("should unlist an NFT", async function () {
    // Mint một NFT cho addr1
    await nft.connect(owner).mint(addr1.address, 1);
    expect(await nft.ownerOf(1)).to.equal(addr1.address);

    // Approve marketplace để chuyển NFT
    await nft.connect(addr1).approve(heroMarketplace.address, 1);

    // List NFT
    await heroMarketplace.connect(addr1).listNft(1, ethers.utils.parseUnits("1", "ether"));

    // Unlist NFT
    await heroMarketplace.connect(addr1).unlistNft(1);

    // Kiểm tra xem NFT đã được unlist chưa
    const listedNfts = await heroMarketplace.getListedNft();
    expect(listedNfts.length).to.equal(0);
  });
});
