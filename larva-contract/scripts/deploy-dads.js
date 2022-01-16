// TO RUN
// npx hardhat run scripts/deploy-dads.js

const hre = require('hardhat');

const { STAKEHOLDER_ADDRESS } = process.env;

async function main() {
	const dadmfersFactory = await hre.ethers.getContractFactory('DadMfers');
	const dadmfersContract = await dadmfersFactory.deploy(STAKEHOLDER_ADDRESS);

	await dadmfersContract.deployed();

	console.log('dadmfers deployed to:', dadmfersContract.address);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
