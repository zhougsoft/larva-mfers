const { before } = require("mocha");
const { expect } = require("chai");

const LARVA_MFERS_CONTRACT = "TESTNET_LarvaMfers";

describe("LarvaMfers", () => {
	let owner,
		wallet1,
		wallet2,
		wallet3,
		wallet4,
		larvaMfers,
		mfersContract,
		larvaLadsContract;

	// Fetch signers, deploy placeholder mfers & larvalads, deploy larva mfers
	before(async () => {
		[owner, wallet1, wallet2, wallet3, wallet4] = await ethers.getSigners();

		console.info("\ndeploying contracts...");
		const larvaMfersFactory = await hre.ethers.getContractFactory(
			LARVA_MFERS_CONTRACT
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

		// TODO:
		// mint OG mfer with wallet1
		// mint larva lad with wallet2
		// mint OG mfer & larva lad with wallet3
		// (wallet4 will have neither required tokens)
	});

	//--- CONTRACT DEPLOYMENT & SETUP ---

	it("Should deploy with correct owner address", async () => {
		expect(await larvaMfers.owner()).to.equal(owner.address);
	});

	it("Should deploy with correct max supply", async () => {
		expect(await larvaMfers.MAX_SUPPLY()).to.equal(10000);
	});

	// Should set hidden URI
	// Should not allow token URI to be set
	// Should mint 1/1 tokens to owner - (mint 15 initial tokens in collection to contract deployooor)

	//--- THE MINT ---

	// *** token-gated pre-mint ***
	// Should activate free mint
	// Should mint free token for mfer holder - mint with wallet1
	// Should mint free token for Larva Lad holder - mint with wallet2
	// Should mint free token for mfer + Larva Lad holder - mint with wallet3
	// Should not mint free token for non-holder
	// Should batch mint max allowed tokens per-tx for free mint - mint with wallet3
	// Should not batch mint more tokens than free mint max per-tx
	// Should not mint zero or negative number on free mint input

	// *** public free mint ***
	// Should mint free token for non-holder after pre-mint supply threshold - mint with wallet4
	// Should not mint free token at free mint supply threshold









	// *** sale mint ***
	// Should activate sale mint
	// Should not mint if insufficient ETH sent
	// Should not mint if too much ETH sent
	// Should mint sale if correct amount of ETH sent
	// Should not batch mint more tokens than sale mint max per-tx
	// Should not mint zero or negative number on sale mint input
	// ...



});
