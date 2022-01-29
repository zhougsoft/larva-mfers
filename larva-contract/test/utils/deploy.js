const { ethers } = require('hardhat');

module.exports = async () => {
	const LarvaMfers = await ethers.getContractFactory('LarvaMfers');
	const larvaMfers = await LarvaMfers.deploy();
	await larvaMfers.deployed();
	return larvaMfers;
};
