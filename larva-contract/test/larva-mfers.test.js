const { before } = require("mocha");
const { expect } = require("chai");

const LARVA_MFERS_CONTRACT = "TESTNET_LarvaMfers"; // contract [this value] is ERC721 {}
const HOLDER_MINT_SUPPLY_THRESHOLD = 2500; // 2500 reserved for token-gated mint
const FREE_MINT_SUPPLY_THRESHOLD = 5000; // 2500 reserved free for public mint
const MAX_SUPPLY = 10000; // total available supply of all larva mfers at mint
const PROVENANCE =
	"293ffdd76ae6ea0e82867a541e51fa02d981804284940779a0a6d22f07fb04a6";

describe("LarvaMfers", () => {
	let owner,
		wallet1,
		wallet2,
		wallet3,
		wallet4,
		withdrawer,
		larvaMfers,
		mfersContract,
		larvaLadsContract;

	// Setup contract & signer infra before running tests
	before(async () => {
		// Fetch signers
		[owner, wallet1, wallet2, wallet3, wallet4, withdrawer] =
			await ethers.getSigners();

		// Deploy placeholder mfers & Larva Lads,
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

		// Seed wallets with all possible outcomes expected during mint
		console.info("seeding wallets...");

		const mferPrice = hre.ethers.utils.parseEther("0.069");
		const larvaLadsPrice = hre.ethers.utils.parseEther("0.05");

		// Mint mfer with wallet1
		await mfersContract.setSaleState(true);
		await mfersContract.connect(wallet1).mint(1, { value: mferPrice });

		// Mint Larva Lad with wallet 2
		await larvaLadsContract
			.connect(wallet2)
			.mintForSelf(1, { value: larvaLadsPrice });

		// Mint mfer & Larva Lad with wallet 3
		await mfersContract.connect(wallet3).mint(1, { value: mferPrice });
		await larvaLadsContract
			.connect(wallet3)
			.mintForSelf(1, { value: larvaLadsPrice });

		console.info("setup complete!\n");
	});

	//-------- TEST ENVIRONMENT -------------------------------------------------
	it("Should scaffold the test environment correctly", async () => {
		expect(await mfersContract.totalSupply()).to.equal(2);
		expect(await larvaLadsContract.totalSupply()).to.equal(2);
	});

	//-------- CONTRACT DEPLOYMENT & SETUP -------------------------------------------------
	it("Should deploy with correct settings", async () => {
		expect(await larvaMfers.owner()).to.equal(owner.address);
		expect(await larvaMfers.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
		expect(await larvaMfers.HOLDER_MINT_SUPPLY_THRESHOLD()).to.equal(
			HOLDER_MINT_SUPPLY_THRESHOLD
		);
		expect(await larvaMfers.FREE_MINT_SUPPLY_THRESHOLD()).to.equal(
			FREE_MINT_SUPPLY_THRESHOLD
		);
		expect(await larvaMfers.FREE_MINT_SUPPLY_THRESHOLD()).to.equal(
			FREE_MINT_SUPPLY_THRESHOLD
		);
		expect(await larvaMfers.PROVENANCE()).to.equal(PROVENANCE);
	});


	// TODO: make these tests pass
	it("Should have default values set", async () => {
		expect(await larvaMfers.totalSupply()).to.equal(1);
		expect(await larvaMfers.maxFreeMintPerTx()).to.not.equal(5);
		expect(await larvaMfers.maxMintPerTx()).to.not.equal(20);
		expect(await larvaMfers.cost()).to.not.equal(0.0069);
		expect(await larvaMfers.uriSuffix()).to.not.equal(".json");
	});

	it("Should be deployed in the correct minting state", async () => {
		// Should have collection hidden by default
		// Should have inactive free mint by default
		// Should have inactive sale mint by default
	});

	it("Should ", async () => {
		//...
	});

	// Should not allow token URI to be set
	// Should set hidden URI
	// Should mint 1/1 tokens to owner via owner mint - (15 initial tokens in collection to contract deployooor)

	//-------- THE MINT -------------------------------------------------

	// *** token-gated pre-mint ***
	it("Should ", async () => {
		//...
	});
	// Should not mint if free mint not active
	// Should activate free mint
	// Should mint free token for mfer holder - mint with wallet1
	// Should mint free token for Larva Lad holder - mint with wallet2
	// Should mint free token for mfer + Larva Lad holder - mint with wallet3
	// Should not mint free token for non-holder
	// Should batch mint max allowed tokens per-tx for free mint - mint with wallet3
	// Should not batch mint more tokens than free mint max-per-tx
	// Should not mint zero or negative number on free mint input



	// TODO: HOW TO CHECK IF MINT WENT THROUGH
	// .to.emit(larvaMfersContract, "Transfer")
	// .withArgs(ethers.constants.AddressZero, address, tokenId);



	// *** public free mint ***
	it("Should ", async () => {
		//...
	});
	// Should mint free token for non-holder after pre-mint supply threshold - mint with wallet4
	// Should not mint free token at free mint supply threshold
	// TODO: setMaxFreeMintPerTx - mint to check
	// TODO: test "mint pausing" scenario - should fail to mint
	// TODO: test "mint resuming" scenario - should mint

	// *** sale mint ***
	it("Should ", async () => {
		//...
	});
	// Should activate sale mint
	// Should not mint if insufficient ETH sent
	// Should not mint if too much ETH sent
	// Should mint sale if correct amount of ETH sent
	// Should not batch mint more tokens than sale mint max-per-tx
	// Should not mint zero or negative number on sale mint input
	// Should not mint more than max total supply
	// TODO: test getTokensOwnedByAddress after mints are done (returns array of ids)
	// TODO: setMaxMintPerTx - mint to check
	// TODO: setCost - mint to check
	// TODO: test "mint pausing" scenario - should fail to mint
	// TODO: test "mint resuming" scenario - should mint

	//-------- WITHDRAWAL -------------------------------------------------
	it("Should ", async () => {
		//...
	});
	// withdraw - should fail as non-withdraw address
	// setWithdrawAddress - should change address to withdrawer address
	// withdraw - should now work as withdraw address (check balances!)

	//-------- REVEAL -------------------------------------------------
	it("Should ", async () => {
		//...
	});
	// WIP - no particular order...
	// preventing empty string input on reveal function?
	// preventing non-owner from revealing?
	// successful reveal collection & all the side effects?
	// prevent attempting to reveal again once it's already revealed

	//-------- ADMIN FUNCTIONS -------------------------------------------------
	it("Should ", async () => {
		//...
	});
	// setURIPrefix - should work
	// setURISuffix - should work

	// ### then, as non-owner (group these into "admin permissions work" or smth):
	it("Should ", async () => {
		//...
	});
	// these should fail:
	// setURIPrefix
	// setURISuffix
	// setHiddenURI
	// setCost
	// setMaxFreeMintPerTx
	// setMaxMintPerTx
	// setFreeMintIsActive
	// setPaidMintIsActive
});
