const { expect } = require('chai');
const { ethers } = require('ethers');

const getDeployed = require('./utils/deploy.js');

describe('LarvaMfers', () => {
	it('Should deploy with proper max supply set', async () => {
		const larvaMfers = await getDeployed();
		console.info('MAX_SUPPLY', larvaMfers.MAX_SUPPLY);

		const result = larvaMfers.MAX_SUPPLY()


		expect(larvaMfers.MAX_SUPPLY()).to.equal(10000);
	});
});
