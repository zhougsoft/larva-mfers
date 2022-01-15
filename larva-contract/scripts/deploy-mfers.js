const hre = require('hardhat');


// TODO: add hardhat etherscan verification plugin

const STAKEHOLDER_ADDRESS = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199' // rando addy from hardhat

async function main() {
    
    // step one DEPLOY
    const mfersFactory = await hre.ethers.getContractFactory('mfers');
	const mfersContract = await mfersFactory.deploy(STAKEHOLDER_ADDRESS);

	await mfersContract.deployed();

	console.log('mfers deployed to:', mfersContract.address);
    
    // step two VERIFY

}



main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
