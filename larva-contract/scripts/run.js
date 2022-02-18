// TO RUN
// npm run run

const hre = require("hardhat");

async function main() {
	if (hre.network.name !== "hardhat") {
		console.warn("\nhardhat network not targeted!\nexiting process...\n\n");
		return;
	}

	// get deployer address
	const [deployer, testAddr1, testAddr2] = await ethers.getSigners();
	const deployerAddress = await deployer.getAddress();

	// deploy mfers
	console.log("deploying mfers...");
	const mfersFactory = await hre.ethers.getContractFactory("mfers");
	const mfersContract = await mfersFactory.deploy(deployerAddress);
	await mfersContract.deployed();
	console.log("mfers deployed: ", mfersContract.address);

	// TODO:
	// testAddr1 mints an OG mfer, testAddr2 does not

	// deploy larva mfers
	console.log("\ndeploying larva mfers...");
	const larvaFactory = await hre.ethers.getContractFactory(
		"TESTNET_LarvaMfers"
	);
	const larvaContract = await larvaFactory.deploy(mfersContract.address);
	await larvaContract.deployed();
	console.log("larva mfers deployed: ", larvaContract.address);

	// WAS MFERS ADDRESS PROPERLY SET?
	const mfersAddyFromLarvas = await larvaContract.MFERS_ADDRESS();
	const MFERS_ADDRESSES_MATCH = mfersAddyFromLarvas === mfersContract.address;
	console.log("\ndoes the addresses match?\n", MFERS_ADDRESSES_MATCH, "\n");





	// TODO:
	// --- script & test each deploy & mint step
	

	// check if the 1/1s were minted (max supply == 15 ?)

	// set hiddenURI

	// set free mint to active

	// run free mint with testAddr1 (should be successful)

	// run free mint with testAddr2 (should be unsuccessful)

	// flip to paid mint

	// mint with testAddr2 with payable amount (should be successful)




	// then take the above script and...

	// LEANR TESTING GOOD:
	// https://youtu.be/0r7mgJTeoD0?t=466
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
