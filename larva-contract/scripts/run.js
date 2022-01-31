// TO RUN
// npx hardhat run scripts/deploy-larva.js

const fs = require("fs");
const hre = require("hardhat");

const writeJson = data => {
	fs.writeFileSync(`${__dirname}/output.json`, JSON.stringify(data));
};

const deployLarvaContract = async () => {
	console.log("deploying contract...");
	const larvaFactory = await hre.ethers.getContractFactory("LarvaMfers");
	const larvaContract = await larvaFactory.deploy();
	await larvaContract.deployed();
	console.log(
		"deployed! contract address: ",
		larvaContract.address,
		"\nfrom: ",
		larvaContract.deployTransaction.from
	);

	return larvaContract;
};

async function main() {
	const larvaContract = await deployLarvaContract();

    console.log(!!larvaContract);

	// can get gas spend data from this object
	// console.log(larvaContract.deployTransaction);

	// TODO: script admin setup functions + mint
	// await larvaContract.ownerMint('', 5)
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
