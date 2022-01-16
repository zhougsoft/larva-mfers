// TO RUN
// npx hardhat run scripts/verify-larva.js

const hre = require('hardhat');

const { STAKEHOLDER_ADDRESS } = process.env;

// RESULT ADDRESS FROM LARVA DEPLOYMENT
const LARVA_CONTRACT_ADDY = '0x834B98D120ee16d0077a149d687d44a28E07b645';

async function main() {
	await hre.run('verify:verify', {
		address: LARVA_CONTRACT_ADDY,
		constructorArguments: [STAKEHOLDER_ADDRESS],
	});
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
