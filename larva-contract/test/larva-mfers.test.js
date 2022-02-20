const { expect } = require("chai");

describe("LarvaMfers", () => {
	let larvaMfers, owner, addr1, addr2, addr3;

	beforeEach(async () => {
		const larvaFactory = await hre.ethers.getContractFactory("LarvaMfers");
		larvaMfers = await larvaFactory.deploy();
		[owner, addr1, addr2, addr3] = await ethers.getSigners();
	});

	it("Should deploy with correct owner address", async () => {
		expect(await larvaMfers.owner()).to.equal(owner.address);
	});

	it("Should deploy with correct max supply", async () => {
		expect(await larvaMfers.MAX_SUPPLY()).to.equal(10000);
	});
});
