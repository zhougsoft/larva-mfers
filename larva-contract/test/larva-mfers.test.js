// ######################

// TODO:

// DOUBLE CHECK we are *CONNECTING* as the wallet we want to *TEST AS*
// GO THRU EVERY LINE TO MAKE SURE REVERTS ARE BEING TESTED AGAINST CORRECT WALLETS!!!!

// also...

// break test "sections" up by file?
// hardhat examples on best way to do this?
// 1 file for deployment/setup, 1 for free mint etc etc

// chai/waffle matcher docs:
// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html

// ######################

const { before } = require("mocha");
const { expect, assert } = require("chai");

const LARVA_MFERS_CONTRACT = "TESTNET_LarvaMfers"; // contract [this value] is ERC721 {}
const HOLDER_MINT_SUPPLY_LIMIT = 2500; // 2500 reserved for token-gated mint
const FREE_MINT_SUPPLY_LIMIT = 5000; // 2500 reserved free for public mint
const MAX_SUPPLY = 10000; // total available supply of all larva mfers at mint
const PROVENANCE =
	"293ffdd76ae6ea0e82867a541e51fa02d981804284940779a0a6d22f07fb04a6";
const ADDR_ZERO = ethers.constants.AddressZero;

describe("LarvaMfers", () => {
	let owner, // deployer wallet
		wallet1, // mfer holder
		wallet2, // larva lad holder
		wallet3, // mfer & larva lad holder
		wallet4, // free mint tester
		wallet5, // paid mint tester
		wallet6, // wallet contents tester
		withdrawer,
		larvaMfers,
		mfersContract,
		larvaLadsContract;

	//-------- PRE-TEST SETUP -------------------------------------------------
	before(async () => {
		// Fetch signers
		[owner, wallet1, wallet2, wallet3, wallet4, wallet5, withdrawer] =
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

	//-------- UTILS -------------------------------------------------
	const testFreeMintSuccess = async (wallet, amount) => {
		await expect(await larvaMfers.connect(wallet).freeMint(amount))
			.to.emit(larvaMfers, "Transfer")
			.withArgs(ADDR_ZERO, wallet.address, await larvaMfers.totalSupply());
	};

	const testFreeMintRevert = async (wallet, amount) => {
		await expect(larvaMfers.connect(wallet).freeMint(amount)).to.be.reverted;
	};

	const mintSupplyTo = async (limit, amtPerMint) => {
		const currentSupply = await larvaMfers.totalSupply();
		console.log(
			`\n⌛ minting supply to ${limit} in batches of ${amtPerMint}...`
		);
		let remainingToMint = limit - currentSupply;
		while (remainingToMint > 0) {
			if (remainingToMint < amtPerMint) {
				await larvaMfers.ownerMint(owner.address, remainingToMint);
				remainingToMint = 0;
			} else {
				await larvaMfers.ownerMint(owner.address, amtPerMint);
				remainingToMint -= amtPerMint;
			}
		}
		console.log("✔️ minting complete!\n");
	};

	//-------- CONTRACT DEPLOYMENT & SETUP -------------------------------------------------
	it("Should scaffold the test environment correctly", async () => {
		expect(await mfersContract.totalSupply()).to.equal(2);
		expect(await larvaLadsContract.totalSupply()).to.equal(2);
	});

	it("Should deploy with correct settings", async () => {
		expect(await larvaMfers.owner()).to.equal(owner.address);
		expect(await larvaMfers.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
		expect(await larvaMfers.HOLDER_MINT_SUPPLY_LIMIT()).to.equal(
			HOLDER_MINT_SUPPLY_LIMIT
		);
		expect(await larvaMfers.FREE_MINT_SUPPLY_LIMIT()).to.equal(
			FREE_MINT_SUPPLY_LIMIT
		);
		expect(await larvaMfers.FREE_MINT_SUPPLY_LIMIT()).to.equal(
			FREE_MINT_SUPPLY_LIMIT
		);
		expect(await larvaMfers.PROVENANCE()).to.equal(PROVENANCE);
	});

	it("Should have default values set", async () => {
		expect(await larvaMfers.totalSupply()).to.equal(0);
		expect(await larvaMfers.maxFreeMintPerTx()).to.not.equal(0);
		expect(await larvaMfers.maxPaidMintPerTx()).to.not.equal(0);
		expect(await larvaMfers.cost()).to.not.equal(0);
		expect(await larvaMfers.uriSuffix()).to.not.equal(null);
	});

	it("Should be deployed in the correct minting state", async () => {
		expect(await larvaMfers.collectionIsHidden()).to.equal(true);
		expect(await larvaMfers.freeMintIsActive()).to.equal(false);
		expect(await larvaMfers.paidMintIsActive()).to.equal(false);
	});

	it("Should handle URI admin", async () => {
		await expect(larvaMfers.setURIPrefix("ipfs://fail/")).to.be.reverted;
		await larvaMfers.setHiddenURI("ipfs://hidden/");
		expect(await larvaMfers.hiddenURI()).to.equal("ipfs://hidden/");
	});

	it("Should mint 1/1 tokens to owner via owner mint", async () => {
		expect(await larvaMfers.ownerMint(owner.address, 15))
			.to.emit(larvaMfers, "Transfer")
			.withArgs(ADDR_ZERO, owner.address, 15);
		expect(await larvaMfers.balanceOf(owner.address)).to.equal(15);
		expect(await larvaMfers.totalSupply()).to.equal(15);
	});

	//-------- TOKEN-GATED PRE-MINT -------------------------------------------------
	it("Should revert if free mint not active", async () => {
		await testFreeMintRevert(wallet1, 1);
	});

	it("Should activate free mint", async () => {
		await larvaMfers.setFreeMintIsActive(true);
		expect(await larvaMfers.freeMintIsActive()).to.equal(true);
	});

	it("Should not mint free token for non-holder", async () => {
		await testFreeMintRevert(wallet4, 1);
	});

	it("Should mint free token for mfer holder", async () => {
		await testFreeMintSuccess(wallet1, 1);
	});

	it("Should mint free token for Larva Lads holder", async () => {
		await testFreeMintSuccess(wallet2, 1);
	});

	it("Should mint free token for mfer + Larva Lads holder", async () => {
		await testFreeMintSuccess(wallet3, 1);
	});

	it("Should batch mint max free allowed tokens per-tx", async () => {
		await testFreeMintSuccess(wallet3, await larvaMfers.maxFreeMintPerTx());
	});

	it("Should revert free mint on invalid amount input", async () => {
		await testFreeMintRevert(
			wallet3,
			(await larvaMfers.maxFreeMintPerTx()) + 1
		);
		await testFreeMintRevert(wallet3, 0);
		await testFreeMintRevert(wallet3, -1);
	});

	//-------- PUBLIC FREE MINT -------------------------------------------------
	// it("Should mint supply to pre-mint supply limit", async () => {
	// 	await mintSupplyTo(HOLDER_MINT_SUPPLY_LIMIT, 500);
	// 	expect(await larvaMfers.totalSupply()).to.equal(HOLDER_MINT_SUPPLY_LIMIT);
	// });

	// it("Should remove token gate at pre-mint supply limit", async () => {
	// 	await testFreeMintSuccess(wallet4, 1);
	// });

	// it("Should pause and resume the free mint", async () => {
	// 	await larvaMfers.setFreeMintIsActive(false);
	// 	await testFreeMintRevert(wallet4, 1);
	// 	await larvaMfers.setFreeMintIsActive(true);
	// 	await testFreeMintSuccess(wallet4, 1);
	// });

	// it("Should set max free mint per-tx", async () => {
	// 	const newMaxMint = 2;
	// 	await larvaMfers.setMaxFreeMintPerTx(newMaxMint);
	// 	expect(await larvaMfers.maxFreeMintPerTx()).to.equal(newMaxMint);
	// 	await testFreeMintRevert(wallet4, newMaxMint + 1);
	// });

	// it("Should mint supply to free mint supply limit", async () => {
	// 	await mintSupplyTo(FREE_MINT_SUPPLY_LIMIT, 500);
	// 	expect(await larvaMfers.totalSupply()).to.equal(FREE_MINT_SUPPLY_LIMIT);
	// });

	// it("Should prevent free minting over the free mint supply limit", async () => {
	// 	await testFreeMintRevert(wallet4, 1);
	// });

	//-------- SALE MINT -------------------------------------------------
	it("Should revert if sale mint not active", async () => {
		await expect(
			larvaMfers.mint(1, { value: hre.ethers.utils.parseEther("0.0069") })
		).to.be.reverted;
	});

	it("Should activate sale mint", async () => {
		await larvaMfers.setPaidMintIsActive(true);
		expect(await larvaMfers.paidMintIsActive()).to.equal(true);
	});

	it("Should revert sale mint if invalid ETH sent", async () => {
		const cost = await larvaMfers.cost();
		const notEnoughETH = cost.sub(hre.ethers.utils.parseEther("0.001"));
		const tooMuchETH = cost.add(hre.ethers.utils.parseEther("0.001"));

		await expect(larvaMfers.connect(wallet5).mint(1, { value: notEnoughETH }))
			.to.be.reverted;
		await expect(larvaMfers.connect(wallet5).mint(1, { value: tooMuchETH })).to
			.be.reverted;
	});

	it("Should revert sale mint on invalid amount input", async () => {
		const cost = await larvaMfers.cost();
		const maxPaidMintPerTx = await larvaMfers.maxPaidMintPerTx();
		const maxMintTotalCost = cost.mul(maxPaidMintPerTx);

		// Minting over limit
		await expect(
			larvaMfers.connect(wallet5).mint(maxPaidMintPerTx + 1, {
				value: maxMintTotalCost.add(cost),
			})
		).to.be.reverted;

		// Minting zero
		await expect(
			larvaMfers.connect(wallet5).mint(0, {
				value: maxMintTotalCost.add(cost),
			})
		).to.be.reverted;

		// Minting negative number
		await expect(
			larvaMfers.connect(wallet5).mint(-1, {
				value: maxMintTotalCost.add(cost),
			})
		).to.be.reverted;
	});

	it("Should mint sale if correct amount of ETH sent", async () => {
		await expect(
			await larvaMfers
				.connect(wallet5)
				.mint(1, { value: hre.ethers.utils.parseEther("0.0069") })
		)
			.to.emit(larvaMfers, "Transfer")
			.withArgs(ADDR_ZERO, wallet5.address, await larvaMfers.totalSupply());
	});












	it("WIP - Should get correct array of tokens owned by address", async () => {
		// TODO:
		// using wallet6
		// mint a few, stash the minted IDs based on the transfer event
		// getTokensOwnedByAddress after mints are done (returns array of ids)
		// check the transfer event ids against the returned array
		assert(false, "Test not implemented");
	});

	it("WIP - Should set max paid mint per-tx", async () => {
		// setMaxPaidMintPerTx - mint to check
		assert(false, "Test not implemented");
	});

	it("WIP - Should set cost per-token", async () => {
		// setCost - mint to check
		assert(false, "Test not implemented");
	});

	it("WIP - Should be able to pause and resume the paid mint", async () => {
		// "mint pausing" paid mint scenario - should fail to mint
		// "mint resuming" paid mint scenario - should mint
		assert(false, "Test not implemented");
	});

	it("WIP - Should not mint more than max supply limit", async () => {
		// totalSupply vs. MAX_SUPPLY
		assert(false, "Test not implemented");
	});

	//-------- WITHDRAWAL -------------------------------------------------
	it("WIP - Should not withdraw to any non-withdraw address", async () => {
		// test a multiple wallets?
		assert(false, "Test not implemented");
	});

	it("WIP - Should update withdraw address", async () => {
		// setWithdrawAddress()
		assert(false, "Test not implemented");
	});

	it("WIP - Should withdraw contract balance to withdraw address", async () => {
		// withdraw()
		assert(false, "Test not implemented");
	});

	//-------- REVEAL -------------------------------------------------
	// it("Should...", async () => {
	// 	//...
	// });
	// WIP - no particular order...
	// preventing empty string input on reveal function?
	// preventing non-owner from revealing?
	// successful reveal collection & all the side effects?
	// prevent attempting to reveal again once it's already revealed

	//-------- ADMIN FUNCTIONS -------------------------------------------------
	// it("Should...", async () => {
	// 	//...
	// });
	// setURIPrefix - should work
	// setURISuffix - should work

	// ### then, as non-owner (group these into "admin permissions work" or smth):
	// it("Should...", async () => {
	// 	//...
	// });
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
