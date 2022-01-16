// TO RUN
// npx hardhat run scripts/deploy-mfers.js

const hre = require('hardhat');

const { STAKEHOLDER_ADDRESS } = process.env;

async function main() {
	const mfersFactory = await hre.ethers.getContractFactory('mfers');
	const mfersContract = await mfersFactory.deploy(STAKEHOLDER_ADDRESS);

	await mfersContract.deployed();

	console.log('mfers deployed to:', mfersContract.address);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
