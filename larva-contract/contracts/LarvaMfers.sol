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

	address public stakeholderAddress;

	string private baseURI;
	string public hiddenURI;
	string public metadataFileExtension = ".json";
	string public provenance;

	uint256 public constant MAX_SUPPLY = 10000;
	uint256 public constant MAX_FREE_SUPPLY = 2500;
	uint256 public totalSupply;
	uint256 public cost = 0.0030 ether;
	uint256 public maxMintAmount = 10;

	bool public collectionHidden = true;
	bool public freeMintIsActive = false;
	bool public saleIsActive = false;

	// ---------------------------------------------------------------------------------- CONSTRUCTOOOR
	constructor() ERC721("larva mfers", "LARMF") {
		stakeholderAddress = msg.sender;
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
	function _baseURI() internal view virtual override returns (string memory) {
		return baseURI;
	}

	function tokenURI(uint256 tokenId)
		public
		view
		virtual
		override
		returns (string memory)
	{
		if (collectionHidden) {
			return hiddenURI;
		}

		require(_exists(tokenId), "Token does not exist");
		string memory currentBaseURI = _baseURI();
		return
			bytes(currentBaseURI).length > 0
				? string(
					abi.encodePacked(
						currentBaseURI,
						tokenId.toString(),
						metadataFileExtension
					)
				)
				: "";
	}

	function getTokensByAddress(address _address)
		public
		view
		returns (uint256[] memory ownedTokenIds)
	{
		uint256 addressBalance = balanceOf(_address);
		uint256 currentTokenId = 1;
		uint256 ownedTokenIndex = 0;
		ownedTokenIds = new uint256[](addressBalance);

		while (ownedTokenIndex < addressBalance && currentTokenId <= MAX_SUPPLY) {
			address tokenOwnerAddress = ownerOf(currentTokenId);
			if (tokenOwnerAddress == _address) {
				ownedTokenIds[ownedTokenIndex] = currentTokenId;
				ownedTokenIndex++;
			}
			currentTokenId++;
		}

		return ownedTokenIds;
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
			_amountOfTokens <= maxMintAmount,
			"Transaction would exceed max mint amount"
		);
		_batchMint(msg.sender, _amountOfTokens);
	}

	// ~* payable mint *~
	function mint(uint256 _amountOfTokens)
		public
		payable
		validMintInput(_amountOfTokens, MAX_SUPPLY)
	{
		require(saleIsActive, "Token sale closed");
		require(
			_amountOfTokens <= maxMintAmount,
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
	function setProvenance(string memory _provenance) public onlyOwner {
		provenance = _provenance;
	}

	function setHiddenURI(string memory _hiddenURI) public onlyOwner {
		hiddenURI = _hiddenURI;
	}

	function setBaseURI(string memory _newBaseURI) public onlyOwner {
		baseURI = _newBaseURI;
	}

	function setFreeMintIsActive(bool _state) public onlyOwner {
		freeMintIsActive = _state;
	}

	function setSaleIsActive(bool _state) public onlyOwner {
		saleIsActive = _state;
	}

	function revealCollection() public onlyOwner {
		collectionHidden = false;
	}

	function setCost(uint256 _newCost) public onlyOwner {
		cost = _newCost;
	}

	function setMaxMintAmount(uint256 _newMaxMintAmount) public onlyOwner {
		maxMintAmount = _newMaxMintAmount;
	}

	function setMetadataFileExtension(string memory _newMetadataFileExtension)
		public
		onlyOwner
	{
		metadataFileExtension = _newMetadataFileExtension;
	}

	function setStakeholderAddress(address _newStakeholderAddress)
		public
		onlyOwner
	{
		stakeholderAddress = _newStakeholderAddress;
	}

	function withdraw() public payable onlyOwner {
		(bool os, ) = payable(stakeholderAddress).call{
			value: address(this).balance
		}("");
		require(os);
	}
}
