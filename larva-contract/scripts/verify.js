// TO RUN
// npx hardhat run scripts/verify.js

const hre = require("hardhat");

const CONTRACT_ADDRESS = "0xafe2C381C385cBBCBb570D8b39b36449BE6B35c4";

async function main() {
	if (!CONTRACT_ADDRESS) {
		throw new Error("Missing contract address for verification");
	}
	await hre.run("verify:verify", { address: CONTRACT_ADDRESS });
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
