const { expect } = require('chai');
const { ethers } = require('hardhat');

const STAKEHOLDER_ADDRESS = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199';
const ALT_STAKEHOLDER_ADDRESS = '0xdd2fd4581271e230360230f9337d5c0430bf44c0';

describe('LarvaMfers', function () {
	it('Should set stakeholder address on deployment and update when changed', async function () {
		const LarvaMfers = await ethers.getContractFactory('LarvaMfers');
		const larvaMfers = await LarvaMfers.deploy(STAKEHOLDER_ADDRESS);
		await larvaMfers.deployed();

		expect(await larvaMfers.stakeholderAddress()).to.equal(STAKEHOLDER_ADDRESS);

		const setStakeholderTx = await larvaMfers.setStakeholderAddress(
			ALT_STAKEHOLDER_ADDRESS
		);

		// wait until the transaction is mined
		await setStakeholderTx.wait();

		expect(await larvaMfers.stakeholderAddress()).to.equal(
			ALT_STAKEHOLDER_ADDRESS
		);
	});
});
