const hre = require("hardhat");

const stakeholderAddress = '0xc99547f73B0Aa2C69E56849e8986137776D72474'

async function main() {

  const mfers = await hre.ethers.getContractFactory("mfers");
  const mfersContract = await mfers.deploy(stakeholderAddress);

  await mfersContract.deployed();

  console.log("mfers deployed to:", mfersContract.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
