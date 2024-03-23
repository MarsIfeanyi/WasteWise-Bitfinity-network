require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const rwasteWiseAddress = "0xbf95B535B55fbBB3ef4178553A8171B7491798E5";
  const wasteWiseAddress = "0xE7D4382f257639128324bED532B786D93e89b8e8";

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
