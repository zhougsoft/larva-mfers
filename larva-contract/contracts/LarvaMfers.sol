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

contract LarvaMfers is ERC721, ERC721Burnable, Ownable {
	using Strings for uint256;

	address public withdrawAddress;

	uint256 public constant MAX_SUPPLY = 10000;
	uint256 public constant MAX_FREE_SUPPLY = 2500;
	uint256 public totalSupply;
	uint256 public cost = 0.0040 ether;
	uint256 public maxMintPerTx = 10;

	string internal uriPrefix;
	string public uriSuffix = ".json";
	string public hiddenURI = "HIDDEN";
	string public provenance;

	bool public collectionIsHidden = true;
	bool public freeMintIsActive = false;
	bool public paidMintIsActive = false;

	// ---------------------------------------------------------------------------------- CONSTRUCTOOOR
	constructor() ERC721("larva mfers", "LARMF") {
		withdrawAddress = msg.sender;
		_batchMint(msg.sender, 15);
	}

	// ---------------------------------------------------------------------------------- MODiFiERs
	modifier validMintInput(uint256 _amountOfTokens, uint256 _maxSupply) {
		require(_amountOfTokens > 0, "Must mint at least one token");
		require(
			totalSupply + _amountOfTokens <= _maxSupply,
			"Supply limit reached"
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

		require(_exists(tokenId), "Token does not exist");
		require(bytes(uriPrefix).length > 0, "uriPrefix not set");

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

	// ---------------------------------------------------------------------------------- MiNTiNG
	function _batchMint(address _recipient, uint256 _tokenAmount) private {
		for (uint256 i = 1; i <= _tokenAmount; i++) {
			_safeMint(_recipient, totalSupply + i);
		}
		totalSupply += _tokenAmount;
	}

	// ~* free mint *~
	function freeMint(uint256 _amountOfTokens)
		public
		validMintInput(_amountOfTokens, MAX_FREE_SUPPLY)
	{
		require(freeMintIsActive, "Free mint closed");
		require(
			_amountOfTokens <= maxMintPerTx,
			"Transaction would exceed max mint amount"
		);
		_batchMint(msg.sender, _amountOfTokens);
	}

	// ~* paid mint *~
	function mint(uint256 _amountOfTokens)
		public
		payable
		validMintInput(_amountOfTokens, MAX_SUPPLY)
	{
		require(paidMintIsActive, "Token sale closed");
		require(
			_amountOfTokens <= maxMintPerTx,
			"Transaction would exceed max mint amount"
		);
		require(msg.value >= cost * _amountOfTokens, "Insufficient ETH sent");
		_batchMint(msg.sender, _amountOfTokens);
	}

	// ~* admin mint *~
	function ownerMint(address _recipient, uint256 _amountOfTokens)
		public
		validMintInput(_amountOfTokens, MAX_FREE_SUPPLY)
		onlyOwner
	{
		_batchMint(_recipient, _amountOfTokens);
	}

	// ---------------------------------------------------------------------------------- ADMiN FUNCTiONs
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
		uriPrefix = _uriPrefix;
	}

	function setURISuffix(string memory _uriSuffix) public onlyOwner {
		uriSuffix = _uriSuffix;
	}

	function setHiddenURI(string memory _hiddenURI) public onlyOwner {
		hiddenURI = _hiddenURI;
	}

	function setProvenance(string memory _provenance) public onlyOwner {
		provenance = _provenance;
	}

	function setCost(uint256 _newCost) public onlyOwner {
		cost = _newCost;
	}

	function setMaxMintPerTx(uint256 _maxMintPerTx) public onlyOwner {
		maxMintPerTx = _maxMintPerTx;
	}

	function setCollectionIsHidden(bool _state) public onlyOwner {
		collectionIsHidden = _state;
	}

	function setFreeMintIsActive(bool _state) public onlyOwner {
		freeMintIsActive = _state;
	}

	function setPaidMintIsActive(bool _state) public onlyOwner {
		paidMintIsActive = _state;
	}
}
