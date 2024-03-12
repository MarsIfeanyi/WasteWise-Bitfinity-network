require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const provider = hre.ethers.provider;
  const deployerWallet = new hre.ethers.Wallet(
    process.env.BITFINITY_PRIVATE_KEY,
    provider
  );

  console.log("Deploying contracts with the account:", deployerWallet.address);

  const rWasteWiseToken = await hre.ethers.getContractFactory("RwasteWise");
  const wasteWiseToken = await rWasteWiseToken.connect(deployerWallet).deploy({
    gasLimit: 3000000,
    gasPrice: 10,
  });
  await wasteWiseToken.waitForDeployment();

  console.log("wasteWise Receipt Token deployed to:", wasteWiseToken.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
