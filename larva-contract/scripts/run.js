// TO RUN
// npm run run

const hre = require("hardhat");

async function main() {
	if (hre.network.name !== "hardhat") {
		console.warn("\nhardhat network not targeted!\nexiting process...\n\n");
		return;
	}

	// get deployer address
	const [deployer] = await ethers.getSigners();
	const deployerAddress = await deployer.getAddress();

	// deploy mfers
	console.log("deploying mfers...");
	const mfersFactory = await hre.ethers.getContractFactory("mfers");
	const mfersContract = await mfersFactory.deploy(deployerAddress);
	await mfersContract.deployed();
	console.log("mfers deployed: ", mfersContract.address);

	// deploy larva mfers
	console.log("\ndeploying larva mfers...");
	const larvaFactory = await hre.ethers.getContractFactory(
		"TESTNET_LarvaMfers"
	);
	const larvaContract = await larvaFactory.deploy(mfersContract.address);
	await larvaContract.deployed();
	console.log("larva mfers deployed: ", larvaContract.address);

	// test the result!
	const mfersAddyFromLarvas = await larvaContract.MFERS_ADDRESS();
	const MFERS_ADDRESSES_MATCH = mfersAddyFromLarvas === mfersContract.address;
	console.log("\ndoes the addresses match?\n", MFERS_ADDRESSES_MATCH, "\n");
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
