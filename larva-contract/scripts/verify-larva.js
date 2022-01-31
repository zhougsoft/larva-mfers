// TO RUN
// npx hardhat run scripts/verify-larva.js

const hre = require("hardhat");

// address of deployed contract requiring verification
const LARVA_CONTRACT_ADDY = "";

async function main() {
	await hre.run("verify:verify", { address: LARVA_CONTRACT_ADDY });
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
