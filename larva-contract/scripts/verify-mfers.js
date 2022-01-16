// TO RUN
// npx hardhat run scripts/verify-mfers.js

const hre = require('hardhat');

const { STAKEHOLDER_ADDRESS } = process.env;

// RESULT ADDRESS FROM MFERS DEPLOYMENT
const MFERS_CONTRACT_ADDY = '0xF94516Ec531a1a9B34de514342aE3Bc78B940aed';

async function main() {
	await hre.run('verify:verify', {
		address: MFERS_CONTRACT_ADDY,
		constructorArguments: [STAKEHOLDER_ADDRESS],
	});
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
