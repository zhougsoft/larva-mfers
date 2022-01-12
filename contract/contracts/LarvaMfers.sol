// SPDX-License-Identifier: MIT


//  _,   _, __, _,_  _,   _, _ __, __, __,  _,
//  |   /_\ |_) | / /_\   |\/| |_  |_  |_) (_ 
//  | , | | | \ |/  | |   |  | |   |   | \ , )
//  ~~~ ~ ~ ~ ~ ~   ~ ~   ~  ~ ~   ~~~ ~ ~  ~ 


// author: zhoug.eth <3
// jan 2022


pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


interface NFTContract {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function balanceOf(address owner) external view returns (uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
}


contract LarvaMfers is ERC721, Ownable {
    using Strings for uint256;
 
    string constant public PROVENANCE = "bf8e148055c890127bae5eb0820dcec3b1ce9790aeeb74967ece181d03af781e";
    string public metadataFileExtension = ".json";
    string public hiddenURI;
    string private baseURI;

    uint256 constant public MAX_SUPPLY = 6969;
    uint256 constant public MAX_VIP_SUPPLY = 2000;
    uint256 public totalSupply;
    uint256 public cost = 0.0030 ether;
    uint256 public maxMintAmount = 10;

    bool public collectionHidden = true;
    bool public vipMintIsActive = false;
    bool public saleIsActive = false;

    address public stakeholderAddress;

    // MAINNET
    // address constant public MFERS_ADDRESS = 0x79FCDEF22feeD20eDDacbB2587640e45491b757f;
    // address constant public DADMFERS_ADDRESS = 0x68CCdcf9d5CB0e61d72c0b31b654d6408A93C65a;

    // RINKEBY
    address constant public MFERS_ADDRESS = 0x84707c4e0e225a15B766c1dE36F90e96B40c561B;

    NFTContract mfersContract = NFTContract(MFERS_ADDRESS);


    // ---------------------------------------------------------------------------------- CONSTRUCTOOOR
    constructor(address _stakeholderAddress) ERC721("larva mfers", "LARMF") {
        stakeholderAddress = _stakeholderAddress;
        _batchMint(_stakeholderAddress, 15); // mint 1/1s
    }


    // ---------------------------------------------------------------------------------- MODiFiERs
    modifier validMintInput(uint256 _amountOfTokens, uint256 _maxSupply) {
        require(_amountOfTokens > 0, "Must mint at least one token");
        require(totalSupply + _amountOfTokens <= _maxSupply, "Supply limit reached");
        _;
    }


    // ---------------------------------------------------------------------------------- ViEWs
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (collectionHidden) {
           return hiddenURI;
        }

        require( _exists(tokenId), "Token does not exist");
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), metadataFileExtension))
            : "";
    }


    // ---------------------------------------------------------------------------------- MiNTs
    function _batchMint(address _recipient, uint256 _tokenAmount) private {
        for (uint256 i = 1; i <= _tokenAmount; i++) {
            _safeMint(_recipient, totalSupply + i);
        }
        totalSupply += _tokenAmount;
    }

    // ~* public sale mint *~
    function mint(uint256 _amountOfTokens) public payable validMintInput(_amountOfTokens, MAX_SUPPLY) {
        require(saleIsActive, "Token sale closed");
        require(_amountOfTokens <= maxMintAmount, "Transaction would exceed max mint amount");
        require(msg.value >= cost * _amountOfTokens, "Insufficient ETH sent");
        _batchMint(msg.sender, _amountOfTokens);
    }

    // ~* token-gated free mint *~
    function vipMint(uint256 _amountOfTokens) public validMintInput(_amountOfTokens, MAX_VIP_SUPPLY) {
        require(vipMintIsActive, "VIP mint closed");
        require(mfersContract.balanceOf(msg.sender) > 0, "Address not holding qualifying tokens");
        require(_amountOfTokens <= maxMintAmount, "Transaction would exceed max mint amount");
        _batchMint(msg.sender, _amountOfTokens);
    }

    // ~* admin-only mint that can run regardless of minting or sale state *~
    function ownerMint(address _recipient, uint256 _amountOfTokens) 
    public validMintInput(_amountOfTokens, MAX_VIP_SUPPLY) onlyOwner {
        _batchMint(_recipient, _amountOfTokens);
    }


    // ---------------------------------------------------------------------------------- ADMiN FUNCTiONs
    function setHiddenURI(string memory _hiddenURI) public onlyOwner {
        hiddenURI = _hiddenURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setVIPMintIsActive(bool _state) public onlyOwner {
        vipMintIsActive = _state;
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

    function setMaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    function setMetadataFileExtension(string memory _newMetadataFileExtension) public onlyOwner {
        metadataFileExtension = _newMetadataFileExtension;
    }

    function setStakeholderAddress(address _newStakeholderAddress) public onlyOwner {
        stakeholderAddress = _newStakeholderAddress;
    }

    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(stakeholderAddress).call{value: address(this).balance}("");
        require(os);
    }
}