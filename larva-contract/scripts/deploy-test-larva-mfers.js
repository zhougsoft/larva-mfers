// TO RUN
// npx hardhat run scripts/deploy-test-larva-mfers.js

const hre = require("hardhat");

async function main() {
	const larvaMfersFactory = await hre.ethers.getContractFactory(
		"TESTNET_LarvaMfers"
	);
	const larvaMfersContract = await larvaMfersFactory.deploy();
	await larvaMfersContract.deployed();
	console.log("larva mfers deployed to: ", larvaMfersContract.address);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
