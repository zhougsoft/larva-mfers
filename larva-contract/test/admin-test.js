const { expect } = require('chai');
const getDeployed = require('./utils/deploy.js')

describe('LarvaMfers', () => {
	it('Should update stakeholder address', async () => {
		// const LarvaMfers = await ethers.getContractFactory('LarvaMfers');
		// const larvaMfers = await LarvaMfers.deploy();
		// await larvaMfers.deployed();

		const larvaMfers = await getDeployed()

		const ALT_STAKEHOLDER_ADDRESS =
			'0xdd2fd4581271e230360230f9337d5c0430bf44c0';

		const setStakeholderTx = await larvaMfers.setStakeholderAddress(
			ALT_STAKEHOLDER_ADDRESS
		);

		const larvaMfersStakeholderAddress = await larvaMfers.stakeholderAddress();

		// wait until the transaction is mined
		await setStakeholderTx.wait();
		expect(larvaMfersStakeholderAddress.toLowerCase()).to.equal(
			ALT_STAKEHOLDER_ADDRESS.toLowerCase()
		);
	});
});
