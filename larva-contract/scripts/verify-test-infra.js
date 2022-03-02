// TO RUN
// npx hardhat run scripts/verify-larva.js

const hre = require("hardhat");

const DEPLOYER_ADDRESS = "0x2c1613Fc5170c072B9EDFdcA8f1C5c93C6bD6db2";

const MFERS_CONTRACT_ADDY = "0xE86aB3A011DfA4Ca046801ec6e1E4F9e3bB0267A";
// https://rinkeby.etherscan.io/address/0xE86aB3A011DfA4Ca046801ec6e1E4F9e3bB0267A

const LARVA_LADS_CONTRACT_ADDY = "0x78A653d75c6b8a14BE78493313F0D6Fe4dA741Dc";
// https://rinkeby.etherscan.io/address/0x78A653d75c6b8a14BE78493313F0D6Fe4dA741Dc


async function main() {
	if (!MFERS_CONTRACT_ADDY || !LARVA_LADS_CONTRACT_ADDY) {
		throw new Error("Missing required address(es)");
	}

	await hre.run("verify:verify", {
		address: MFERS_CONTRACT_ADDY,
		constructorArguments: [DEPLOYER_ADDRESS],
	});
	await hre.run("verify:verify", { address: LARVA_LADS_CONTRACT_ADDY });
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
