require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const rwasteWiseAddress = "0x2d4dC4aDA01Bb17B1c705dd5a96E4a4CE9C9782C";
  const wasteWiseAddress = "0x989937083393431D653e8f2C0DF857FAb06bEAD0";

  const provider = hre.ethers.provider;
  const deployerWallet = new hre.ethers.Wallet(
    process.env.BITFINITY_PRIVATE_KEY,
    provider
  );

  console.log("Deploying contracts with the account:", deployerWallet.address);

  const MarketPlace = await hre.ethers.getContractFactory("MarketPlace");
  const marketPlace = await MarketPlace.connect(deployerWallet).deploy(
    rwasteWiseAddress,
    wasteWiseAddress
  );
  await marketPlace.waitForDeployment();

  console.log("wasteWise MarketPlace deployed to:", marketPlace.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
