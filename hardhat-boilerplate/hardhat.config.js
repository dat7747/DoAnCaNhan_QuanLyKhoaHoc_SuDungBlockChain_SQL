
require('@nomicfoundation/hardhat-toolbox');
// Load environment variables from .env file
require('dotenv').config();
// Get API key and private key from environment variables
module.exports = {
  solidity: {
    compilers: [
        { version: "0.8.24" },
        { version: "0.8.0", settings: {} }, // Add this line.
        { version: "0.7.6", settings: {} }
    ],
},
  networks: {
    bsctest: {
      url: "https://data-seed-prebsc-2-s2.binance.org:8545",
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY
  },
};
