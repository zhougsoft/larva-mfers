// TO RUN
// npx hardhat run scripts/verify-dads.js

const hre = require('hardhat');

const { STAKEHOLDER_ADDRESS } = process.env;

// RESULT ADDRESS FROM DADMFERS DEPLOYMENT
const DADMFERS_CONTRACT_ADDY = '0x95F9c4301Ad181811a0575D0b015486E2c39aA71';

async function main() {
	await hre.run('verify:verify', {
		address: DADMFERS_CONTRACT_ADDY,
		constructorArguments: [STAKEHOLDER_ADDRESS],
	});
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
