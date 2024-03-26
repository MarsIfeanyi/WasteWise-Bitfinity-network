require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

const BITFINITY_PRIVATE_KEY = process.env.BITFINITY_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.24",
  networks: {
    bitfinity: {
      url: "https://testnet.bitfinity.network",
      accounts: [BITFINITY_PRIVATE_KEY],
      chainId: 355113,
    },
    local_bitfinity: {
      url: "http://127.0.0.1:8545",
      accounts: [`0x${BITFINITY_PRIVATE_KEY}`],
      chainId: 355113,
    },
  },
  etherscan: {
    apiKey: {
      bitfinity: "DSFMNB6IZ2FGYPZIJDEZ1ZV48T1RW2JYTR",
    },
    customChains: [
      {
        network: "bitfinity",
        chainId: 355113,
        urls: {
          apiURL: "https://explorer.bitfinity.network/api",
          browserURL: "https://explorer.bitfinity.network",
        },
      },
    ],
  },
  blockscout: {
    enabled: true,
  },
};
