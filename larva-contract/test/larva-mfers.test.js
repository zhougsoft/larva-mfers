const { before } = require("mocha");
const { expect } = require("chai");

describe("LarvaMfers", () => {
	let owner,
		wallet1,
		wallet2,
		wallet3,
		larvaMfers,
		mfersContract,
		larvaLadsContract;

	before(async () => {
		[owner, wallet1, wallet2, wallet3] = await ethers.getSigners();

		console.info("\ndeploying contracts...");
		const larvaMfersFactory = await hre.ethers.getContractFactory(
			"TESTNET_LarvaMfers"
		);
		const mfersFactory = await hre.ethers.getContractFactory("mfers");
		const larvaLadsFactory = await hre.ethers.getContractFactory("LarvaLads");

		mfersContract = await mfersFactory.deploy(owner.address);
		larvaLadsContract = await larvaLadsFactory.deploy();
		larvaMfers = await larvaMfersFactory.deploy(
			mfersContract.address,
			larvaLadsContract.address
		);
		console.info("contracts deployed!\n");
	});

	it("Should deploy with correct owner address", async () => {
		expect(await larvaMfers.owner()).to.equal(owner.address);
	});

	it("Should deploy with correct max supply", async () => {
		expect(await larvaMfers.MAX_SUPPLY()).to.equal(10000);
	});
});
