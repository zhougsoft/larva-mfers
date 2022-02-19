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
		}\ntotal mfer supply: ${mferMintResult.toString()}`
	);

	// deploy larva mfers
	console.log("\ndeploying larva mfers...");
	const larvaFactory = await hre.ethers.getContractFactory(
		"TESTNET_LarvaMfers"
	);
	const larvaContract = await larvaFactory.deploy(mfersContract.address);
	await larvaContract.deployed();
	console.log("larva mfers deployed: ", larvaContract.address);

	// TEST: WAS MFERS ADDRESS PROPERLY SET?
	const mfersAddyFromLarvas = await larvaContract.MFERS_ADDRESS();
	const MFERS_ADDRESSES_MATCH = mfersAddyFromLarvas === mfersContract.address;
	console.log("\ndo the mfer addresses match?\n", MFERS_ADDRESSES_MATCH, "\n");

	// set hiddenURI
	const newHiddenURI = "ipfs://new_hidden_uri";
	await larvaContract.setHiddenURI(newHiddenURI);

	// DID HIDDEN URI GET UPDATED?
	const resultNewHiddenURI = await larvaContract.hiddenURI();
	const HIDDEN_URI_UPDATED = newHiddenURI === resultNewHiddenURI;
	console.log("\ndid hidden uri get updated?\n", HIDDEN_URI_UPDATED, "\n");

	// set free mint to active

	// run free mint with testAddr1 (should be successful)

	// run free mint with testAddr2 (should be unsuccessful)

	// flip to paid mint

	// mint with testAddr2 with payable amount (should be successful)

	// TODO: test final overall supply (count it up and check assertion)
	// const resultLarvaSupply = await larvaContract.totalSupply();
	// const CORRECT_FINAL_TOTAL_SUPPLY = resultLarvaSupply.eq(???);
	// console.log("\ndid specials get minted?\n", CORRECT_FINAL_TOTAL_SUPPLY, "\n");
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
