// TO RUN
// npx hardhat run scripts/verify-larva-mfers.js

const hre = require("hardhat");

const LARVA_MFERS_CONTRACT_ADDY = "";

async function main() {
	if (!LARVA_MFERS_CONTRACT_ADDY) {
		throw new Error("Missing larva mfers contract address");
	}
	await hre.run("verify:verify", { address: LARVA_MFERS_CONTRACT_ADDY });
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
