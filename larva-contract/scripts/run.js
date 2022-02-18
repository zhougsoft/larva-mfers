// TO RUN
// npm run run
const hre = require("hardhat");

async function main() {
	if (hre.network.name !== "hardhat") {
		console.warn("\nhardhat network not targeted!\nexiting process...\n\n");
		return;
	}

	// get test addresses
	const [owner, signerOne, signerTwo] = await hre.ethers.getSigners();

	// deploy mfers
	console.log("deploying mfers...");
	const mfersFactory = await hre.ethers.getContractFactory("mfers");
	const mfersContract = await mfersFactory.deploy(owner.address);
	await mfersContract.deployed();
	console.log("mfers deployed: ", mfersContract.address);

	// signerOne mints an OG mfer, signerTwo does not
	console.log("\nminting mfer...");
	await mfersContract.setSaleState(true);
	const mferPrice = hre.ethers.utils.parseEther("0.069");
	await mfersContract.connect(signerOne).mint(1, { value: mferPrice });
	const mferMintResult = await mfersContract.totalSupply();
	console.log(
		`mfer minted for address ${
			signerOne.address
		}!\ntotal mfer supply: ${mferMintResult.toString()}`
	);

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
	const larveTotalSupplyResult = await larvaContract.totalSupply();
	console.log(
		`\ntotal larva mfer supply: ${larveTotalSupplyResult.toString()}\n`
	);

	// set hiddenURI

	// set free mint to active

	// run free mint with testAddr1 (should be successful)

	// run free mint with testAddr2 (should be unsuccessful)

	// flip to paid mint

	// mint with testAddr2 with payable amount (should be successful)
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
