require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const rwasteWiseAddress = "0x34f66affd7c24faa4785e922d34ed992ee5c7802";
  const wasteWiseAddress = "0x1D40Ccf93331c4770f842da4E3e83FE8Ebce5c51";

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
