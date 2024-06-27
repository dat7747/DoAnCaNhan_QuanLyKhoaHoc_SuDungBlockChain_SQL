//=================================Deloy cho Token
// const path = require("path");

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying Token contract with the account:", await deployer.getAddress());

//   const Token = await ethers.getContractFactory("Token");
//   const token = await Token.deploy();
//   await token.deployed();

//   console.log("Token deployed to:", token.address);

//   saveFrontendFiles(token, "Token");
// }

// function saveFrontendFiles(contract, name) {
//   const fs = require("fs");
//   const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   fs.writeFileSync(
//     path.join(contractsDir, "contract-Token-address.json"),
//     JSON.stringify({ [name]: contract.address }, undefined, 2)
//   );

//   const ContractArtifact = artifacts.readArtifactSync(name);

//   fs.writeFileSync(
//     path.join(contractsDir, `${name}.json`),
//     JSON.stringify(ContractArtifact, null, 2)
//   );
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });



//=================================Deloy cho Vault
//   const path = require("path");

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying Vault contract with the account:", await deployer.getAddress());

//   const tokenAddress = "0x69858Fe488cbc1E6498BaC081Ea0Dd16Ee2cC6d5"; // Thay thế bằng địa chỉ Token contract sau khi triển khai
//   const Vault = await ethers.getContractFactory("Vault");
//   const vault = await Vault.deploy(tokenAddress);
//   await vault.deployed();

//   console.log("Vault deployed to:", vault.address);

//   saveFrontendFiles(vault, "Vault");
// }

// function saveFrontendFiles(contract, name) {
//   const fs = require("fs");
//   const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   fs.writeFileSync(
//     path.join(contractsDir, "contract-Vault-address.json"),
//     JSON.stringify({ [name]: contract.address }, undefined, 2)
//   );

//   const ContractArtifact = artifacts.readArtifactSync(name);

//   fs.writeFileSync(
//     path.join(contractsDir, `${name}.json`),
//     JSON.stringify(ContractArtifact, null, 2)
//   );
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });



//=================================Deloy cho CourseRegistertration
// const path = require("path");

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying CourseRegistration contract with the account:", await deployer.getAddress());

//   const tokenAddress = "0x69858Fe488cbc1E6498BaC081Ea0Dd16Ee2cC6d5"; // Thay thế bằng địa chỉ Token contract sau khi triển khai
//   const vaultAddress = "0x954c0D181CdBE8B6A3ECF78011B96adaaEd96dA1"; // Thay thế bằng địa chỉ Vault contract sau khi triển khai
//   const CourseRegistration = await ethers.getContractFactory("CourseRegistration");
//   const courseRegistration = await CourseRegistration.deploy(tokenAddress, vaultAddress);
//   await courseRegistration.deployed();

//   console.log("CourseRegistration deployed to:", courseRegistration.address);

//   saveFrontendFiles(courseRegistration, "CourseRegistration");
// }

// function saveFrontendFiles(contract, name) {
//   const fs = require("fs");
//   const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   fs.writeFileSync(
//     path.join(contractsDir, "contract-Course-address.json"),
//     JSON.stringify({ [name]: contract.address }, undefined, 2)
//   );

//   const ContractArtifact = artifacts.readArtifactSync(name);

//   fs.writeFileSync(
//     path.join(contractsDir, `${name}.json`),
//     JSON.stringify(ContractArtifact, null, 2)
//   );
// }



//===================================Deploy NFT_LTD==================
// const { ethers } = require("hardhat");
// const path = require("path");

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying Hero contract with the account:", await deployer.getAddress());

//   const Hero = await ethers.getContractFactory("Hero");
//   const hero = await Hero.deploy(); // Sửa đổi thành const hero = await Hero.deploy();
//   await hero.deployed();

//   console.log("Hero deployed to:", hero.address);

//   saveFrontendFiles(hero, "Hero");
// }

// function saveFrontendFiles(contract, name) {
//   const fs = require("fs");
//   const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   fs.writeFileSync(
//     path.join(contractsDir, `contract-${name}-address.json`),
//     JSON.stringify({ [name]: contract.address }, undefined, 2)
//   );

//   const ContractArtifact = artifacts.readArtifactSync(name);

//   fs.writeFileSync(
//     path.join(contractsDir, `${name}.json`),
//     JSON.stringify(ContractArtifact, null, 2)
//   );
// }


//================Deploy Market=====================
// const fs = require('fs');
// const path = require('path');
// const { ethers, artifacts } = require("hardhat");

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying contracts with the account:", await deployer.getAddress());

//   const HeroMarketplace = await ethers.getContractFactory("HeroMarketplace");
//   const heroMarketplace = await HeroMarketplace.deploy(
//     "0x69858Fe488cbc1E6498BaC081Ea0Dd16Ee2cC6d5", // Địa chỉ token ERC20
//     "0x39418cEA6Bb4139E8da8Bd69c17e2DC1e66486e8" // Địa chỉ NFT ERC721
//   );

//   await heroMarketplace.deployed();

//   console.log("HeroMarketplace deployed to:", heroMarketplace.address);

//   saveFrontendFiles(heroMarketplace, "HeroMarketplace");
// }

// function saveFrontendFiles(contract, name) {
//   const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir, { recursive: true });
//   }

//   fs.writeFileSync(
//     path.join(contractsDir, `contract-${name}-address.json`),
//     JSON.stringify({ [name]: contract.address }, undefined, 2)
//   );

//   const ContractArtifact = artifacts.readArtifactSync(name);

//   fs.writeFileSync(
//     path.join(contractsDir, `${name}.json`),
//     JSON.stringify(ContractArtifact, null, 2)
//   );
// }


//=====================Deploy Auction======================

const fs = require('fs');
const path = require('path');
const { ethers, artifacts } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", await deployer.getAddress());

  const Auction = await ethers.getContractFactory("Auction");
  const auction = await Auction.deploy(
    "0x69858Fe488cbc1E6498BaC081Ea0Dd16Ee2cC6d5", // Địa chỉ token ERC20
    "0x39418cEA6Bb4139E8da8Bd69c17e2DC1e66486e8" // Địa chỉ NFT ERC721
  );

  await auction.deployed();

  console.log("Auction deployed to:", auction.address);

  saveFrontendFiles(auction, "Auction");
}

function saveFrontendFiles(contract, name) {
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, `contract-${name}-address.json`),
    JSON.stringify({ [name]: contract.address }, undefined, 2)
  );

  const ContractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    path.join(contractsDir, `${name}.json`),
    JSON.stringify(ContractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
