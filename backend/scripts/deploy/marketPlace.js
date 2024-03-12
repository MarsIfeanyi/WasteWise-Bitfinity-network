require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const rwasteWiseAddress = "0x34F66AfFD7c24faa4785E922d34ED992Ee5C7802";
  const wasteWiseAddress = "0x7350BF58C593be884278B63361Fe2DF00AB45918";

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
