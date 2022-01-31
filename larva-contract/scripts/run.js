// run this script with 'npm run run'
// 										...lol

const fs = require("fs");
const hre = require("hardhat");

const TEST_ADDRESS = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

const deployLarvaMfers = async () => {
	console.log("deploying contract...");
	const larvaFactory = await hre.ethers.getContractFactory("LarvaMfers");
	const larvaMfersContract = await larvaFactory.deploy();
	await larvaMfersContract.deployed();
	console.log(
		"deployed! contract address: ",
		larvaMfersContract.address,
		"\nfrom: ",
		larvaMfersContract.deployTransaction.from
	);

	return larvaMfersContract;
};

async function main() {
	const larvaMfersContract = await deployLarvaMfers();

	console.log(
		!!larvaMfersContract
			? "contract interface is available!"
			: "contract interface unavailable :("
	);

	const ownerAddress = larvaMfersContract.deployTransaction.from;

	// SET HIDDEN URI
	console.log("setting hidden URI");
	await larvaMfersContract.setHiddenURI("ipfs://hidden/");
	console.log("hidden URI set!");

	// SET URI PREFIX
	console.log("setting URI prefix");
	await larvaMfersContract.setURIPrefix("ipfs://production/");
	console.log("URI prefix set!");


	// TOKEN URI OUTPUT - SHOULD BE HIDDEN URI
	console.log("fetching a hidden tokenURI...");
	const hiddenData = await larvaMfersContract.tokenURI(1);
	console.log("tokenURI", hiddenData);
	
	// REVEAL COLLECTION
	console.log("revealing collection...");
	await larvaMfersContract.setCollectionIsHidden(false);
	console.log("collection revealed!");

	// TOKEN URI OUTPUT - SHOULD BE PRODUCTION URI
	console.log("fetching a revealed tokenURI...");
	const prodData = await larvaMfersContract.tokenURI(1);
	console.log("tokenURI", prodData);

	// AIRDROP MINT TO TEST ADDRESS
	// console.log('airdrop minting to test address...');
	// await larvaMfersContract.ownerMint(TEST_ADDRESS, 15);
	// console.log('mint complete!');
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
