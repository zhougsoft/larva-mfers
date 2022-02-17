// SPDX-License-Identifier: MIT

//  _,   _, __, _,_  _,   _, _ __, __, __,  _,
//  |   /_\ |_) | / /_\   |\/| |_  |_  |_) (_
//  | , | | | \ |/  | |   |  | |   |   | \ , )
//  ~~~ ~ ~ ~ ~ ~   ~ ~   ~  ~ ~   ~~~ ~ ~  ~

// author: zhoug.eth

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TESTNET_LarvaMfers is ERC721, ERC721Burnable, Ownable {
	using Strings for uint256;

	// ---------------------------------------------------------------------------------- STATE
	address public MFERS_ADDRESS;
	address public withdrawAddress;

	uint256 public constant MAX_SUPPLY = 10000;
	uint256 public constant MAX_FREE_SUPPLY = 2500;
	uint256 public totalSupply;
	uint256 public cost = 0.0069 ether;
	uint256 public maxMintPerTx = 20;

	string public constant PROVENANCE =
		"293ffdd76ae6ea0e82867a541e51fa02d981804284940779a0a6d22f07fb04a6";
	string internal uriPrefix;
	string public uriSuffix = ".json";
	string public hiddenURI =
		"HIDDEN: set this value as Owner with 'setHiddenURI()'";

	bool public collectionIsHidden = true;
	bool public freeMintIsActive = false;
	bool public paidMintIsActive = false;

	IERC721 internal mfersContract = IERC721(MFERS_ADDRESS);

	// ---------------------------------------------------------------------------------- the CONSTRUCTOOOR
	constructor(address _mfersAddress) ERC721("larva mfers", "LARMF") {
		withdrawAddress = msg.sender;
		MFERS_ADDRESS = _mfersAddress;
		_batchMint(msg.sender, 15);
	}

	// ---------------------------------------------------------------------------------- MODiFiERs
	modifier validateMintInput(uint256 _amountOfTokens, uint256 _maxSupply) {
		require(_amountOfTokens > 0, "Must mint at least one token");
		require(
			totalSupply + _amountOfTokens <= _maxSupply,
			"Supply limit reached"
		);
		_;
	}

	modifier capMaxMint(uint256 _amountOfTokens) {
		require(
			_amountOfTokens <= maxMintPerTx,
			"Transaction would exceed max mint amount"
		);
		_;
	}

	// ---------------------------------------------------------------------------------- ViEWs
	function tokenURI(uint256 tokenId)
		public
		view
		virtual
		override
		returns (string memory)
	{
		if (collectionIsHidden) {
			return hiddenURI;
		}

		require(bytes(uriPrefix).length > 0, "uriPrefix not set");
		require(_exists(tokenId), "Token does not exist");
		return string(abi.encodePacked(uriPrefix, tokenId.toString(), uriSuffix));
	}

	function getTokensOwnedByAddress(address _address)
		public
		view
		returns (uint256[] memory ownedTokenIds)
	{
		uint256 addressBalance = balanceOf(_address);
		uint256 tokenIdCounter = 1;
		uint256 ownedTokenCounter = 0;
		ownedTokenIds = new uint256[](addressBalance);

		while (ownedTokenCounter < addressBalance && tokenIdCounter <= MAX_SUPPLY) {
			address tokenOwnerAddress = ownerOf(tokenIdCounter);
			if (tokenOwnerAddress == _address) {
				ownedTokenIds[ownedTokenCounter] = tokenIdCounter;
				ownedTokenCounter++;
			}
			tokenIdCounter++;
		}
	}

	// ---------------------------------------------------------------------------------- MiNTz
	function _batchMint(address _recipient, uint256 _tokenAmount) internal {
		for (uint256 i = 1; i <= _tokenAmount; i++) {
			_safeMint(_recipient, totalSupply + i);
		}
		totalSupply += _tokenAmount;
	}

	// ~* free mint *~
	function freeMint(uint256 _amountOfTokens)
		public
		validateMintInput(_amountOfTokens, MAX_FREE_SUPPLY)
		capMaxMint(_amountOfTokens)
	{
		require(freeMintIsActive, "Free mint closed");
		require(
			mfersContract.balanceOf(msg.sender) > 0,
			"Free mint is for mfer holders only"
		);
		_batchMint(msg.sender, _amountOfTokens);
	}

	// ~* paid mint *~
	function mint(uint256 _amountOfTokens)
		public
		payable
		validateMintInput(_amountOfTokens, MAX_SUPPLY)
		capMaxMint(_amountOfTokens)
	{
		require(paidMintIsActive, "Token sale closed");
		require(
			msg.value == cost * _amountOfTokens,
			"Invalid payment amount sent: send exact value in the 'cost' property"
		);
		_batchMint(msg.sender, _amountOfTokens);
	}

	// ~* owner mint *~
	function ownerMint(address _recipient, uint256 _amountOfTokens)
		public
		validateMintInput(_amountOfTokens, MAX_FREE_SUPPLY)
		onlyOwner
	{
		_batchMint(_recipient, _amountOfTokens);
	}

	// ---------------------------------------------------------------------------------- OWNER FUNCTiONs
	function withdraw() public payable onlyOwner {
		(bool os, ) = payable(withdrawAddress).call{value: address(this).balance}(
			""
		);
		require(os);
	}

	function setWithdrawAddress(address _withdrawAddress) public onlyOwner {
		withdrawAddress = _withdrawAddress;
	}

	function setURIPrefix(string memory _uriPrefix) public onlyOwner {
		require(
			!collectionIsHidden,
			"Cannot set URI while collection is hidden - use 'reveal()' to initialize and expose the URI prefix"
		);
		uriPrefix = _uriPrefix;
	}

	function setURISuffix(string memory _uriSuffix) public onlyOwner {
		uriSuffix = _uriSuffix;
	}

	function setHiddenURI(string memory _hiddenURI) public onlyOwner {
		hiddenURI = _hiddenURI;
	}

	function setCost(uint256 _newCost) public onlyOwner {
		cost = _newCost;
	}

	function setMaxMintPerTx(uint256 _maxMintPerTx) public onlyOwner {
		maxMintPerTx = _maxMintPerTx;
	}

	function setFreeMintIsActive(bool _state) public onlyOwner {
		freeMintIsActive = _state;
	}

	function setPaidMintIsActive(bool _state) public onlyOwner {
		paidMintIsActive = _state;
	}

	function revealCollection(string memory _uriPrefix) public onlyOwner {
		require(
			!freeMintIsActive || !paidMintIsActive,
			"Cannot reveal collection while any type of minting is active"
		);
		collectionIsHidden = false;
		setURIPrefix(_uriPrefix);
	}
}
