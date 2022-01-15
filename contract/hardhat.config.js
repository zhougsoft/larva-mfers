
const { task } = require('hardhat/config');
require('@nomiclabs/hardhat-waffle');

require('dotenv').config()

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

const hardhatConfig = {
	solidity: '0.8.10',
	paths: {
		artifacts: './artifacts',
	},
	// networks: {
	// 	hardhat: {
	// 		chainId: 1337,
	// 	},
	// 	rinkeby: {
	// 		url: process.env.INFURA_RINKEBY_URL,
	// 		accounts: [`0x${process.env.PRIVATE_KEY}`],
	// 	},
	// },
};

module.exports = hardhatConfig;
