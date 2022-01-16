// TO RUN
// npx hardhat run scripts/deploy-larva.js

const hre = require('hardhat');

const { STAKEHOLDER_ADDRESS } = process.env;

async function main() {
	const larvaFactory = await hre.ethers.getContractFactory('LarvaMfers');
	const larvaContract = await larvaFactory.deploy(STAKEHOLDER_ADDRESS);

	await larvaContract.deployed();

	console.log('larva mfers deployed to:', larvaContract.address);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
