require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

const BITFINITY_PRIVATE_KEY = process.env.BITFINITY_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.24",
  networks: {
    testnet_bitfinity: {
      url: "https://testnet.bitfinity.network",
      accounts: [`0x${BITFINITY_PRIVATE_KEY}`],
      chainId: 355113,
    },
    local_bitfinity: {
      url: "http://127.0.0.1:8545",
      accounts: [`0x${BITFINITY_PRIVATE_KEY}`],
      chainId: 355113,
    },
  },
};
