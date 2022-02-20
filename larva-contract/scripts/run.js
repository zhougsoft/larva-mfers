// TO RUN
// npm run run
const hre = require("hardhat");

async function main() {
	if (hre.network.name !== "hardhat") {
		console.warn("\nhardhat network not targeted!\nexiting process...\n\n");
		return;
	}

	// get test addresses
	const [owner, signerOne, signerTwo, signerThree] =
		await hre.ethers.getSigners();

	// deploy mfers
	console.log("deploying mfers...");
	const mfersFactory = await hre.ethers.getContractFactory("mfers");
	const mfersContract = await mfersFactory.deploy(owner.address);
	await mfersContract.deployed();
	console.log("mfers deployed: ", mfersContract.address);

	// deploy larva lads
	console.log("deploying larva lads...");
	const larvaLadsFactory = await hre.ethers.getContractFactory("LarvaLads");
	const larvaLadsContract = await larvaLadsFactory.deploy();
	await larvaLadsContract.deployed();
	console.log("larva lads deployed: ", larvaLadsContract.address);

	// signerOne mints an OG mfer
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

	// signerTwo mints a larva lad
	const larvaLadsPrice = hre.ethers.utils.parseEther("0.05");
	await larvaLadsContract
		.connect(signerTwo)
		.mintForSelf(1, { value: larvaLadsPrice });
	const larvaLadsMintResult = await larvaLadsContract.totalSupply();
	console.log(
		`larva lad minted for address ${
			signerTwo.address
		}\ntotal larva lad supply: ${larvaLadsMintResult.toString()}`
	);

	// deploy larva mfers
	console.log("\ndeploying larva mfers...");
	const larvaMfersFactory = await hre.ethers.getContractFactory(
		"TESTNET_LarvaMfers"
	);
	const larvaMfersContract = await larvaMfersFactory.deploy(
		mfersContract.address,
		larvaLadsContract.address
	);
	await larvaMfersContract.deployed();
	console.log("larva mfers deployed: ", larvaMfersContract.address);

	const mfersAddyFromState = await larvaMfersContract.MFERS_ADDRESS();
	const larvaLadsAddyFromState = await larvaMfersContract.MFERS_ADDRESS();
	const MFERS_ADDRESSES_MATCH = mfersAddyFromState === mfersContract.address; // TEST: WAS MFERS ADDRESS PROPERLY SET?
	const LARVA_LADS_ADDRESSES_MATCH =
		larvaLadsAddyFromState === mfersContract.address; // TEST: WAS MFERS ADDRESS PROPERLY SET?
	console.log("\ndoes the mfer address match?\n", MFERS_ADDRESSES_MATCH, "\n");
	console.log(
		"\ndoes the larva lads address match?\n",
		LARVA_LADS_ADDRESSES_MATCH,
		"\n"
	);

	// set hiddenURI
	const newHiddenURI = "ipfs://new_hidden_uri";
	await larvaMfersContract.setHiddenURI(newHiddenURI);

	const resultNewHiddenURI = await larvaMfersContract.hiddenURI();
	const HIDDEN_URI_UPDATED = newHiddenURI === resultNewHiddenURI; // TEST: DID HIDDEN URI GET UPDATED?
	console.log("\ndid hidden uri get updated?\n", HIDDEN_URI_UPDATED, "\n");

	// set free mint to active
	await larvaMfersContract.setFreeMintIsActive(true);

	const FREE_MINT_ACTIVATED = await larvaMfersContract.freeMintIsActive(); // TEST: WAS FREE MINT ACTIVATED?
	console.log("\nwas free mint activated?\n", FREE_MINT_ACTIVATED, "\n");

	// run free mint with signerOne (should be successful since they hold a mfer)
	await larvaMfersContract.connect(signerOne).freeMint(1);
	const resultMferMint = await larvaMfersContract.balanceOf(signerOne.address);
	const MFER_MINT_WAS_SUCCESS = resultMferMint.eq(1); // TEST: WAS FREE MFER HOLDER MINT SUCCESSFUL?
	console.log(
		"\nwas free mint successful for mfer holder?\n",
		MFER_MINT_WAS_SUCCESS,
		"\n"
	);

	// run free mint with signerTwo (should be successful since they hold a larva lad)
	await larvaMfersContract.connect(signerTwo).freeMint(1);
	const resultLarvaLadMint = await larvaMfersContract.balanceOf(
		signerOne.address
	);
	const LARVA_LAD_MINT_WAS_SUCCESS = resultLarvaLadMint.eq(1); // TEST: WAS FREE LARVA LAD HOLDER MINT SUCCESSFUL?
	console.log(
		"\nwas free mint successful for larva lad holder?\n",
		LARVA_LAD_MINT_WAS_SUCCESS,
		"\n"
	);

	// run free mint with signerThree (should fail since they hold none of the required tokens)
	await larvaMfersContract
		.connect(signerThree)
		.freeMint(1)
		.catch(error => {
			// TODO: swap this for the expect-a-revert kinda thing
			console.log("\nnon-token holder blocked from minting successfully!\n");
		});


	// flip to paid mint

	

	// mint with testAddr3 with payable amount (should be successful)



	// TODO: test final overall supply (count it up and check assertion)
	// const resultLarvaSupply = await larvaMfersContract.totalSupply();
	// const CORRECT_FINAL_TOTAL_SUPPLY = resultLarvaSupply.eq(???);
	// console.log("\ndid specials get minted?\n", CORRECT_FINAL_TOTAL_SUPPLY, "\n");
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
