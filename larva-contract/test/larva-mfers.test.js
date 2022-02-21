const { before } = require("mocha");
const { expect } = require("chai");

const LARVA_MFERS_CONTRACT = "TESTNET_LarvaMfers"; // contract [this value] is ERC721 {}
const HOLDER_MINT_SUPPLY_THRESHOLD = 2500; // 2500 reserved for token-gated mint
const FREE_MINT_SUPPLY_THRESHOLD = 5000; // 2500 reserved free for public mint
const MAX_SUPPLY = 10000; // total available supply of all larva mfers at mint

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

		// TODO:
		// mint OG mfer with wallet1
		// mint larva lad with wallet2
		// mint OG mfer & larva lad with wallet3
		// (wallet4 will have neither required tokens)

		console.info("setup complete!\n");
	});


	//--- CONTRACT DEPLOYMENT & SETUP ---

	it("Should deploy with correct owner address", async () => {
		expect(await larvaMfers.owner()).to.equal(owner.address);
	});


	it("Should deploy with correct max supply", async () => {
		expect(await larvaMfers.MAX_SUPPLY()).to.equal(10000);
	});
	// Should have a holder mint supply constant set
	// Should have a free mint supply constant set
	// Should have a provenance constant set
	
	
	// wrap all these in "IT SHOULD HAVE DEFAULT VALUES SET"
	// Should have a max free mint value after deployment
	// Should have a max mint value after deployment
	// Should have a default cost value
	// Should have a default URI suffix value after deployment
	
	// wrap all these in "IT SHOULD HAVE CORRECT MINT STATE"
	// Should have collection hidden by default
	// Should have inactive free mint by default
	// Should have inactive sale mint by default
	
	
	// Should not allow token URI to be set
	// Should set hidden URI
	// Should mint 1/1 tokens to owner via owner mint - (15 initial tokens in collection to contract deployooor)


	//--- THE MINT ---

	// *** token-gated pre-mint ***
	// Should not mint if free mint not active
	// Should activate free mint
	// Should mint free token for mfer holder - mint with wallet1
	// Should mint free token for Larva Lad holder - mint with wallet2
	// Should mint free token for mfer + Larva Lad holder - mint with wallet3
	// Should not mint free token for non-holder
	// Should batch mint max allowed tokens per-tx for free mint - mint with wallet3
	// Should not batch mint more tokens than free mint max-per-tx
	// Should not mint zero or negative number on free mint input

	// *** public free mint ***
	// Should mint free token for non-holder after pre-mint supply threshold - mint with wallet4
	// Should not mint free token at free mint supply threshold
	// TODO: setMaxFreeMintPerTx - mint to check
	// TODO: test "mint pausing" scenario - should fail to mint
	// TODO: test "mint resuming" scenario - should mint

	// *** sale mint ***
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


	//--- WITHDRAWAL ---
	// withdraw - should fail as non-withdraw address
	// setWithdrawAddress - should change address to withdrawer address
	// withdraw - should now work as withdraw address (check balances!)


	//--- REVEAL ---
	// WIP - no particular order...
	// preventing empty string input on reveal function?
	// preventing non-owner from revealing?
	// successful reveal collection & all the side effects?
	// prevent attempting to reveal again once it's already revealed



	//--- ADMIN FUNCTIONS ---
	// setURIPrefix - should work
	// setURISuffix - should work

	// ### then, as non-owner (group these into "admin permissions work" or smth):

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
