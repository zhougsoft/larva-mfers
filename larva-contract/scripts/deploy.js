// TO RUN
// npx hardhat run scripts/deploy.js

const hre = require("hardhat");

const CONTRACT_NAME = "LarvaMfers";

// RINKEBY DEPLOY:
// https://rinkeby.etherscan.io/address/0x64E71C66505837Eb81f528bd71192c7c351f24E5#readContract

async function main() {
	const larvaMfersFactory = await hre.ethers.getContractFactory(CONTRACT_NAME);
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
