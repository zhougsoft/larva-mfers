require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

module.exports = {
	solidity: {
		version: '0.8.9',
		settings: {
			optimizer: {
				enabled: true,
				runs: 1000,
			},
		},
	},

	paths: {
		artifacts: './artifacts',
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
		rinkeby: {
			url: process.env.INFURA_RINKEBY_URL,
			accounts: [`0x${process.env.PRIVATE_KEY}`],
		},
		mumbai: {
			url: 'https://rpc-mumbai.maticvigil.com',
			accounts: [`0x${process.env.PRIVATE_KEY}`],
		},
	},
	etherscan: {
		apiKey: { rinkeby: process.env.ETHERSCAN_API_KEY },
	},
};
