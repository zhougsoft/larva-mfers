// TO RUN
// npx hardhat run scripts/deploy-test-infra.js

const hre = require("hardhat");

async function main() {
	const [signer] = await hre.ethers.getSigners();
	console.log("\n----------\ndeploying mfers...");
	const mfersFactory = await hre.ethers.getContractFactory("mfers");
	const mfersContract = await mfersFactory.deploy(signer.address);
	await mfersContract.deployed();
	console.log("mfers deployed to: ", mfersContract.address, "\n");

	console.log("deploying Larva Lads...");
	const larvaLadsFactory = await hre.ethers.getContractFactory("LarvaLads");
	const larvaLadsContract = await larvaLadsFactory.deploy();
	await larvaLadsContract.deployed();
	console.log(
		"Larva Lads deployed to: ",
		larvaLadsContract.address,
		"\n--------\n"
	);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
