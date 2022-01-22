// TO RUN
// npx hardhat run scripts/verify-larva.js

const hre = require('hardhat');

const { STAKEHOLDER_ADDRESS } = process.env;

// RESULT ADDRESS FROM LARVA DEPLOYMENT(S)
const LARVA_CONTRACT_ADDY = '0xCD1bbE719cE707342d4641b942a48E7f8de730bC';

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
