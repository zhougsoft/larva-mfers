// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


//  _,   _, __, _,_  _,   _, _ __, __, __,  _,
//  |   /_\ |_) | / /_\   |\/| |_  |_  |_) (_ 
//  | , | | | \ |/  | |   |  | |   |   | \ , )
//  ~~~ ~ ~ ~ ~ ~   ~ ~   ~  ~ ~   ~~~ ~ ~  ~ 

// authored by zhoug.eth


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LarvaMfers is ERC721, Ownable {
    using Strings for uint256;

    string baseURI;
    string public PROVENANCE;
    string public hiddenURI;
    string public baseFileExtension = ".json";

    uint256 constant public MAX_SUPPLY = 5000;
    uint256 public cost = 0.0025 ether;
    uint256 public maxMintAmount = 10;
    uint256 public totalSupply;

    bool public mintingIsActive = false;
    bool public collectionHidden = true;


    // ---------------------------------------------------------------------------------- CONSTRUCTOR
    constructor(string memory _initHiddenURI) ERC721("larva mfers", "LARMF") {
        setHiddenURI(_initHiddenURI);
    }


    // ---------------------------------------------------------------------------------- VIEWS
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
    require(
        _exists(tokenId),
        "Token does not exist"
    );
        if (collectionHidden == true) {
           return hiddenURI;
        }
        
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseFileExtension))
            : "";
    }


    // ---------------------------------------------------------------------------------- MINT
    function mint(uint256 _mintAmount) public payable {

        if (msg.sender != owner()) {
            require(mintingIsActive, "Minting must be active");
            require(msg.value >= cost * _mintAmount, "Insufficient ETH sent");
        }
     
        require(_mintAmount > 0, "Must mint at least one token");
        require(_mintAmount <= maxMintAmount, "Transaction would exceed max mint amount");
        require(totalSupply + _mintAmount <= MAX_SUPPLY, "Not enough supply to facilitate transaction");

   
        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, totalSupply + i);
        }
        totalSupply += _mintAmount;
    }


    // ---------------------------------------------------------------------------------- ONLY OWNER
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setHiddenURI(string memory _hiddenURI) public onlyOwner {
        hiddenURI = _hiddenURI;
    }

    function setMintingState(bool _state) public onlyOwner {
        mintingIsActive = _state;
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

    function setProvenance(string memory _provenance) public onlyOwner {
        PROVENANCE = _provenance;
    }

    function setBaseFileExtension(string memory _newBaseFileExtension) public onlyOwner {
        baseFileExtension = _newBaseFileExtension;
    }

    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }
}
