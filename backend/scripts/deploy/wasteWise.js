require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const rwasteWiseAddress = "0x2d4dC4aDA01Bb17B1c705dd5a96E4a4CE9C9782C";
  const Admins = [
    "0x72C90da5748739D640DEbBf19280ca51856A0177",
    "0x2Af6B6fB6a6a6eb93Dc32151A5B7F403Be14fD88",
    "0x6F1b6ac175E2cf9436D7478E6d08E22C415eb474",
    "0xa5FFf172361008408da8AcFaF4a9f32012314cA9",
    "0xB5119738BB5Fe8BE39aB592539EaA66F03A77174",
  ];

  const provider = hre.ethers.provider;
  const deployerWallet = new hre.ethers.Wallet(
    process.env.BITFINITY_PRIVATE_KEY,
    provider
  );

  console.log("Deploying contracts with the account:", deployerWallet.address);

  const WasteWise = await hre.ethers.getContractFactory("WasteWise");
  const wasteWise = await WasteWise.connect(deployerWallet).deploy(
    rwasteWiseAddress,
    Admins
  );
  await wasteWise.waitForDeployment();

  console.log("wasteWise deployed to:", wasteWise.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
