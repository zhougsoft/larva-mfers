require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || null;
const PRIVATE_KEY_RINKEBY = process.env.PRIVATE_KEY_RINKEBY || null;
const PRIVATE_KEY_MAINNET = process.env.PRIVATE_KEY_MAINNET || null;
const RINKEBY_NODE_URL = process.env.RINKEBY_NODE_URL || null;
const MAINNET_NODE_URL = process.env.MAINNET_NODE_URL || null;

let config = {
	solidity: {
		version: "0.8.9",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	paths: {
		artifacts: "./artifacts",
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
	},
	defaultNetwork: "hardhat",
};

if (ETHERSCAN_API_KEY) {
	config = {
		...config,
		etherscan: {
			apiKey: ETHERSCAN_API_KEY,
		},
	};
}

if (PRIVATE_KEY_RINKEBY && RINKEBY_NODE_URL) {
	config = {
		...config,
		networks: {
			...config.networks,
			mumbai: {
				url: RINKEBY_NODE_URL,
				accounts: [`0x${PRIVATE_KEY_RINKEBY}`],
			},
		},
	};
}

if (PRIVATE_KEY_MAINNET && MAINNET_NODE_URL) {
	config = {
		...config,
		networks: {
			...config.networks,
			matic: {
				url: MAINNET_NODE_URL,
				accounts: [`0x${PRIVATE_KEY_MAINNET}`],
			},
		},
	};
}

module.exports = { ...config };
